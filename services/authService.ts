import { supabase, Profile, Credits } from './supabaseClient';
import { User, Session } from '@supabase/supabase-js';

export interface AuthState {
    user: User | null;
    profile: Profile | null;
    credits: Credits | null;
    isLoading: boolean;
}

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) throw error;
    return data;
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;
    return data;
};

// Sign in with Google OAuth
export const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/`,
        },
    });

    if (error) throw error;
    return data;
};

// Sign out
export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

// Get current session
export const getSession = async (): Promise<Session | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
};

// Get user profile
export const getProfile = async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }

    return data;
};

// Get user credits
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

// Update profile
export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Send password reset email
export const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
};

// Subscribe to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
    return supabase.auth.onAuthStateChange((event, session) => {
        callback(session?.user ?? null);
    });
};

// Fetch full auth state (user + profile + credits)
export const fetchAuthState = async (): Promise<AuthState> => {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return { user: null, profile: null, credits: null, isLoading: false };
        }

        const [profile, credits] = await Promise.all([
            getProfile(user.id),
            getCredits(user.id),
        ]);

        return { user, profile, credits, isLoading: false };
    } catch (error) {
        console.error('Error fetching auth state:', error);
        return { user: null, profile: null, credits: null, isLoading: false };
    }
};
