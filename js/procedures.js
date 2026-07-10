// ==========================================
// PROCEDURES MODULE
// RILCO HR SYSTEM
// ==========================================

const procedureDb = window.supabaseClient;

let procedures = [];
let editId = null;

// ==========================================
// INITIALIZE
// ==========================================

window.initializeProcedures = function () {

    loadProcedures();

    const saveBtn = document.getElementById("saveProcedure");
    const searchInput = document.getElementById("search");

    if (saveBtn) {
        saveBtn.onclick = saveProcedure;
    }

    if (searchInput) {
        searchInput.onkeyup = searchProcedures;
    }

};
// ==========================================
// LOAD PROCEDURES
// ==========================================

async function loadProcedures() {

    const tbody = document.getElementById("procedureTable");

    tbody.innerHTML = `
        <tr>
            <td colspan="5" class="text-center">
                Loading...
            </td>
        </tr>
    `;

    const { data, error } = await procedureDb
        .from("procedures")
        .select("*")
        .order("order_no", { ascending: true });

    if (error) {

        console.error(error);

        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-danger text-center">
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
                <td colspan="5" class="text-center">
                    No procedures found.
                </td>
            </tr>
        `;

        return;

    }

    list.forEach(item => {

        const badgeClass =
            item.status === "Inactive"
                ? "bg-danger"
                : "bg-success";

        tbody.innerHTML += `

            <tr>

                <td>${item.procedure_name}</td>

                <td>${item.category}</td>

                <td>${item.order_no}</td>

                <td>

                    <span class="badge ${badgeClass}">
                        ${item.status || "Active"}
                    </span>

                </td>

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

    const status = document
        .getElementById("procedureStatus")
        .value;

    if (
        procedureName === "" ||
        category === "" ||
        isNaN(orderNo)
    ) {

        alert("Please complete all fields.");

        return;

    }

    const { data: duplicate, error: duplicateError } =
        await procedureDb

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

    if (editId !== null) {

        const { error } = await procedureDb

            .from("procedures")

            .update({

                procedure_name: procedureName,

                category: category,

                order_no: orderNo,

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

    else {

        const { error } = await procedureDb

            .from("procedures")

            .insert([

                {

                    procedure_name: procedureName,

                    category: category,

                    order_no: orderNo,

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

    document.getElementById("orderNo").value = "";

    document.getElementById("procedureStatus").value = "Active";

}

// ==========================================
// SEARCH PROCEDURES
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

            ||

            (item.status || "")
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

    document.getElementById("procedureStatus").value =
        procedure.status || "Active";

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

    const { error } = await procedureDb

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

    if (event.key !== "Enter") {
        return;
    }

    const activeElement = document.activeElement;

    if (
        activeElement &&
        (
            activeElement.tagName === "INPUT" ||
            activeElement.tagName === "SELECT"
        )
    ) {

        event.preventDefault();

        saveProcedure();

    }

});

// ==========================================
// END OF PROCEDURES MODULE
// ==========================================
