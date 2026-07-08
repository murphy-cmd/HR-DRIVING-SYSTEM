document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");

    if (form) {
        form.addEventListener("submit", loginUser);
    }

    const togglePassword = document.getElementById("togglePassword");

    if (togglePassword) {

        togglePassword.addEventListener("click", () => {

            const password = document.getElementById("password");

            if (password.type === "password") {

                password.type = "text";

                togglePassword.innerHTML =
                    '<i class="fa-solid fa-eye-slash"></i>';

            } else {

                password.type = "password";

                togglePassword.innerHTML =
                    '<i class="fa-solid fa-eye"></i>';

            }

        });

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

    const { error } = await window.supabaseClient.auth.signInWithPassword({

        email,
        password

    });

    if (error) {

        alert(error.message);

        return;

    }

   const {
    data: { user }
} = await window.supabaseClient.auth.getUser();

const { data: employee } = await window.db
    .from("employees")
    .select("full_name")
    .eq("email", user.email)
    .single();

if (employee) {
    localStorage.setItem("full_name", employee.full_name);
}

const {
    data: { user }
} = await window.supabaseClient.auth.getUser();

const { data: employee, error: employeeError } = await window.db
    .from("employees")
    .select("full_name")
    .eq("email", user.email)
    .single();

if (!employeeError && employee) {
    localStorage.setItem("full_name", employee.full_name);
}

alert("Login Successful!");

window.location.href = "index.html";

}
