const db = window.supabaseClient;

document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById("employeeModal");

    const addBtn = document.getElementById("addEmployeeBtn");
    const closeBtn = document.getElementById("closeEmployeeModal");
    const cancelBtn = document.getElementById("cancelEmployee");
    const saveBtn = document.getElementById("saveEmployee");

    // ❗ SAFETY CHECK
    if (!modal || !addBtn) {
        console.log("Missing elements - check HTML IDs");
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
    saveBtn?.addEventListener("click", async () => {

        const employee = {
            employee_id: document.getElementById("employeeId").value,
            full_name: document.getElementById("fullName").value,
            position: document.getElementById("position").value,
            department: document.getElementById("department").value,
            employee_type: document.getElementById("employeeType").value,
            status: document.getElementById("status").value
        };

        if (!employee.employee_id || !employee.full_name) {
            alert("Fill required fields");
            return;
        }

        const { error } = await db.from("employees").insert([employee]);

        if (error) {
            console.log(error);
            alert("Insert failed");
            return;
        }

        modal.classList.remove("show");

        loadEmployees();
    });

    loadEmployees();
});

async function loadEmployees() {

    const tbody = document.getElementById("employeeTable");

    if (!tbody) return;

    const { data, error } = await window.supabaseClient
        .from("employees")
        .select("*")
        .order("id");

    if (error) {
        console.log(error);
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
