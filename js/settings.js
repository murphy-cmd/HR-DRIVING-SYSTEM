console.log("SETTINGS JS LOADED");

// ==========================================
// INIT
// ==========================================

window.initializeSettings = initializeSettings;

async function initializeSettings() {

    await loadProfile();

    document
        .getElementById("saveProfileBtn")
        .addEventListener("click", saveSettings);

}

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
// SAVE SETTINGS
// ==========================================

async function saveSettings() {

    const fullName = document
        .getElementById("settingFullName")
        .value
        .trim();

    const email = document
        .getElementById("settingEmail")
        .value
        .trim();

    const newPassword = document
        .getElementById("newPassword")
        .value
        .trim();

    const confirmPassword = document
        .getElementById("confirmPassword")
        .value
        .trim();

    // Update Name & Email
    const { error: profileError } =
        await window.supabaseClient.auth.updateUser({

            email: email,

            data: {
                full_name: fullName
            }

        });

    if (profileError) {

        alert(profileError.message);
        return;

    }

    // Update Password (optional)
    if (newPassword || confirmPassword) {

        if (newPassword !== confirmPassword) {

            alert("Passwords do not match.");
            return;

        }

        const { error: passwordError } =
            await window.supabaseClient.auth.updateUser({

                password: newPassword

            });

        if (passwordError) {

            alert(passwordError.message);
            return;

        }

    }

    alert("Settings updated successfully.");

    document.getElementById("newPassword").value = "";
    document.getElementById("confirmPassword").value = "";

}
