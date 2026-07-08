document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");

    if (form) {

        form.addEventListener("submit", loginUser);

    }

});

async function loginUser(e) {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

    if (!email || !password) {

        alert("Please enter your email and password.");

        return;

    }

    const { data, error } = await window.supabaseClient.auth.signInWithPassword({

        email: email,

        password: password

    });

    if (error) {

        alert(error.message);

        return;

    }

    alert("Login Successful!");

    window.location.href = "index.html";

}
