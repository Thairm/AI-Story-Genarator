import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found. Auth features will not work.');
}

export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
);

// Type definitions for our database
export interface Profile {
    id: string;
    email: string | null;
    display_name: string | null;
    avatar_url: string | null;
    plan: 'free' | 'starter' | 'pro';
    stripe_customer_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface Credits {
    user_id: string;
    paid_credits: number;
    free_credits: number;
    audio_redos_used: number;
    audio_redo_limit: number;
    credits_reset_at: string;
    created_at: string;
    updated_at: string;
}

export interface CreditTransaction {
    id: string;
    user_id: string;
    amount: number;
    type: 'video_generation' | 'audio_redo' | 'subscription_credit' | 'free_credit' | 'refund';
    description: string | null;
    created_at: string;
}

export interface Subscription {
    id: string;
    user_id: string;
    stripe_subscription_id: string | null;
    stripe_price_id: string | null;
    status: string;
    current_period_start: string | null;
    current_period_end: string | null;
    created_at: string;
    updated_at: string;
}
