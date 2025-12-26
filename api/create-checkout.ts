import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
});

export const config = {
    api: {
        bodyParser: true,
    },
};

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { priceId, userId, userEmail, successUrl, cancelUrl } = req.body;

        if (!priceId || !userId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create or retrieve customer
        let customer;
        const existingCustomers = await stripe.customers.list({
            email: userEmail,
            limit: 1,
        });

        if (existingCustomers.data.length > 0) {
            customer = existingCustomers.data[0];
        } else {
            customer = await stripe.customers.create({
                email: userEmail,
                metadata: {
                    supabase_user_id: userId,
                },
            });
        }

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
            customer: customer.id,
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: successUrl || `${req.headers.origin}/?success=true`,
            cancel_url: cancelUrl || `${req.headers.origin}/?canceled=true`,
            metadata: {
                supabase_user_id: userId,
            },
            subscription_data: {
                metadata: {
                    supabase_user_id: userId,
                },
            },
        });

        return res.status(200).json({ sessionId: session.id, url: session.url });
    } catch (error: any) {
        console.error('Stripe checkout error:', error);
        return res.status(500).json({ error: error.message });
    }
}
