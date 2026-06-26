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

assignEmployee.addEventListener("click", async ()=>{

    if(employeeSelect.value==""){

        alert("Select Employee");

        return;

    }

    if(projectSelect.value==""){

        alert("Select Project");

        return;

    }

    if(procedureSelect.value==""){

        alert("Select Procedure");

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

        start_time: new Date(),

        assigned_by: "Supervisor"

    });

    if(error){

        console.log(error);

        alert(error.message);

        return;

    }

    alert("Employee Assigned Successfully!");

    employeeSelect.value="";
    projectSelect.value="";
    procedureSelect.innerHTML=
    '<option>Select Procedure</option>';
    assignmentNotes.value="";

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
// INITIALIZE
// =======================================

async function initialize(){

    await loadEmployees();

    await loadProjects();

    await loadAssignments();

}

initialize();

