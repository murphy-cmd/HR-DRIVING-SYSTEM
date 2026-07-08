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

    // Kunin ang kasalukuyang user
    const {
        data: { user },
        error: userError
    } = await window.supabaseClient.auth.getUser();

    if (userError || !user) {
        alert("Unable to get user information.");
        return;
    }

    // Kunin ang full name sa employees table
    const { data: employee, error: employeeError } = await window.db
        .from("employees")
        .select("full_name")
        .eq("email", user.email)
        .single();

    if (!employeeError && employee) {
        localStorage.setItem("full_name", employee.full_name);
    }

    console.log("Logged User Email:", user.email);
console.log("Employee Record:", employee);
console.log("Employee Error:", employeeError);
console.log("Saved Name:", localStorage.getItem("full_name"));
STEP 2

    alert("Login Successful!");

    window.location.href = "index.html";

}
