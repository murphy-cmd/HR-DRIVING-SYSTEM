document.addEventListener("DOMContentLoaded", () => {

    loadEmployees();

});

async function loadEmployees() {

    const {

        data,

        error

    } = await db

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

            <td>${emp.department ?? "-"}</td>

            <td>${emp.position ?? "-"}</td>

            <td>${emp.status}</td>

            <td>

                <button>Edit</button>

            </td>

        </tr>

        `;

    });

}
