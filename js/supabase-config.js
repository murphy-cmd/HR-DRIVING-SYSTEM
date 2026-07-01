const SUPABASE_URL =
"https://odpvxqpkqsnzjpkgizeo.supabase.co";

const SUPABASE_ANON_KEY =
"sb_publishable_lK2ut9NJnOaZFJaZMDabmw_qSZxP6L6";

const db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

window.db = db;
