// ==========================================
// EMPLOYEE MODULE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    loadEmployees();

});

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
