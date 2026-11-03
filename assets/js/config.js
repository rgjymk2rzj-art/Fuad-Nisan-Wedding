/* Public site configuration.
   Fill in your Supabase project URL and its *anon / publishable* key
   (Supabase dashboard → Project Settings → API). The anon key is designed to be
   public: Row Level Security in supabase/schema.sql keeps guest data private.
   NEVER put the service_role / secret key here. */
window.FN_CONFIG = {
  supabaseUrl: '',
  supabaseAnonKey: '',
  // Set to true once the optional confirmation-email function is deployed (see docs/SETUP.md).
  emailConfirmations: false,
};
