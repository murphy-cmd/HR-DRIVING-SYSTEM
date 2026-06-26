// =====================================================
// RILCO ASSIGNMENT MANAGEMENT
// =====================================================

const db = window.supabaseClient;

// FORM

const employeeSelect =
document.getElementById("employeeSelect");

const projectSelect =
document.getElementById("projectSelect");

const procedureSelect =
document.getElementById("procedureSelect");

const assignmentNotes =
document.getElementById("assignmentNotes");

const assignEmployee =
document.getElementById("assignEmployee");

// TABLES

const assignmentTable =
document.getElementById("assignmentTable");

const historyTable =
document.getElementById("historyTable");

// DASHBOARD

const runningProjects =
document.getElementById("runningProjects");

const workingEmployees =
document.getElementById("workingEmployees");

const assignmentCount =
document.getElementById("assignmentCount");

const hoursToday =
document.getElementById("hoursToday");

// =======================================
// LOAD EMPLOYEES
// =======================================

async function loadEmployees(){

    const { data, error } = await db

    .from("employees")

    .select("*")

    .order("full_name");

    if(error){

        console.log(error);

        return;

    }

    employeeSelect.innerHTML =
    '<option value="">Select Employee</option>';

    data.forEach(emp=>{

        employeeSelect.innerHTML += `

        <option value="${emp.id}">

        ${emp.full_name}

        </option>

        `;

    });

}
// =======================================
// LOAD PROJECTS
// =======================================

async function loadProjects(){

    const { data, error } = await db

    .from("projects")

    .select("*")

    .order("project_name");

    if(error){

        console.log(error);

        return;

    }

    projectSelect.innerHTML =
    '<option value="">Select Project</option>';

    document.getElementById("filterProject").innerHTML =
    '<option value="">All Projects</option>';

    data.forEach(project=>{

        projectSelect.innerHTML += `

        <option value="${project.id}">

        ${project.project_name}

        </option>

        `;

        document.getElementById("filterProject").innerHTML += `

        <option value="${project.id}">

        ${project.project_name}

        </option>

        `;

    });

}
// =======================================
// INITIALIZE
// =======================================

async function initialize(){

    await loadEmployees();

    await loadProjects();

}

initialize();
