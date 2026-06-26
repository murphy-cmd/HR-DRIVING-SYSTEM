// =====================================================
// RILCO PROJECT MANAGEMENT SYSTEM
// =====================================================

const supabase = window.supabaseClient;

// FORM

const projectName = document.getElementById("projectName");
const client = document.getElementById("client");
const category = document.getElementById("category");
const locationInput = document.getElementById("location");
const startDate = document.getElementById("startDate");
const finishDate = document.getElementById("finishDate");
const status = document.getElementById("status");

const saveProject = document.getElementById("saveProject");

// DISPLAY

const projectsContainer =
document.getElementById("projectsContainer");

const projectTemplate =
document.getElementById("projectCardTemplate");

const searchProject =
document.getElementById("searchProject");

// CATEGORY MAP

const categories = {};
// ============================================
// LOAD CATEGORY
// ============================================

async function loadCategories(){

    const {data,error}=await supabase

    .from("project_categories")

    .select("*")

    .order("id");

    if(error){

        console.error(error);

        return;

    }

    category.innerHTML =
    '<option value="">Select Category</option>';

    data.forEach(cat=>{

        categories[cat.id]=cat.category_name;

        category.innerHTML +=

        `<option value="${cat.id}">
            ${cat.category_name}
        </option>`;

    });

}
// ============================================
// INITIALIZE
// ============================================

async function initialize(){

    await loadCategories();

    await loadProjects();

}

initialize();
// ============================================
// SAVE PROJECT
// ============================================

saveProject.addEventListener("click", async () => {

    if(projectName.value.trim() === ""){

        alert("Please enter the Project Name.");
        return;

    }

    const { error } = await supabase

    .from("projects")

    .insert({

        project_name: projectName.value,

        category_id: Number(category.value),

        client: client.value,

        location: locationInput.value,

        start_date: startDate.value,

        expected_finish: finishDate.value,

        status: status.value

    });

    if(error){

        console.error(error);

        alert(error.message);

        return;

    }

    alert("Project saved successfully!");

    projectName.value = "";
    client.value = "";
    category.value = "";
    locationInput.value = "";
    startDate.value = "";
    finishDate.value = "";
    status.value = "Active";

    loadProjects();

});
// ============================================
// LOAD PROJECTS
// ============================================

async function loadProjects(){

    projectsContainer.innerHTML = "";

    const { data, error } = await supabase

    .from("projects")

    .select("*")

    .order("created_at", { ascending:false });

    if(error){

        console.error(error);

        return;

    }

    data.forEach(project=>{

        const card = projectTemplate.content.cloneNode(true);

        card.querySelector(".project-title").textContent =
        project.project_name;

        card.querySelector(".project-client").textContent =
        project.client;

        card.querySelector(".project-category").textContent =
        categories[project.category_id] || "-";

        card.querySelector(".project-location").textContent =
        project.location;

        card.querySelector(".employee-count").textContent = "0";

        card.querySelector(".current-procedure").textContent =
        "Waiting Assignment";

        card.querySelector(".estimated-finish").textContent =
        project.expected_finish || "-";

        const badge =
        card.querySelector(".badge");

        badge.textContent =
        project.status;

        badge.className = "badge";

        switch(project.status){

            case "Active":

                badge.classList.add("bg-success");

                break;

            case "Completed":

                badge.classList.add("bg-danger");

                break;

            case "On Hold":

                badge.classList.add("bg-warning","text-dark");

                break;

            default:

                badge.classList.add("bg-secondary");

        }

        card.querySelector(".project-progress").style.width="0%";

        card.querySelector(".edit-project").dataset.id =
        project.id;

        card.querySelector(".delete-project").dataset.id =
        project.id;

        projectsContainer.appendChild(card);

    });

}
// ============================================
// SEARCH PROJECT
// ============================================

searchProject.addEventListener("keyup", () => {

    const keyword = searchProject.value.toLowerCase();

    const cards = document.querySelectorAll(".project-card");

    cards.forEach(card => {

        const title = card.querySelector(".project-title")
            .textContent
            .toLowerCase();

        if(title.includes(keyword)){

            card.parentElement.style.display = "";

        }else{

            card.parentElement.style.display = "none";

        }

    });

});
// ============================================
// DELETE PROJECT
// ============================================

async function deleteProject(id){

    const confirmDelete = confirm(
        "Are you sure you want to delete this project?"
    );

    if(!confirmDelete) return;

    const { error } = await supabase

        .from("projects")

        .delete()

        .eq("id", id);

    if(error){

        console.error(error);

        alert(error.message);

        return;

    }

    alert("Project deleted successfully.");

    loadProjects();

}
const deleteBtn = card.querySelector(".delete-project");

deleteBtn.dataset.id = project.id;

deleteBtn.addEventListener("click", () => {

    deleteProject(project.id);

});
