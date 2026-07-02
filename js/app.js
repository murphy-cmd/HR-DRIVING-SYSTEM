// ==========================================
// RILCO HR DRIVING SYSTEM
// APP CONTROLLER
// ==========================================

const app = document.getElementById("app");
const pageTitle = document.getElementById("pageTitle");
const menuItems = document.querySelectorAll(".menu li");

// ==========================================
// LOAD PAGE
// ==========================================

async function loadPage(page) {

    try {

        // Load HTML
       const file = `./pages/${page}.html`;

console.log(file);

const response = await fetch(file);

console.log(response.status);

        // Header Title
        pageTitle.textContent =
            page.charAt(0).toUpperCase() +
            page.slice(1);

        // Remove previous page script
        const oldScript = document.getElementById("page-script");

        if (oldScript) {
            oldScript.remove();
        }

        // Load page script
        const script = document.createElement("script");

        script.src = `js/${page}.js?v=${Date.now()}`;

        script.id = "page-script";

        script.onload = () => {
            console.log(`${page}.js loaded`);
        };

        script.onerror = () => {
            console.warn(`${page}.js not found`);
        };

        document.body.appendChild(script);

    }

    catch (error) {

        console.error(error);

        app.innerHTML = `
            <div class="card">
                <h2>404</h2>
                <p>${page}.html not found.</p>
            </div>
        `;

    }

}

// ==========================================
// SIDEBAR
// ==========================================

menuItems.forEach(item => {

    item.addEventListener("click", () => {

        menuItems.forEach(i => i.classList.remove("active"));

        item.classList.add("active");

        loadPage(item.dataset.page);

    });

});

// ==========================================
// DEFAULT PAGE
// ==========================================

window.addEventListener("DOMContentLoaded", () => {

    loadPage("dashboard");

});
