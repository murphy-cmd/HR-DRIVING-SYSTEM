// ===============================
// PROCEDURES SYSTEM
// ===============================

let procedures = [
    {
        name: "Primer Application",
        department: "Painting",
        status: "Active"
    },
    {
        name: "Putty Application",
        department: "Painting",
        status: "Active"
    },
    {
        name: "Sanding",
        department: "Finishing",
        status: "Active"
    }
];

// Load Table
displayProcedures();

function displayProcedures() {

    const table = document.getElementById("procedureTable");

    table.innerHTML = "";

    procedures.forEach((procedure, index) => {

        table.innerHTML += `

        <tr>

            <td>${procedure.name}</td>

            <td>${procedure.department}</td>

            <td>
                <span class="badge ${procedure.status==="Active" ? "bg-success":"bg-danger"}">
                    ${procedure.status}
                </span>
            </td>

            <td>

                <button
                class="btn btn-warning btn-sm"
                onclick="editProcedure(${index})">

                    Edit

                </button>

                <button
                class="btn btn-danger btn-sm"
                onclick="deleteProcedure(${index})">

                    Delete

                </button>

            </td>

        </tr>

        `;

    });

}

// =========================
// SAVE PROCEDURE
// =========================

document.getElementById("saveProcedure").addEventListener("click",addProcedure);

function addProcedure(){

    const name=document.getElementById("procedureName").value.trim();

    const department=document.getElementById("department").value;

    const status=document.getElementById("status").value;

    if(name===""||department===""){

        alert("Please complete all fields.");

        return;

    }

    procedures.push({

        name:name,

        department:department,

        status:status

    });

    displayProcedures();

    clearForm();

}

// =========================
// CLEAR FORM
// =========================

function clearForm(){

    document.getElementById("procedureName").value="";

    document.getElementById("department").selectedIndex=0;

    document.getElementById("status").selectedIndex=0;

}
// =========================
// SEARCH PROCEDURE
// =========================

document.getElementById("search").addEventListener("keyup", function () {

    const keyword = this.value.toLowerCase();

    const rows = document.querySelectorAll("#procedureTable tr");

    rows.forEach(row => {

        row.style.display = row.innerText.toLowerCase().includes(keyword)
            ? ""
            : "none";

    });

});

// =========================
// EDIT PROCEDURE
// =========================

function editProcedure(index){

    const newName = prompt(
        "Procedure Name",
        procedures[index].name
    );

    if(newName===null) return;

    const newDepartment = prompt(
        "Department",
        procedures[index].department
    );

    if(newDepartment===null) return;

    const newStatus = prompt(
        "Status (Active / Inactive)",
        procedures[index].status
    );

    if(newStatus===null) return;

    procedures[index].name = newName;
    procedures[index].department = newDepartment;
    procedures[index].status = newStatus;

    displayProcedures();

}

// =========================
// DELETE PROCEDURE
// =========================

function deleteProcedure(index){

    const confirmDelete = confirm(
        "Are you sure you want to delete this procedure?"
    );

    if(!confirmDelete) return;

    procedures.splice(index,1);

    displayProcedures();

}
