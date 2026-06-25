// =====================================================
// RILCO PROJECT MANAGEMENT
// =====================================================

const supabase = window.supabaseClient;

const projectName = document.getElementById("projectName");
const client = document.getElementById("client");
const category = document.getElementById("category");
const locationInput = document.getElementById("location");
const startDate = document.getElementById("startDate");
const finishDate = document.getElementById("finishDate");
const status = document.getElementById("status");

const saveProject = document.getElementById("saveProject");

const projectsContainer = document.getElementById("projectsContainer");

const projectTemplate =
document.getElementById("projectCardTemplate");

const searchProject =
document.getElementById("searchProject");

// =====================================
// LOAD CATEGORY
// =====================================

async function loadCategories(){

const {data,error} = await supabase

.from("project_categories")

.select("*")

.order("id");

if(error){

console.log(error);

return;

}

category.innerHTML =

'<option value="">Select Category</option>';

data.forEach(cat=>{

category.innerHTML += `

<option value="${cat.id}">

${cat.category_name}

</option>

`;

});

}

loadCategories();

// =====================================
// SAVE PROJECT
// =====================================

saveProject.addEventListener("click",async()=>{

if(projectName.value==""){

alert("Project Name Required");

return;

}

const {error} = await supabase

.from("projects")

.insert({

project_name:projectName.value,

category_id:category.value,

client:client.value,

location:locationInput.value,

start_date:startDate.value,

expected_finish:finishDate.value,

status:status.value

});

if(error){

alert(error.message);

return;

}

alert("Project Saved");

projectName.value="";
client.value="";
locationInput.value="";
startDate.value="";
finishDate.value="";

loadProjects();

});

// ======================================
// LOAD PROJECTS
// ======================================

async function loadProjects() {

    projectsContainer.innerHTML = "";

    const { data, error } = await supabase

        .from("projects")

        .select(`
            *,
            project_categories(
                category_name
            )
        `)

        .order("created_at", {
            ascending: false
        });

    if (error) {

        console.log(error);

        return;

    }

    data.forEach(project => {

        const card = projectTemplate.content.cloneNode(true);

        card.querySelector(".project-title").textContent =
            project.project_name;

        card.querySelector(".project-client").textContent =
            project.client;

        card.querySelector(".project-category").textContent =
            project.project_categories.category_name;

        card.querySelector(".project-location").textContent =
            project.location;

        card.querySelector(".employee-count").textContent =
            "0";

        card.querySelector(".current-procedure").textContent =
            "Waiting Assignment";

        card.querySelector(".estimated-finish").textContent =
            project.expected_finish;

        // STATUS

        const badge =
            card.querySelector(".badge");

        badge.textContent =
            project.status;

        if (project.status == "Completed") {

            badge.className =
                "badge bg-danger";

        }

        if (project.status == "On Hold") {

            badge.className =
                "badge bg-warning text-dark";

        }

        if (project.status == "Active") {

            badge.className =
                "badge bg-success";

        }

        // Progress Placeholder

        card.querySelector(".project-progress")
            .style.width = "0%";

        // Save ID

        card.querySelector(".edit-project")
            .dataset.id = project.id;

        card.querySelector(".delete-project")
            .dataset.id = project.id;

        projectsContainer.appendChild(card);

    });

}

loadProjects();

// ======================================
// SEARCH PROJECT
// ======================================

searchProject.addEventListener("keyup", () => {

    const keyword =
        searchProject.value.toLowerCase();

    const cards =
        document.querySelectorAll(".project-card");

    cards.forEach(card => {

        const title =
            card.querySelector(".project-title")
                .innerText
                .toLowerCase();

        if (title.includes(keyword)) {

            card.parentElement.style.display =
                "block";

        } else {

            card.parentElement.style.display =
                "none";

        }

    });

});
