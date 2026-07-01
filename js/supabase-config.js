// ==========================================
// RILCO HR DRIVING SYSTEM
// SUPABASE CONFIGURATION
// ==========================================

const SUPABASE_URL =
    "https://odpvxqpkqsnzjpkgizeo.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_lK2ut9NJnOaZFJaZMDabmw_qSZxP6L6";

// Create Supabase Client
const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// Make it available to all pages
window.supabaseClient = supabaseClient;

console.log("✅ Supabase Connected");
