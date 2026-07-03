const db = window.supabaseClient;

// ==========================================
// INITIALIZE EMPLOYEES
// ==========================================

window.initializeEmployees = initializeEmployees;

let modal;

function initializeEmployees() {

    console.log("Employees Initialized");

    modal = document.getElementById("employeeModal");

    if (!modal) return;

    loadEmployees();
}

// ==========================================
// DOM READY
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    modal = document.getElementById("employeeModal");

    loadEmployees();

    setupEvents();

});

// ==========================================
// EVENTS SETUP (SAFE FIX)
// ==========================================

function setupEvents() {

    const addBtn = document.getElementById("addEmployeeBtn");
    const closeBtn = document.getElementById("closeEmployeeModal");
    const cancelBtn = document.getElementById("cancelEmployee");
    const saveBtn = document.getElementById("saveEmployee");
    const search = document.getElementById("employeeSearch");

    if (addBtn) {
        addBtn.onclick = () => modal.classList.add("show");
    }

    if (closeBtn) {
        closeBtn.onclick = () => modal.classList.remove("show");
    }

    if (cancelBtn) {
        cancelBtn.onclick = () => modal.classList.remove("show");
    }

    if (saveBtn) {
        saveBtn.addEventListener("click", saveEmployee);
    }

    if (search) {
        search.addEventListener("input", searchEmployee);
    }
}

// ==========================================
// LOAD EMPLOYEES (NO ACTION BUTTONS)
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

    if (!tbody) return;

    tbody.innerHTML = "";

    data.forEach(emp => {

        let badge = "";

        switch (emp.status) {

            case "WORKING":
                badge = `<span class="status-badge status-working">WORKING</span>`;
                break;

            case "DRIVING":
                badge = `<span class="status-badge status-driving">DRIVING</span>`;
                break;

            case "BREAK":
                badge = `<span class="status-badge status-break">BREAK</span>`;
                break;

            default:
                badge = `<span class="status-badge">${emp.status || "-"}</span>`;
        }

        tbody.innerHTML += `
        <tr>

            <td>
                <img src="${emp.photo_url || 'asset/avatar.png'}"
                     class="table-photo">
            </td>

            <td>${emp.employee_id || "-"}</td>
            <td>${emp.full_name || "-"}</td>
            <td>${emp.department || "-"}</td>
            <td>${emp.position || "-"}</td>
            <td>${badge}</td>

        </tr>
        `;
    });
}

// ==========================================
// SAVE EMPLOYEE
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

    if (employee.employee_id === "" || employee.full_name === "") {
        alert("Please complete required fields.");
        return;
    }

    const { error } = await db
        .from("employees")
        .insert(employee);

    if (error) {
        console.error(error);
        alert(error.message);
        return;
    }

    modal.classList.remove("show");

    clearEmployeeForm();

    loadEmployees();
}

// ==========================================
// CLEAR FORM
// ==========================================

function clearEmployeeForm() {

    document.getElementById("employeeId").value = "";
    document.getElementById("fullName").value = "";
    document.getElementById("position").value = "";
    document.getElementById("department").value = "";
    document.getElementById("employeeType").selectedIndex = 0;
    document.getElementById("status").selectedIndex = 0;
}

// ==========================================
// SEARCH
// ==========================================

function searchEmployee() {

    const keyword = document
        .getElementById("employeeSearch")
        .value
        .toLowerCase();

    const rows = document.querySelectorAll("#employeeTable tr");

    rows.forEach(row => {

        row.style.display =
            row.innerText.toLowerCase().includes(keyword)
                ? ""
                : "none";

    });
}
