// ==========================================
// HR DRIVING SYSTEM V2
// APP CONTROLLER
// ==========================================

const app = document.getElementById("app");
const pageTitle = document.getElementById("pageTitle");
const menuItems = document.querySelectorAll(".menu li");

// ==========================================
// LOAD PAGE
// ==========================================

async function loadPage(page){

    try{

        const response = await fetch(`pages/${page}.html`);

        const html = await response.text();

        app.innerHTML = html;

        pageTitle.textContent =
            page.charAt(0).toUpperCase() +
            page.slice(1);

    }

    catch(error){

        app.innerHTML = `
            <div class="card">

                <h2>Page Not Found</h2>

                <p>${page}.html not found.</p>

            </div>
        `;

        console.error(error);

    }

}

// ==========================================
// MENU CLICK
// ==========================================

menuItems.forEach(item=>{

    item.addEventListener("click",()=>{

        menuItems.forEach(i=>i.classList.remove("active"));

        item.classList.add("active");

        loadPage(item.dataset.page);

    });

});

// ==========================================
// DEFAULT PAGE
// ==========================================

loadPage("dashboard");
