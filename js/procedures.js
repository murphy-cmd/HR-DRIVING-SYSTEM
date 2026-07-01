// ==========================================
// PROCEDURES MODULE - PART 1
// RILCO HR SYSTEM
// ==========================================

const supabase = window.supabaseClient;

let procedures = [];
let editId = null;

// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    loadProcedures();

    document
        .getElementById("saveProcedure")
        .addEventListener("click", saveProcedure);

    document
        .getElementById("search")
        .addEventListener("keyup", searchProcedures);

});

// ==========================================
// LOAD PROCEDURES
// ==========================================

async function loadProcedures() {

    const tbody = document.getElementById("procedureTable");

    tbody.innerHTML = `
        <tr>
            <td colspan="4" class="text-center">
                Loading...
            </td>
        </tr>
    `;

    const { data, error } = await supabase

        .from("procedures")

        .select("*")

        .order("order_no", {
            ascending: true
        });

    if (error) {

        console.error(error);

        tbody.innerHTML = `
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
// DISPLAY PROCEDURES
// ==========================================

function displayProcedures(list) {

    const tbody = document.getElementById("procedureTable");

    tbody.innerHTML = "";

    if (list.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">
                    No procedures found.
                </td>
            </tr>
        `;

        return;

    }

    list.forEach(item => {

        tbody.innerHTML += `

            <tr>

                <td>${item.procedure_name}</td>

                <td>${item.category}</td>

                <td>${item.order_no}</td>

                <td>

                    <button
                        class="btn btn-warning btn-sm"
                        onclick="editProcedure('${item.id}')">

                        Edit

                    </button>

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="deleteProcedure('${item.id}')">

                        Delete

                    </button>

                </td>

            </tr>

        `;

    });

}
// ==========================================
// SAVE / UPDATE PROCEDURE
// ==========================================

async function saveProcedure() {

    const procedureName = document
        .getElementById("procedureName")
        .value
        .trim();

    const category = document
        .getElementById("department")
        .value;

    const orderNo = parseInt(
        document.getElementById("orderNo").value
    );

    // Validation
    if (
        procedureName === "" ||
        category === "" ||
        isNaN(orderNo)
    ) {

        alert("Please complete all fields.");

        return;

    }

    // Duplicate Checking
    const { data: duplicate, error: duplicateError } =
        await supabase

            .from("procedures")

            .select("id")

            .eq("procedure_name", procedureName)

            .eq("category", category);

    if (duplicateError) {

        console.error(duplicateError);

        alert("Unable to validate data.");

        return;

    }

    if (
        duplicate.length > 0 &&
        editId === null
    ) {

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

                category: category,

                order_no: orderNo

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

                    category: category,

                    order_no: orderNo

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

    document.getElementById("orderNo").value = "";

}

// ==========================================
// SEARCH
// ==========================================

function searchProcedures() {

    const keyword = document

        .getElementById("search")

        .value

        .toLowerCase();

    const filtered = procedures.filter(item => {

        return (

            item.procedure_name
                .toLowerCase()
                .includes(keyword)

            ||

            item.category
                .toLowerCase()
                .includes(keyword)

            ||

            String(item.order_no)
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

    if (!procedure) {
        alert("Procedure not found.");
        return;
    }

    document.getElementById("procedureName").value =
        procedure.procedure_name;

    document.getElementById("department").value =
        procedure.category;

    document.getElementById("orderNo").value =
        procedure.order_no;

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

    if (!confirm("Are you sure you want to delete this procedure?")) {
        return;
    }

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
// RESET EDIT MODE
// ==========================================

function resetEditMode() {

    editId = null;

    clearForm();

}

// ==========================================
// ENTER KEY TO SAVE
// ==========================================

document.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        const active = document.activeElement;

        if (
            active.tagName === "INPUT" ||
            active.tagName === "SELECT"
        ) {

            event.preventDefault();

            saveProcedure();

        }

    }

});
