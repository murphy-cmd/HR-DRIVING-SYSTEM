console.log("SETTINGS JS LOADED");

// ==========================================
// INIT
// ==========================================

window.initializeSettings = initializeSettings;

async function initializeSettings() {

    await loadProfile();

    document
        .getElementById("saveProfileBtn")
        .addEventListener("click", saveProfile);

    document
        .getElementById("changePasswordBtn")
        .addEventListener("click", changePassword);

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
// SAVE PROFILE
// ==========================================

async function saveProfile() {

    const fullName = document
        .getElementById("settingFullName")
        .value
        .trim();

    const email = document
        .getElementById("settingEmail")
        .value
        .trim();

    const { error } = await window.supabaseClient.auth.updateUser({

        email: email,

        data: {

            full_name: fullName

        }

    });

    if (error) {

        alert(error.message);
        return;

    }

    alert("Profile updated successfully.");

}

// ==========================================
// CHANGE PASSWORD
// ==========================================

async function changePassword() {

    const newPassword =
        document.getElementById("newPassword").value.trim();

    const confirmPassword =
        document.getElementById("confirmPassword").value.trim();

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

}
