console.log("REGISTER JS LOADED");

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

    const { data, error } = await window.supabaseClient.auth.signUp({

        email: email,

        password: password,

        options: {

            data: {

                full_name: fullName

            }

        }

    });

    if (error) {

        alert(error.message);

        return;

    }

    alert("Account created successfully! Please check your email if confirmation is enabled.");

    window.location.href = "login.html";

}
