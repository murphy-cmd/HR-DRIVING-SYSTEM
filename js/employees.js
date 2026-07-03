const db = window.supabaseClient;

let modal;

document.addEventListener("DOMContentLoaded", () => {

    modal = document.getElementById("employeeModal");

    setupEvents();
    loadEmployees();

});

// ==========================================
// EVENTS
// ==========================================

function setupEvents() {

    const addBtn = document.getElementById("addEmployeeBtn");
    const closeBtn = document.getElementById("closeEmployeeModal");
    const cancelBtn = document.getElementById("cancelEmployee");
    const saveBtn = document.getElementById("saveEmployee");

    if (addBtn) {
        addBtn.onclick = () => {
            modal.style.display = "flex";
        };
    }

    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = "none";
        };
    }

    if (cancelBtn) {
        cancelBtn.onclick = () => {
            modal.style.display = "none";
        };
    }

    if (saveBtn) {
        saveBtn.onclick = saveEmployee;
    }
}

// ==========================================
// LOAD EMPLOYEES
// ==========================================

async function loadEmployees() {

    const { data, error } = await db
        .from("employees")
        .select("*")
        .order("id");

    if (error) {
        console.error(error);
        return;
    }

    const tbody = document.getElementById("employeeTable");

    tbody.innerHTML = "";

    data.forEach(emp => {

        tbody.innerHTML += `
        <tr>
            <td>${emp.employee_id}</td>
            <td>${emp.full_name}</td>
            <td>${emp.department || "-"}</td>
            <td>${emp.position || "-"}</td>
            <td>${emp.status}</td>
            <td>${emp.employee_type || "-"}</td>
        </tr>
        `;
    });
}

// ==========================================
// SAVE EMPLOYEE (WORKING)
// ==========================================

async function saveEmployee() {

    const employee = {
        employee_id: document.getElementById("employeeId").value.trim(),
        full_name: document.getElementById("fullName").value.trim(),
        position: document.getElementById("position").value.trim(),
        department: document.getElementById("department").value.trim(),
        employee_type: document.getElementById("employeeType").value,
        status: document.getElementById("status").value
    };

    if (!employee.employee_id || !employee.full_name) {
        alert("Complete required fields!");
        return;
    }

    const { error } = await db
        .from("employees")
        .insert([employee]);

    if (error) {
        console.error(error);
        alert("Error saving employee");
        return;
    }

    modal.style.display = "none";

    clearForm();
    loadEmployees();
}

// ==========================================
// CLEAR FORM
// ==========================================

function clearForm() {

    document.getElementById("employeeId").value = "";
    document.getElementById("fullName").value = "";
    document.getElementById("position").value = "";
    document.getElementById("department").value = "";
}
