console.log("Employees JS Loaded");

// ==========================================
// SAFETY CHECK (PREVENT DUPLICATE LOAD BUG)
// ==========================================

if (window.__EMPLOYEES_LOADED__) {
    console.log("Employees already loaded - skipping duplicate");
} else {

window.__EMPLOYEES_LOADED__ = true;

// use global db from supabase-config.js
const db = window.db;

// ==========================================
// INIT
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById("employeeModal");

    const addBtn = document.getElementById("addEmployeeBtn");
    const closeBtn = document.getElementById("closeEmployeeModal");
    const cancelBtn = document.getElementById("cancelEmployee");
    const saveBtn = document.getElementById("saveEmployee");

    if (!modal || !addBtn) {
        console.error("Missing elements in Employees page");
        return;
    }

    // OPEN MODAL
    addBtn.addEventListener("click", () => {
        modal.classList.add("show");
    });

    // CLOSE MODAL
    closeBtn?.addEventListener("click", () => {
        modal.classList.remove("show");
    });

    cancelBtn?.addEventListener("click", () => {
        modal.classList.remove("show");
    });

    // SAVE
    saveBtn?.addEventListener("click", saveEmployee);

    loadEmployees();
});

// ==========================================
// LOAD EMPLOYEES
// ==========================================

async function loadEmployees() {

    const tbody = document.getElementById("employeeTable");

    if (!tbody) {
        console.error("Table body not found");
        return;
    }

    console.log("Loading employees...");

    const { data, error } = await window.supabaseClient
        .from("employees")
        .select("*");

    if (error) {
        console.error("Supabase SELECT ERROR:", error);
        return;
    }

    console.log("Employees data:", data);

    tbody.innerHTML = "";

    if (!data || data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    No employees found
                </td>
            </tr>
        `;
        return;
    }

    data.forEach(emp => {

        tbody.innerHTML += `
        <tr>
            <td>${emp.employee_id || "-"}</td>
            <td>${emp.full_name || "-"}</td>
            <td>${emp.department || "-"}</td>
            <td>${emp.position || "-"}</td>
            <td>${emp.status || "-"}</td>
        </tr>
        `;
    });
}
// ==========================================
// SAVE EMPLOYEE
// ==========================================

async function saveEmployee() {

    const modal = document.getElementById("employeeModal");

    const employee = {
        employee_id: document.getElementById("employeeId").value.trim(),
        full_name: document.getElementById("fullName").value.trim(),
        position: document.getElementById("position").value.trim(),
        department: document.getElementById("department").value.trim(),
        employee_type: document.getElementById("employeeType").value,
        status: document.getElementById("status").value
    };

    if (!employee.employee_id || !employee.full_name) {
        alert("Please complete required fields");
        return;
    }

    const { error } = await db
        .from("employees")
        .insert([employee]);

    if (error) {
        console.error("Insert Error:", error);
        alert(error.message);
        return;
    }

    modal.classList.remove("show");

    clearForm();

    loadEmployees();
}

// ==========================================
// CLEAR FORM
// ==========================================

function clearForm() {

    ["employeeId","fullName","position","department"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });

    document.getElementById("employeeType").selectedIndex = 0;
    document.getElementById("status").selectedIndex = 0;
}

} // END SAFETY WRAPPER
