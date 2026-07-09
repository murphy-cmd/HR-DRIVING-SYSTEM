if (!window.db) {
    console.error("Database not initialized.");
}

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
// ==========================================
// CHANGE PASSWORD
// ==========================================

document.getElementById("changePasswordBtn").addEventListener("click", async () => {

    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (!newPassword || !confirmPassword) {
        alert("Please fill in all fields.");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    const { error } = await window.supabaseClient.auth.updateUser({
        password: newPassword
    });

    if (error) {
        alert(error.message);
        return;
    }

    alert("Password updated successfully.");

    document.getElementById("newPassword").value = "";
    document.getElementById("confirmPassword").value = "";

});
