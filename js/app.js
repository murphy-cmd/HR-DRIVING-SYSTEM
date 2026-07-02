// ==========================================
// RILCO HR DRIVING SYSTEM
// APP CONTROLLER
// ==========================================

const app = document.getElementById("app");
const pageTitle = document.getElementById("pageTitle");
const menuItems = document.querySelectorAll(".menu li");

// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    initializeApp();

});

function initializeApp() {

    initializeSidebar();

    initializeLogout();

    loadPage("dashboard");

}

// ==========================================
// SIDEBAR
// ==========================================

function initializeSidebar() {

    menuItems.forEach(item => {

        item.addEventListener("click", () => {

            menuItems.forEach(menu =>
                menu.classList.remove("active")
            );

            item.classList.add("active");

            loadPage(item.dataset.page);

        });

    });

}

// ==========================================
// LOAD PAGE
// ==========================================

async function loadPage(page) {

    try {

        pageTitle.textContent =
            page.charAt(0).toUpperCase() +
            page.slice(1);

        const response =
            await fetch(`pages/${page}.html`);

        if (!response.ok) {

            throw new Error(`${page}.html not found`);

        }

        app.innerHTML =
            await response.text();

        loadPageScript(page);

    }

    catch (error) {

        console.error(error);

        app.innerHTML = `

            <div class="card">

                <h2>404</h2>

                <p>

                    Unable to load

                    <strong>${page}</strong>

                    page.

                </p>

            </div>

        `;

    }

}

// ==========================================
// PAGE SCRIPT
// ==========================================

function loadPageScript(page) {

    const oldScript =
        document.getElementById("page-script");

    if (oldScript) {

        oldScript.remove();

    }

    const script =
        document.createElement("script");

    script.src =
        `js/${page}.js?v=${Date.now()}`;

    script.id = "page-script";

    document.body.appendChild(script);

}

// ==========================================
// LOGOUT
// ==========================================

function initializeLogout() {

    const logout =
        document.getElementById("logoutBtn");

    if (!logout) return;

    logout.addEventListener("click", () => {

        if (!confirm("Logout?")) return;

        location.href = "login.html";

    });

}
