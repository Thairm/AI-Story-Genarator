import { supabase, Credits, Profile } from './supabaseClient';

// Credit costs
export const CREDIT_COSTS = {
    VIDEO_GENERATION: 100,
    AUDIO_REDO: 5,
};

// Plan configurations
export const PLAN_CONFIG = {
    free: {
        monthlyCredits: 0,
        freeCredits: 500,
        audioRedoLimit: 0,
    },
    starter: {
        monthlyCredits: 3000,
        freeCredits: 500,
        audioRedoLimit: 50,
    },
    pro: {
        monthlyCredits: 6000,
        freeCredits: 500,
        audioRedoLimit: 100,
    },
};

// Get user's current credits
export const getCredits = async (userId: string): Promise<Credits | null> => {
    const { data, error } = await supabase
        .from('credits')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) {
        console.error('Error fetching credits:', error);
        return null;
    }

    return data;
};

// Check if user can generate a video
export const canGenerateVideo = async (userId: string): Promise<{ allowed: boolean; reason?: string }> => {
    const credits = await getCredits(userId);

    if (!credits) {
        return { allowed: false, reason: 'Unable to fetch credits' };
    }

    const totalCredits = credits.paid_credits + credits.free_credits;

    if (totalCredits < CREDIT_COSTS.VIDEO_GENERATION) {
        return {
            allowed: false,
            reason: `Not enough credits. You need ${CREDIT_COSTS.VIDEO_GENERATION} credits to generate a video. You have ${totalCredits}.`
        };
    }

    return { allowed: true };
};

// Check if user can redo audio
export const canRedoAudio = async (userId: string): Promise<{ allowed: boolean; reason?: string }> => {
    const credits = await getCredits(userId);

    if (!credits) {
        return { allowed: false, reason: 'Unable to fetch credits' };
    }

    // Check redo limit
    if (credits.audio_redo_limit === 0) {
        return { allowed: false, reason: 'Audio redo is not available on the Free plan. Upgrade to unlock!' };
    }

    if (credits.audio_redos_used >= credits.audio_redo_limit) {
        return {
            allowed: false,
            reason: `You've used all ${credits.audio_redo_limit} audio redos this month. Wait for reset or upgrade your plan.`
        };
    }

    // Check credits
    const totalCredits = credits.paid_credits + credits.free_credits;
    if (totalCredits < CREDIT_COSTS.AUDIO_REDO) {
        return {
            allowed: false,
            reason: `Not enough credits. You need ${CREDIT_COSTS.AUDIO_REDO} credits to redo audio. You have ${totalCredits}.`
        };
    }

    return { allowed: true };
};

// Use credits for an action
export const useCredits = async (
    userId: string,
    amount: number,
    type: 'video_generation' | 'audio_redo',
    description?: string
): Promise<{ success: boolean; error?: string }> => {
    try {
        const credits = await getCredits(userId);

        if (!credits) {
            return { success: false, error: 'Unable to fetch credits' };
        }

        const totalCredits = credits.paid_credits + credits.free_credits;
        if (totalCredits < amount) {
            return { success: false, error: 'Insufficient credits' };
        }

        // Deduct from free credits first, then paid credits
        let remainingToDeduct = amount;
        let newFreeCredits = credits.free_credits;
        let newPaidCredits = credits.paid_credits;

        if (newFreeCredits >= remainingToDeduct) {
            newFreeCredits -= remainingToDeduct;
            remainingToDeduct = 0;
        } else {
            remainingToDeduct -= newFreeCredits;
            newFreeCredits = 0;
            newPaidCredits -= remainingToDeduct;
        }

        // Update credits
        const updateData: Partial<Credits> = {
            free_credits: newFreeCredits,
            paid_credits: newPaidCredits,
        };

        // If audio redo, also increment the counter
        if (type === 'audio_redo') {
            updateData.audio_redos_used = credits.audio_redos_used + 1;
        }

        const { error: updateError } = await supabase
            .from('credits')
            .update(updateData)
            .eq('user_id', userId);

        if (updateError) {
            console.error('Error updating credits:', updateError);
            return { success: false, error: 'Failed to update credits' };
        }

        // Log transaction
        const { error: transactionError } = await supabase
            .from('credit_transactions')
            .insert({
                user_id: userId,
                amount: -amount,
                type,
                description: description || (type === 'video_generation' ? 'Video generation' : 'Audio redo'),
            });

        if (transactionError) {
            console.error('Error logging transaction:', transactionError);
            // Don't fail the operation, just log the error
        }

        return { success: true };
    } catch (error) {
        console.error('Error using credits:', error);
        return { success: false, error: 'An unexpected error occurred' };
    }
};

// Add credits (for subscription payments)
export const addCredits = async (
    userId: string,
    amount: number,
    type: 'subscription_credit' | 'free_credit' | 'refund',
    description?: string
): Promise<{ success: boolean; error?: string }> => {
    try {
        const credits = await getCredits(userId);

        if (!credits) {
            return { success: false, error: 'Unable to fetch credits' };
        }

        // Add to paid credits (except for free_credit type)
        const updateData: Partial<Credits> = type === 'free_credit'
            ? { free_credits: credits.free_credits + amount }
            : { paid_credits: credits.paid_credits + amount };

        const { error: updateError } = await supabase
            .from('credits')
            .update(updateData)
            .eq('user_id', userId);

        if (updateError) {
            console.error('Error adding credits:', updateError);
            return { success: false, error: 'Failed to add credits' };
        }

        // Log transaction
        await supabase.from('credit_transactions').insert({
            user_id: userId,
            amount,
            type,
            description: description || `Added ${amount} credits`,
        });

        return { success: true };
    } catch (error) {
        console.error('Error adding credits:', error);
        return { success: false, error: 'An unexpected error occurred' };
    }
};

// Reset monthly credits and redo count (called by cron or webhook)
export const resetMonthlyCredits = async (
    userId: string,
    plan: 'free' | 'starter' | 'pro'
): Promise<{ success: boolean; error?: string }> => {
    try {
        const config = PLAN_CONFIG[plan];

        const { error } = await supabase
            .from('credits')
            .update({
                paid_credits: config.monthlyCredits,
                free_credits: config.freeCredits,
                audio_redos_used: 0,
                audio_redo_limit: config.audioRedoLimit,
                credits_reset_at: new Date().toISOString(),
            })
            .eq('user_id', userId);

        if (error) {
            console.error('Error resetting credits:', error);
            return { success: false, error: 'Failed to reset credits' };
        }

        return { success: true };
    } catch (error) {
        console.error('Error resetting credits:', error);
        return { success: false, error: 'An unexpected error occurred' };
    }
};

// Upgrade user plan
export const upgradePlan = async (
    userId: string,
    newPlan: 'starter' | 'pro'
): Promise<{ success: boolean; error?: string }> => {
    try {
        const config = PLAN_CONFIG[newPlan];

        // Update profile
        const { error: profileError } = await supabase
            .from('profiles')
            .update({ plan: newPlan })
            .eq('id', userId);

        if (profileError) {
            console.error('Error updating profile:', profileError);
            return { success: false, error: 'Failed to update plan' };
        }

        // Update credits
        const { error: creditsError } = await supabase
            .from('credits')
            .update({
                paid_credits: config.monthlyCredits,
                free_credits: config.freeCredits,
                audio_redo_limit: config.audioRedoLimit,
                audio_redos_used: 0,
                credits_reset_at: new Date().toISOString(),
            })
            .eq('user_id', userId);

        if (creditsError) {
            console.error('Error updating credits:', creditsError);
            return { success: false, error: 'Failed to update credits' };
        }

        return { success: true };
    } catch (error) {
        console.error('Error upgrading plan:', error);
        return { success: false, error: 'An unexpected error occurred' };
    }
};
