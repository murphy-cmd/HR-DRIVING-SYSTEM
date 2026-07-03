
// ==========================================
// INIT
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById("employeeModal");

    document.getElementById("addEmployeeBtn")?.addEventListener("click", () => {
        modal.classList.add("show");
    });

    document.getElementById("closeEmployeeModal")?.addEventListener("click", () => {
        modal.classList.remove("show");
    });

    document.getElementById("cancelEmployee")?.addEventListener("click", () => {
        modal.classList.remove("show");
    });

    document.getElementById("saveEmployee")?.addEventListener("click", saveEmployee);

    loadEmployees();
});

// ==========================================
// LOAD EMPLOYEES
// ==========================================

async function loadEmployees() {

    const tbody = document.getElementById("employeeTable");
    if (!tbody) return;

    const { data, error } = await db
        .from("employees")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    tbody.innerHTML = "";

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
        console.error(error);
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
