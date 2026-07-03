// ==========================================
// SAFE SUPABASE INIT (NO DUPLICATE DB ERROR)
// ==========================================

const db = window.db || window.supabaseClient;

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
        console.error("Missing elements");
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

    // SAVE EMPLOYEE
    saveBtn?.addEventListener("click", async () => {

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

        const { error } = await db.from("employees").insert([employee]);

        if (error) {
            console.error(error);
            alert("Insert failed");
            return;
        }

        modal.classList.remove("show");
        clearForm();
        loadEmployees();
    });

    loadEmployees();
});

// ==========================================
// LOAD EMPLOYEES
// ==========================================

async function loadEmployees() {

    const tbody = document.getElementById("employeeTable");
    if (!tbody) return;

    const { data, error } = await window.supabaseClient
        .from("employees")
        .select("*")
        .order("id");

    if (error) {
        console.error(error);
        return;
    }

    tbody.innerHTML = "";

    data.forEach(emp => {

        tbody.innerHTML += `
            <tr>
                <td>${emp.employee_id}</td>
                <td>${emp.full_name}</td>
                <td>${emp.department || "-"}</td>
                <td>${emp.position || "-"}</td>
                <td>${emp.status}</td>
            </tr>
        `;
    });
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
