// ==========================================
// EMPLOYEE MODULE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    loadEmployees();

});
const modal = document.getElementById("employeeModal");

document.getElementById("addEmployeeBtn").onclick = () => {

    modal.classList.add("show");

};

document.getElementById("closeEmployeeModal").onclick = () => {

    modal.classList.remove("show");

};

document.getElementById("cancelEmployee").onclick = () => {

    modal.classList.remove("show");

};

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
                badge = `<span class="status-badge">${emp.status}</span>`;

        }

        tbody.innerHTML += `

        <tr>

            <td>

                <img
                    src="${emp.photo_url || 'asset/avatar.png'}"
                    class="table-photo">

            </td>

            <td>${emp.employee_id}</td>

            <td>${emp.full_name}</td>

            <td>${emp.department || "-"}</td>

            <td>${emp.position || "-"}</td>

            <td>${badge}</td>

            <td>

                <button class="action-btn view-btn">

                    <i class="fa-solid fa-eye"></i>

                </button>

                <button class="action-btn edit-btn">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button class="action-btn delete-btn">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}
// ==========================================
// SAVE EMPLOYEE
// ==========================================

document
.getElementById("saveEmployee")
.addEventListener("click", saveEmployee);

async function saveEmployee(){

    const employee = {

        employee_id:
        document.getElementById("employeeId").value.trim(),

        full_name:
        document.getElementById("fullName").value.trim(),

        position:
        document.getElementById("position").value.trim(),

        department:
        document.getElementById("department").value.trim(),

        employee_type:
        document.getElementById("employeeType").value,

        status:
        document.getElementById("status").value

    };

    // Validation

    if(
        employee.employee_id==="" ||
        employee.full_name===""){
        
        alert("Please complete the required fields.");

        return;

    }

    const { error } = await db

        .from("employees")

        .insert(employee);

    if(error){

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

function clearEmployeeForm(){

document.getElementById("employeeId").value="";

document.getElementById("fullName").value="";

document.getElementById("position").value="";

document.getElementById("department").value="";

document.getElementById("employeeType").selectedIndex=0;

document.getElementById("status").selectedIndex=0;

}
// ==========================================
// LIVE SEARCH
// ==========================================

document
.getElementById("employeeSearch")
.addEventListener("input", searchEmployee);

function searchEmployee(){

    const keyword =
        document
        .getElementById("employeeSearch")
        .value
        .toLowerCase();

    const rows =
        document
        .querySelectorAll("#employeeTable tr");

    rows.forEach(row=>{

        row.style.display =
            row.innerText
            .toLowerCase()
            .includes(keyword)
            ? ""
            : "none";

    });

}
