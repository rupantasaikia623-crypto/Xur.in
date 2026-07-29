import { createClient } from '@supabase/supabase-js';

// Default Supabase project credentials provided
const DEFAULT_SUPABASE_URL = 'https://zgopsdtrleojiuvwvnnm.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpnb3BzZHRybGVvaml1dnd2bm5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzNjc0NDcsImV4cCI6MjA5OTk0MzQ0N30.lJrOgsSDOpxfZdcmtzY6Jz7CNAZB5VJa-BgnWBNkfFs';

// Get Supabase credentials from environment or default
const supabaseUrl = (((import.meta as any).env?.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL)).trim();
const supabaseAnonKey = (((import.meta as any).env?.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY)).trim();

// Check if credentials are set and valid
const checkSupabaseConfig = (): boolean => {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  if (!/^https?:\/\//i.test(supabaseUrl)) return false;
  if (supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder')) return false;
  if (supabaseAnonKey.length < 10) return false;
  return true;
};

export const isSupabaseConfigured = checkSupabaseConfig();

// Initialize Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Robust Auth Proxy interface wrapping live Supabase Auth
 */
export const supabaseAuth = {
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },
  
  signInWithPassword: async ({ email, password }: any) => {
    return supabase.auth.signInWithPassword({ email, password });
  },

  signUp: async ({ email, password, options }: any) => {
    return supabase.auth.signUp({ email, password, options });
  },

  signInWithOAuth: async ({ provider, options }: { provider: 'google' | 'github'; options?: any }) => {
    return supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
        ...options
      }
    });
  },

  signOut: async () => {
    return supabase.auth.signOut();
  },

  updateUser: async ({ data }: any) => {
    return supabase.auth.updateUser({ data });
  },

  getSession: async () => {
    return supabase.auth.getSession();
  }
};

