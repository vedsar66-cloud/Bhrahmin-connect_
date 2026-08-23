// Dummy Supabase client and config to bypass build error
export const getSupabase = () => {
  return null;
};

export const getSupabaseConfig = () => {
  return {
    url: '',
    anonKey: ''
  };
};
