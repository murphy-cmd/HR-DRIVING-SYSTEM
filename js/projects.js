console.log("Projects JS Loaded");

// ============================================
// INITIALIZE PROJECTS
// ============================================

window.initializeProjects = initializeProjects;

function initializeProjects() {

    console.log("Projects Initialized");

    loadCategories();
    loadProjects();

    const saveBtn = document.getElementById("saveProject");

    if (saveBtn) {
        saveBtn.addEventListener("click", saveProject);
    }

    const search = document.getElementById("searchProject");

    if (search) {
        search.addEventListener("keyup", searchProject);
    }

}

// ============================================
// projectDB
// ============================================

const projectDB = window.supabaseClient;

// ============================================
// STATE
// ============================================

let editingProjectId = null;

const categories = {};

// ============================================
// LOAD CATEGORIES
// ============================================

async function loadCategories() {

    const category = document.getElementById("category");

    if (!category) return;

    const { data, error } = await projectDB
        .from("project_categories")
        .select("*")
        .order("id");

    if (error) {
        console.error(error);
        return;
    }

    category.innerHTML = `<option value="">Select Category</option>`;

    data.forEach(cat => {

        categories[cat.id] = cat.category_name;

        category.innerHTML += `
            <option value="${cat.id}">
                ${cat.category_name}
            </option>
        `;

    });

}

// ============================================
// LOAD PROJECTS
// ============================================

async function loadProjects() {

    const container = document.getElementById("projectsContainer");
    const template = document.getElementById("projectCardTemplate");

    if (!container || !template) return;

    container.innerHTML = "";

    const { data, error } = await projectDB
        .from("projects")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    data.forEach(project => {

        const card = template.content.cloneNode(true);

        card.querySelector(".project-title").textContent = project.project_name;
        card.querySelector(".project-client").textContent = project.client;
        card.querySelector(".project-category").textContent = categories[project.category_id] || "-";
        card.querySelector(".project-location").textContent = project.location;
        card.querySelector(".employee-count").textContent = 0;
        card.querySelector(".estimated-finish").textContent = project.expected_finish || "-";
        card.querySelector(".current-procedure").textContent = "Waiting Assignment";

        const badge = card.querySelector(".badge");
        badge.textContent = project.status;

        if (project.status === "Active") badge.classList.add("bg-success");
        else if (project.status === "Completed") badge.classList.add("bg-danger");
        else badge.classList.add("bg-warning", "text-dark");

        // EDIT
        card.querySelector(".edit-project").addEventListener("click", () => {

            editingProjectId = project.id;

            document.getElementById("projectName").value = project.project_name;
            document.getElementById("client").value = project.client;
            document.getElementById("category").value = project.category_id;
            document.getElementById("location").value = project.location;
            document.getElementById("startDate").value = project.start_date;
            document.getElementById("finishDate").value = project.expected_finish;
            document.getElementById("status").value = project.status;

            document.getElementById("saveProject").textContent = "Update Project";

            const modal = new bootstrap.Modal(
    document.getElementById("projectModal")
);

modal.show();

        });

        // DELETE
        card.querySelector(".delete-project").addEventListener("click", async () => {

            await projectDB
                .from("projects")
                .delete()
                .eq("id", project.id);

            loadProjects();

        });

        container.appendChild(card);

    });

}

// ============================================
// SAVE PROJECT
// ============================================

async function saveProject() {

    const data = {

        project_name: document.getElementById("projectName").value,
        client: document.getElementById("client").value,
        category_id: Number(document.getElementById("category").value),
        location: document.getElementById("location").value,
        start_date: document.getElementById("startDate").value,
        expected_finish: document.getElementById("finishDate").value,
        status: document.getElementById("status").value

    };

    if (!data.project_name) {
        alert("Project name required");
        return;
    }

    if (editingProjectId) {

        await projectDB
            .from("projects")
            .update(data)
            .eq("id", editingProjectId);

        editingProjectId = null;

    } else {

        await projectDB
            .from("projects")
            .insert(data);

    }

    document.getElementById("saveProject").textContent = "Save Project";

    loadProjects();

}

// ============================================
// SEARCH
// ============================================

function searchProject() {

    const keyword = document.getElementById("searchProject").value.toLowerCase();

    document.querySelectorAll(".project-card").forEach(card => {

        const title = card.querySelector(".project-title").textContent.toLowerCase();

        card.parentElement.style.display =
            title.includes(keyword) ? "" : "none";

    });

}
