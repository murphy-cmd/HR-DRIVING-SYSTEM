// ==========================================
// PROCEDURES MODULE - PART 1
// Supabase Connection & Load Data
// ==========================================

const supabase = window.supabaseClient;

let procedures = [];
let editId = null;

// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    loadProcedures();

    document
        .getElementById("saveProcedure")
        .addEventListener("click", saveProcedure);

    document
        .getElementById("search")
        .addEventListener("keyup", searchProcedure);
});

// ==========================================
// LOAD PROCEDURES
// ==========================================

async function loadProcedures() {

    const table = document.getElementById("procedureTable");

    table.innerHTML = `
        <tr>
            <td colspan="4" class="text-center">
                Loading...
            </td>
        </tr>
    `;

    const { data, error } = await supabase
        .from("procedures")
        .select("*")
        .order("id", { ascending: true });

    if (error) {

        console.error(error);

        table.innerHTML = `
            <tr>
                <td colspan="4" class="text-danger text-center">
                    Failed to load procedures.
                </td>
            </tr>
        `;

        return;

    }

    procedures = data || [];

    displayProcedures(procedures);

}

// ==========================================
// DISPLAY TABLE
// ==========================================

function displayProcedures(data) {

    const table = document.getElementById("procedureTable");

    table.innerHTML = "";

    if (data.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">
                    No procedures found.
                </td>
            </tr>
        `;

        return;

    }

    data.forEach((procedure) => {

        table.innerHTML += `

        <tr>

            <td>${procedure.procedure_name}</td>

            <td>${procedure.department}</td>

            <td>

                <span class="badge ${
                    procedure.status === "Active"
                        ? "bg-success"
                        : "bg-danger"
                }">

                    ${procedure.status}

                </span>

            </td>

            <td>

                <button
                    class="btn btn-warning btn-sm"
                    onclick="editProcedure(${procedure.id})">

                    Edit

                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="deleteProcedure(${procedure.id})">

                    Delete

                </button>

            </td>

        </tr>

        `;

    });

}
// ==========================================
// SAVE PROCEDURE
// ==========================================

async function saveProcedure() {

    const procedureName = document
        .getElementById("procedureName")
        .value
        .trim();

    const department = document
        .getElementById("department")
        .value;

    const status = document
        .getElementById("status")
        .value;

    // Validation
    if (
        procedureName === "" ||
        department === "" ||
        status === ""
    ) {
        alert("Please complete all fields.");
        return;
    }

    // Duplicate Checking
    const { data: duplicate } = await supabase
        .from("procedures")
        .select("*")
        .eq("procedure_name", procedureName)
        .eq("department", department);

    if (duplicate.length > 0 && editId === null) {

        alert("Procedure already exists.");

        return;

    }

    // ==========================
    // UPDATE
    // ==========================

    if (editId !== null) {

        const { error } = await supabase

            .from("procedures")

            .update({

                procedure_name: procedureName,
                department: department,
                status: status

            })

            .eq("id", editId);

        if (error) {

            console.error(error);

            alert("Failed to update procedure.");

            return;

        }

        alert("Procedure updated successfully.");

        editId = null;

    }

    // ==========================
    // INSERT
    // ==========================

    else {

        const { error } = await supabase

            .from("procedures")

            .insert([

                {

                    procedure_name: procedureName,
                    department: department,
                    status: status

                }

            ]);

        if (error) {

            console.error(error);

            alert("Failed to save procedure.");

            return;

        }

        alert("Procedure added successfully.");

    }

    clearForm();

    loadProcedures();

}

// ==========================================
// CLEAR FORM
// ==========================================

function clearForm() {

    document.getElementById("procedureName").value = "";

    document.getElementById("department").selectedIndex = 0;

    document.getElementById("status").selectedIndex = 0;

}

// ==========================================
// SEARCH
// ==========================================

function searchProcedure() {

    const keyword = document

        .getElementById("search")

        .value

        .toLowerCase();

    const filtered = procedures.filter((procedure) => {

        return (

            procedure.procedure_name
                .toLowerCase()
                .includes(keyword)

            ||

            procedure.department
                .toLowerCase()
                .includes(keyword)

            ||

            procedure.status
                .toLowerCase()
                .includes(keyword)

        );

    });

    displayProcedures(filtered);

}
// ==========================================
// EDIT PROCEDURE
// ==========================================

function editProcedure(id) {

    const procedure = procedures.find(item => item.id === id);

    if (!procedure) return;

    document.getElementById("procedureName").value =
        procedure.procedure_name;

    document.getElementById("department").value =
        procedure.department;

    document.getElementById("status").value =
        procedure.status;

    editId = id;

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

// ==========================================
// DELETE PROCEDURE
// ==========================================

async function deleteProcedure(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this procedure?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase

        .from("procedures")

        .delete()

        .eq("id", id);

    if (error) {

        console.error(error);

        alert("Failed to delete procedure.");

        return;

    }

    alert("Procedure deleted successfully.");

    loadProcedures();

}

// ==========================================
// REFRESH TABLE
// ==========================================

async function refreshTable() {

    await loadProcedures();

}

// ==========================================
// RESET FORM AFTER UPDATE
// ==========================================

function resetEditMode() {

    editId = null;

    clearForm();

}

// ==========================================
// OPTIONAL
// PRESS ENTER TO SAVE
// ==========================================

document.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {

        event.preventDefault();

        saveProcedure();

    }

});
