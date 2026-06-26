// =====================================================
// RILCO ASSIGNMENT MANAGEMENT
// =====================================================

const db = window.supabaseClient;

// =====================================================
// FORM
// =====================================================

const employeeSelect = document.getElementById("employeeSelect");
const projectSelect = document.getElementById("projectSelect");
const procedureSelect = document.getElementById("procedureSelect");
const assignmentNotes = document.getElementById("assignmentNotes");
const assignEmployee = document.getElementById("assignEmployee");

// =====================================================
// TABLES
// =====================================================

const assignmentTable = document.getElementById("assignmentTable");
const historyTable = document.getElementById("historyTable");

// =====================================================
// DASHBOARD
// =====================================================

const runningProjects = document.getElementById("runningProjects");
const workingEmployees = document.getElementById("workingEmployees");
const assignmentCount = document.getElementById("assignmentCount");
const hoursToday = document.getElementById("hoursToday");

// =====================================================
// TRANSFER
// =====================================================

const transferProject = document.getElementById("transferProject");
const transferProcedure = document.getElementById("transferProcedure");
const transferRemarks = document.getElementById("transferRemarks");
const confirmTransfer = document.getElementById("confirmTransfer");

let selectedAssignment = null;

// =====================================================
// LOAD EMPLOYEES
// =====================================================

async function loadEmployees() {

    const { data, error } = await db

        .from("employees")

        .select("id, full_name")

        .order("full_name");

    if (error) {

        console.error(error);

        return;

    }

    employeeSelect.innerHTML =
    `<option value="">Select Employee</option>`;

    data.forEach(emp => {

        employeeSelect.innerHTML += `

<option value="${emp.id}">
${emp.full_name}
</option>

`;

    });

}

// =====================================================
// LOAD PROJECTS
// =====================================================

async function loadProjects() {

    const { data, error } = await db

        .from("projects")

        .select("id, project_name")

        .order("project_name");

    if (error) {

        console.error(error);

        return;

    }

    projectSelect.innerHTML =
    `<option value="">Select Project</option>`;

    const filterProject =
    document.getElementById("filterProject");

    filterProject.innerHTML =
    `<option value="">All Projects</option>`;

    data.forEach(project => {

        projectSelect.innerHTML += `

<option value="${project.id}">
${project.project_name}
</option>

`;

        filterProject.innerHTML += `

<option value="${project.id}">
${project.project_name}
</option>

`;

    });

}

// =====================================================
// LOAD PROCEDURES
// =====================================================

projectSelect.addEventListener("change", async () => {

    procedureSelect.innerHTML =
    `<option value="">Loading...</option>`;

    if (projectSelect.value == "") {

        procedureSelect.innerHTML =
        `<option value="">Select Procedure</option>`;

        return;

    }

    const { data: project } = await db

        .from("projects")

        .select("category_id")

        .eq("id", projectSelect.value)

        .single();

    if (!project) return;

    const { data, error } = await db

        .from("procedures")

        .select("*")

        .eq("category", project.category_id)

        .order("order_no");

    if (error) {

        console.error(error);

        return;

    }

    procedureSelect.innerHTML =
    `<option value="">Select Procedure</option>`;

    data.forEach(proc => {

        procedureSelect.innerHTML += `

<option value="${proc.id}">
${proc.procedure_name}
</option>

`;

    });

});

// =====================================================
// INITIALIZE
// =====================================================

async function initialize() {

    await loadEmployees();

    await loadProjects();

    await loadAssignments();

    await loadProjectStats();

}

initialize();

// =====================================================
// ASSIGN EMPLOYEE
// =====================================================

assignEmployee.addEventListener("click", async () => {

    if (employeeSelect.value === "") {

        alert("Please select an employee.");

        return;

    }

    if (projectSelect.value === "") {

        alert("Please select a project.");

        return;

    }

    if (procedureSelect.value === "") {

        alert("Please select a procedure.");

        return;

    }

    const employeeName =
    employeeSelect.options[
        employeeSelect.selectedIndex
    ].text;

    const projectName =
    projectSelect.options[
        projectSelect.selectedIndex
    ].text;

    const procedureName =
    procedureSelect.options[
        procedureSelect.selectedIndex
    ].text;

    const { error } = await db

        .from("assignments")

        .insert({

            employee_id: employeeSelect.value,

            employee_name: employeeName,

            project_id: projectSelect.value,

            project_name: projectName,

            procedure_id: procedureSelect.value,

            procedure_name: procedureName,

            notes: assignmentNotes.value,

            status: "WORKING",

            start_time: new Date().toISOString(),

            assigned_by: "Supervisor"

        });

    if (error) {

        console.error(error);

        alert(error.message);

        return;

    }

    alert("Employee Assigned Successfully!");

    employeeSelect.value = "";

    projectSelect.value = "";

    procedureSelect.innerHTML =
    `<option value="">Select Procedure</option>`;

    assignmentNotes.value = "";

    loadAssignments();

});

// =====================================================
// LOAD ASSIGNMENTS
// =====================================================

async function loadAssignments() {

    assignmentTable.innerHTML = "";

    const { data, error } = await db

        .from("assignments")

        .select("*")

        .eq("status", "WORKING")

        .order("created_at", {
            ascending: false
        });

    if (error) {

        console.error(error);

        return;

    }

    assignmentCount.textContent =
    data.length;

    workingEmployees.textContent =
    data.length;

    data.forEach(assign => {

        assignmentTable.innerHTML += `

<tr>

<td>${assign.employee_name}</td>

<td>${assign.project_name}</td>

<td>${assign.procedure_name}</td>

<td>

${new Date(assign.start_time)
.toLocaleTimeString()}

</td>

<td
class="elapsed"
data-time="${assign.start_time}">

00:00:00

</td>

<td>

<span class="badge bg-success">

${assign.status}

</span>

</td>

<td>

<button

class="btn btn-warning btn-sm transfer-btn"

data-id="${assign.id}">

<i class="fa-solid fa-right-left"></i>

Transfer

</button>

</td>

</tr>

`;

    });

}

// =====================================================
// PROJECT STATS
// =====================================================

async function loadProjectStats() {

    const { data } = await db

        .from("projects")

        .select("*")

        .eq("status", "Active");

    runningProjects.textContent =
    data.length;

}

// =====================================================
// LIVE TIMER
// =====================================================

function updateElapsedTimers() {

    const timers = document.querySelectorAll(".elapsed");

    timers.forEach(timer => {

        const start = new Date(timer.dataset.time);

        const now = new Date();

        const diff = Math.floor((now - start) / 1000);

        const hours = String(
            Math.floor(diff / 3600)
        ).padStart(2, "0");

        const minutes = String(
            Math.floor((diff % 3600) / 60)
        ).padStart(2, "0");

        const seconds = String(
            diff % 60
        ).padStart(2, "0");

        timer.textContent =
        `${hours}:${minutes}:${seconds}`;

    });

}

setInterval(updateElapsedTimers,1000);

// =====================================================
// HOURS TODAY
// =====================================================

function computeHoursToday(){

    hoursToday.textContent =
    document.querySelectorAll(".elapsed").length;

}

// =====================================================
// SEARCH ASSIGNMENT
// =====================================================

const searchAssignment =
document.getElementById("searchAssignment");

searchAssignment.addEventListener("keyup",()=>{

    const keyword =
    searchAssignment.value.toLowerCase();

    const rows =
    assignmentTable.querySelectorAll("tr");

    rows.forEach(row=>{

        const employee =
        row.children[0].textContent.toLowerCase();

        if(employee.includes(keyword)){

            row.style.display="";

        }

        else{

            row.style.display="none";

        }

    });

});

// =====================================================
// FILTER PROJECT
// =====================================================

const filterProject =
document.getElementById("filterProject");

filterProject.addEventListener("change",()=>{

    const keyword =
    filterProject.options[
    filterProject.selectedIndex
    ].text.toLowerCase();

    const rows =
    assignmentTable.querySelectorAll("tr");

    rows.forEach(row=>{

        if(filterProject.value==""){

            row.style.display="";

            return;

        }

        const project =
        row.children[1].textContent.toLowerCase();

        if(project==keyword){

            row.style.display="";

        }

        else{

            row.style.display="none";

        }

    });

});

// =====================================================
// FILTER STATUS
// =====================================================

const filterStatus =
document.getElementById("filterStatus");

filterStatus.addEventListener("change",()=>{

    const keyword =
    filterStatus.value.toLowerCase();

    const rows =
    assignmentTable.querySelectorAll("tr");

    rows.forEach(row=>{

        if(keyword==""){

            row.style.display="";

            return;

        }

        const status =
        row.children[5]
        .textContent
        .trim()
        .toLowerCase();

        if(status==keyword){

            row.style.display="";

        }

        else{

            row.style.display="none";

        }

    });

});
