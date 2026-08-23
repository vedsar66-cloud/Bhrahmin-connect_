import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve config from Vite environment or local storage override
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const getSupabaseConfig = () => {
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('samaj_supabase_url') : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('samaj_supabase_key') : null;

  const url = localUrl || envUrl || '';
  const key = localKey || envKey || '';
  const isConfigured = Boolean(
    url && 
    key && 
    url !== 'https://your-project.supabase.co' && 
    !url.includes('your-project') &&
    key !== 'your-anon-public-key'
  );

  return { url, key, isConfigured };
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  const { url, key, isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }

  return supabaseInstance;
};

export const resetSupabaseClient = () => {
  supabaseInstance = null;
};
