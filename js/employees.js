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

const modal = document.getElementById("employeeModal");

const addBtn = document.getElementById("addEmployeeBtn");
const closeBtn = document.getElementById("closeEmployeeModal");
const cancelBtn = document.getElementById("cancelEmployee");
const saveBtn = document.getElementById("saveEmployee");

if (!modal || !addBtn) {

    console.error("Missing elements in Employees page");

}
else {

    addBtn.addEventListener("click", () => {
        modal.classList.add("show");
    });

    closeBtn?.addEventListener("click", () => {
        modal.classList.remove("show");
    });

    cancelBtn?.addEventListener("click", () => {
        modal.classList.remove("show");
    });

    saveBtn?.addEventListener("click", saveEmployee);

    loadEmployees();

}
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

console.log("window.db =", window.db);
console.log("window.supabaseClient =", window.supabaseClient);

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
        <td>${emp.position || "-"}</td>
        <td>${emp.employee_type || "-"}</td>
        </tr>
        `;
    });
}
// ==========================================
// SAVE EMPLOYEE
// ==========================================

async function saveEmployee() {

    const modal = document.getElementById("employeeModal");
const employeeType = document.getElementById("employeeType").value;

let scheduleIn = "";
let scheduleOut = "";

if (employeeType === "office") {

    scheduleIn = "09:00:00";
    scheduleOut = "18:00:00";

} else if (employeeType === "warehouse") {

    scheduleIn = "08:00:00";
    scheduleOut = "17:00:00";

} else if (employeeType === "driver") {

    scheduleIn = "08:00:00";
    scheduleOut = "17:00:00";

}

const employee = {
    employee_id: document.getElementById("employeeId").value.trim(),
    full_name: document.getElementById("fullName").value.trim(),
    position: document.getElementById("position").value.trim(),
    employee_type: employeeType,

    schedule_in: scheduleIn,
    schedule_out: scheduleOut,
    grace_period: 15,

    status: "AVAILABLE"
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

["employeeId","fullName","position"].forEach(id => {
    const el = document.getElementById(id);
        if (el) el.value = "";
    });

    document.getElementById("employeeType").selectedIndex = 0;
}

} // END SAFETY WRAPPER
