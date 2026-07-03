const SUPABASE_URL = "https://odpvxqpkqsnzjpkgizeo.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_lK2ut9NJnOaZFJaZMDabmw_qSZxP6L6";

console.log("window.db =", window.db);
console.log("window.supabaseClient =", window.supabaseClient);

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

window.db = supabaseClient;
window.supabaseClient = supabaseClient;

console.log("Supabase Ready");
