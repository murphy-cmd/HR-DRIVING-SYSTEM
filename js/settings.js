const db = window.db;

// ==========================================
// INIT SETTINGS
// ==========================================

async function initializeSettings() {

    await loadProfile();

}

window.initializeSettings = initializeSettings;

// ==========================================
// LOAD PROFILE
// ==========================================

async function loadProfile() {

    const {
        data: { user },
        error
    } = await window.supabaseClient.auth.getUser();

    if (error || !user) {
        alert("Unable to load account.");
        return;
    }

    document.getElementById("settingFullName").value =
        user.user_metadata?.full_name || "";

    document.getElementById("settingEmail").value =
        user.email || "";

}
