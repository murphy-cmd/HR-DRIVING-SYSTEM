document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registerForm");

    form.addEventListener("submit", registerUser);

});

async function registerUser(e) {

    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

    if (!fullName || !email || !password) {

        alert("Please fill in all fields.");

        return;

    }

    alert("Registration page is ready.\n\nNext step: We will connect this to Supabase.");

}
