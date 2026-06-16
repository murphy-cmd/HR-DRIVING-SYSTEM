const SUPABASE_URL =
  "https://odpvxqpkqsnzjpkgizeo.supabase.co";

const SUPABASE_ANON_KEY =
  "ILAGAY_DITO_ANG_BUONG_PUBLISHABLE_KEY";

const supabaseClient =
  supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

console.log("Supabase Connected");
