console.log("Employees JS Loaded");

async function saveEmployee() {

    const employeeId =
        document.getElementById("employeeId").value;

    const fullName =
        document.getElementById("fullName").value;

    const position =
        document.getElementById("position").value;

    const department =
        document.getElementById("department").value;

    const employeeType =
        document.getElementById("employeeType").value;

    if (!employeeId || !fullName) {

        alert(
            "Employee ID and Full Name are required"
        );

        return;
    }

    const { error } =
        await supabaseClient
        .from("employees")
        .insert([
            {
                employee_id: employeeId,
                full_name: fullName,
                position: position,
                department: department,
                employee_type: employeeType,
                status: "OFF_DUTY"
            }
        ]);

    if (error) {

        console.error(error);

        alert(error.message);

        return;
    }

    alert("Employee Saved");

    document.getElementById(
        "employeeId"
    ).value = "";

    document.getElementById(
        "fullName"
    ).value = "";

    document.getElementById(
        "position"
    ).value = "";

    document.getElementById(
        "department"
    ).value = "";

    loadEmployees();
}

async function loadEmployees() {

    const { data, error } =
        await supabaseClient
        .from("employees")
        .select("*")
        .order("id", {
            ascending: false
        });

    if (error) {

        console.error(error);

        return;
    }

    let html = "";

    data.forEach(emp => {

        html += `
            <tr>
                <td>${emp.employee_id}</td>
                <td>${emp.full_name}</td>
                <td>${emp.position || ""}</td>
                <td>${emp.status || ""}</td>
            </tr>
        `;

    });

    document.getElementById(
        "employeeTable"
    ).innerHTML = html;
}

loadEmployees();
