import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
});

const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Plan configuration
const PLAN_CONFIG: Record<string, { plan: string; credits: number; freeCredits: number; redoLimit: number }> = {
    'price_1SikWL2MV8tNdeiZWcfVCKWc': { plan: 'starter', credits: 3000, freeCredits: 500, redoLimit: 50 },
    'price_1SikWu2MV8tNdeiZpwgC2gOZ': { plan: 'pro', credits: 6000, freeCredits: 500, redoLimit: 100 },
};

export const config = {
    api: {
        bodyParser: false, // Stripe requires raw body for webhook verification
    },
};

async function getRawBody(req: any): Promise<Buffer> {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
}

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error('Missing STRIPE_WEBHOOK_SECRET');
        return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    let event: Stripe.Event;

    try {
        const rawBody = await getRawBody(req);
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                await handleCheckoutComplete(session);
                break;
            }
            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionUpdate(subscription);
                break;
            }
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionCanceled(subscription);
                break;
            }
            case 'invoice.payment_succeeded': {
                const invoice = event.data.object as Stripe.Invoice;
                await handlePaymentSucceeded(invoice);
                break;
            }
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return res.status(200).json({ received: true });
    } catch (error: any) {
        console.error('Webhook handler error:', error);
        return res.status(500).json({ error: error.message });
    }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.supabase_user_id;
    const subscriptionId = session.subscription as string;

    if (!userId) {
        console.error('No user ID in session metadata');
        return;
    }

    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0]?.price.id;
    const planConfig = PLAN_CONFIG[priceId];

    if (!planConfig) {
        console.error('Unknown price ID:', priceId);
        return;
    }

    // Update user profile
    await supabaseAdmin
        .from('profiles')
        .update({
            plan: planConfig.plan,
            stripe_customer_id: session.customer as string,
        })
        .eq('id', userId);

    // Update credits
    await supabaseAdmin
        .from('credits')
        .update({
            paid_credits: planConfig.credits,
            free_credits: planConfig.freeCredits,
            audio_redo_limit: planConfig.redoLimit,
            audio_redos_used: 0,
            credits_reset_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

    // Create subscription record
    await supabaseAdmin.from('subscriptions').upsert({
        user_id: userId,
        stripe_subscription_id: subscriptionId,
        stripe_price_id: priceId,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    });

    console.log(`User ${userId} upgraded to ${planConfig.plan}`);
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
    const userId = subscription.metadata?.supabase_user_id;
    if (!userId) return;

    const priceId = subscription.items.data[0]?.price.id;
    const planConfig = PLAN_CONFIG[priceId];

    await supabaseAdmin
        .from('subscriptions')
        .update({
            status: subscription.status,
            stripe_price_id: priceId,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id);

    if (planConfig) {
        await supabaseAdmin
            .from('profiles')
            .update({ plan: planConfig.plan })
            .eq('id', userId);
    }
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
    const userId = subscription.metadata?.supabase_user_id;
    if (!userId) return;

    // Downgrade to free
    await supabaseAdmin
        .from('profiles')
        .update({ plan: 'free' })
        .eq('id', userId);

    await supabaseAdmin
        .from('credits')
        .update({
            paid_credits: 0,
            free_credits: 500,
            audio_redo_limit: 0,
        })
        .eq('user_id', userId);

    await supabaseAdmin
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('stripe_subscription_id', subscription.id);

    console.log(`User ${userId} subscription canceled, downgraded to free`);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
    // Only handle subscription renewals (not first payment)
    if (invoice.billing_reason !== 'subscription_cycle') return;

    const subscriptionId = invoice.subscription as string;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const userId = subscription.metadata?.supabase_user_id;

    if (!userId) return;

    const priceId = subscription.items.data[0]?.price.id;
    const planConfig = PLAN_CONFIG[priceId];

    if (!planConfig) return;

    // Refresh credits for the new billing period
    await supabaseAdmin
        .from('credits')
        .update({
            paid_credits: planConfig.credits,
            free_credits: planConfig.freeCredits,
            audio_redos_used: 0,
            credits_reset_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

    console.log(`User ${userId} credits refreshed for new billing period`);
}
