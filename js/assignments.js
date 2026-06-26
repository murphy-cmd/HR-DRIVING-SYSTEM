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
// TRANSFER
// =======================================

const transferProject =
document.getElementById("transferProject");

const transferProcedure =
document.getElementById("transferProcedure");

const transferRemarks =
document.getElementById("transferRemarks");

const confirmTransfer =
document.getElementById("confirmTransfer");

let selectedAssignment = null;

// =======================================
// LOAD EMPLOYEES
// =======================================

async function loadEmployees(){

    const { data, error } = await db

    .from("employees")

    .select("*")

    .order("full_name");

   if(error){

    console.error(error);

    alert(error.message);

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

    console.error(error);

    alert(error.message);

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
// LOAD PROCEDURES BASED ON PROJECT
// =======================================

projectSelect.addEventListener("change", async () => {

    procedureSelect.innerHTML =
    '<option value="">Loading...</option>';

    if (projectSelect.value == "") {

        procedureSelect.innerHTML =
        '<option value="">Select Procedure</option>';

        return;

    }

    // Kunin ang category ng project

    const { data: project, error: projectError } = await db

        .from("projects")

        .select("category_id")

        .eq("id", projectSelect.value)

        .single();

    if (projectError) {

        console.log(projectError);

        return;

    }

    // Kunin ang lahat ng procedures ng category

    const { data: procedures, error } = await db

        .from("procedures")

        .select("*")

        .eq("category", project.category_id)

        .order("order_no");

    if (error) {

        console.log(error);

        return;

    }

    procedureSelect.innerHTML =
    '<option value="">Select Procedure</option>';

    procedures.forEach(proc => {

        procedureSelect.innerHTML += `

<option value="${proc.id}">
${proc.procedure_name}
</option>

`;

    });

});
// =======================================
// LOAD PROCEDURES
// =======================================

projectSelect.addEventListener("change", async () => {

    procedureSelect.innerHTML =
    '<option value="">Loading...</option>';

    if(projectSelect.value == ""){

        procedureSelect.innerHTML =
        '<option value="">Select Procedure</option>';

        return;

    }

    // Kunin muna ang category ng project

    const { data: projectData } = await db

    .from("projects")

    .select("category_id")

    .eq("id", projectSelect.value)

    .single();

    if(!projectData) return;

    // Kunin lahat ng procedures ng category

    const { data, error } = await db

    .from("procedures")

    .select("*")

    .eq("category", projectData.category_id)

    .order("order_no");

    if(error){

        console.log(error);

        return;

    }

    procedureSelect.innerHTML =
    '<option value="">Select Procedure</option>';

    data.forEach(proc=>{

        procedureSelect.innerHTML += `

        <option value="${proc.id}">

        ${proc.procedure_name}

        </option>

        `;

    });

});

// =======================================
// ASSIGN EMPLOYEE
// =======================================

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
        employeeSelect.options[employeeSelect.selectedIndex].text;

    const projectName =
        projectSelect.options[projectSelect.selectedIndex].text;

    const procedureName =
        procedureSelect.options[procedureSelect.selectedIndex].text;

    const { error } = await db

        .from("assignments")

        .insert({

            employee_id: Number(employeeSelect.value),

            employee_name: employeeName,

            project_id: Number(projectSelect.value),

            project_name: projectName,

            procedure_id: Number(procedureSelect.value),

            procedure_name: procedureName,

            start_time: new Date().toISOString(),

            status: "WORKING",

            notes: assignmentNotes.value,

            assigned_by: "Supervisor"

        });

    if (error) {

        console.error(error);

        alert(error.message);

        return;

    }

    alert("Employee assigned successfully!");

    employeeSelect.value = "";

    projectSelect.value = "";

    procedureSelect.innerHTML =
    '<option value="">Select Procedure</option>';

    assignmentNotes.value = "";

    loadAssignments();

});
// =======================================
// LOAD ASSIGNMENTS
// =======================================

async function loadAssignments(){

    assignmentTable.innerHTML="";

    const { data, error } = await db

    .from("assignments")

    .select("*")

    .eq("status","WORKING")

    .order("created_at",{
        ascending:false
    });

    if(error){

        console.log(error);

        return;

    }

    data.forEach(assign=>{

        assignmentTable.innerHTML += `

<tr>

<td>${assign.employee_name}</td>

<td>${assign.project_name}</td>

<td>${assign.procedure_name}</td>

<td>

${new Date(assign.start_time)

.toLocaleTimeString()}

</td>

<td class="elapsed"

data-start="${assign.start_time}">

00:00

</td>

<td>

<span class="badge bg-success">

WORKING

</span>

</td>

<td>

<button
class="btn btn-warning btn-sm">

Transfer

</button>

</td>

</tr>

`;

    });

}
// =======================================
// LIVE TIMER
// =======================================

function updateElapsedTimers() {

    const timers = document.querySelectorAll(".elapsed");

    timers.forEach(timer => {

        const start = new Date(
            timer.dataset.time
        );

        const now = new Date();

        const diff =
        Math.floor((now - start) / 1000);

        const hours =
        String(Math.floor(diff / 3600))
        .padStart(2, "0");

        const minutes =
        String(Math.floor((diff % 3600) / 60))
        .padStart(2, "0");

        const seconds =
        String(diff % 60)
        .padStart(2, "0");

        timer.textContent =
        `${hours}:${minutes}:${seconds}`;

    });

}

setInterval(updateElapsedTimers,1000);
// =======================================
// LOAD PROJECT STATS
// =======================================

async function loadProjectStats(){

    const { data } = await db

    .from("projects")

    .select("*")

    .eq("status","Active");

    runningProjects.textContent =
    data.length;

}
// =======================================
// HOURS TODAY
// =======================================

function computeHoursToday(){

    const timers =
    document.querySelectorAll(".elapsed");

    hoursToday.textContent =
    timers.length;

}
// =======================================
// LOAD LIVE ASSIGNMENTS
// =======================================

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

        console.log(error);

        return;

    }

    assignmentCount.textContent = data.length;

    workingEmployees.textContent = data.length;

    data.forEach(assign => {

        assignmentTable.innerHTML += `

<tr>

<td>${assign.employee_name}</td>

<td>${assign.project_name}</td>

<td>${assign.procedure_name}</td>

<td>

${new Date(assign.start_time).toLocaleTimeString()}

</td>

<td class="elapsed"

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
// =======================================
// INITIALIZE
// =======================================

async function initialize(){

    await loadEmployees();

    await loadProjects();

    await loadAssignments();

    await loadProjectStats();

}

initialize();
