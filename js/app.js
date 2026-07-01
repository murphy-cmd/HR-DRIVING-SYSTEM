// ==========================================
// HR DRIVING SYSTEM V2
// APP CONTROLLER
// ==========================================

const app = document.getElementById("app");
const pageTitle = document.getElementById("pageTitle");
const menuItems = document.querySelectorAll(".menu li");

async function loadPage(page){

    try{

        // Load HTML
        const response = await fetch(`pages/${page}.html`);

        const html = await response.text();

        app.innerHTML = html;

        // Change Header Title
        pageTitle.textContent =
            page.charAt(0).toUpperCase() +
            page.slice(1);

        // Remove previous page script
        const oldScript = document.getElementById("page-script");

        if(oldScript){

            oldScript.remove();

        }

        // Load page JS
        const script = document.createElement("script");

        script.src = `js/${page}.js`;

        script.id = "page-script";

        document.body.appendChild(script);

    }

    catch(error){

        console.error(error);

        app.innerHTML=`

        <div class="card">

            <h2>Page Not Found</h2>

            <p>${page}.html was not found.</p>

        </div>

        `;

    }

}

// Menu Click
menuItems.forEach(item=>{

    item.addEventListener("click",()=>{

        menuItems.forEach(i=>i.classList.remove("active"));

        item.classList.add("active");

        loadPage(item.dataset.page);

    });

});

// Default Page
loadPage("dashboard");
