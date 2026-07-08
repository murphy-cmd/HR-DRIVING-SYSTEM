console.log("App Loaded");

// ==========================================
// CORE ELEMENTS
// ==========================================

const app = document.getElementById("app");
const pageTitle = document.getElementById("pageTitle");
const menuItems = document.querySelectorAll(".menu li");

// ==========================================
// INITIALIZE APP
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    initializeSidebar();
    initializeLogout();
    loadPage("dashboard");

});

// ==========================================
// SIDEBAR
// ==========================================

function initializeSidebar() {

    menuItems.forEach(item => {

        item.addEventListener("click", () => {

            menuItems.forEach(i => i.classList.remove("active"));

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
            page.charAt(0).toUpperCase() + page.slice(1);

        const res = await fetch(`pages/${page}.html`);

        if (!res.ok) throw new Error("Page not found");

        app.innerHTML = await res.text();

        loadPageScript(page);

    } catch (err) {

        console.error(err);

        app.innerHTML = `<div class="card"><h2>404</h2></div>`;

    }

}

// ==========================================
// LOAD SCRIPT (NO DUPLICATES)
// ==========================================

const loadedScripts = {};


function loadPageScript(page) {

    const fnName =
        "initialize" +
        page.charAt(0).toUpperCase() +
        page.slice(1);

    // if already loaded → just re-run init
    if (loadedScripts[page]) {

        if (typeof window[fnName] === "function") {
            window[fnName]();
        }

        return;

    }

    const script = document.createElement("script");

    script.src = `js/${page}.js?v=${Date.now()}`;
    script.id = "page-script";

    script.onload = () => {

        loadedScripts[page] = true;

        if (typeof window[fnName] === "function") {
            window[fnName]();
        }

    };

    script.onerror = () => {
        console.error(page + " failed to load");
    };

    document.body.appendChild(script);

}

// ==========================================
// LOGOUT
// ==========================================

// ==========================================
// LOGOUT
// ==========================================

function initializeLogout() {

    const logout = document.getElementById("logoutBtn");

    if (!logout) return;

    logout.addEventListener("click", async () => {

        const confirmLogout = confirm("Are you sure you want to logout?");

        if (!confirmLogout) return;

        try {

            if (window.supabaseClient) {
                await window.supabaseClient.auth.signOut();
            }

        } catch (err) {

            console.error(err);

        }

window.location.href = "login.html";        
    });

}

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.querySelector(".sidebar");

if (menuToggle && sidebar) {

    menuToggle.addEventListener("click", () => {

        sidebar.classList.toggle("collapsed");

    });

}


