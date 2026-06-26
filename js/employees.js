console.log("Employees JS Loaded");

async function saveEmployee() {

    const employeeId =
        document.getElementById("employeeId").value;

    const fullName =
        document.getElementById("fullName").value;

    const position =
        document.getElementById("position").value;
    
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
                employee_type: employeeType,
                
                 schedule_in:
        employeeType === "Warehouse Staff"
            ? "08:00:00"
            : employeeType === "Office Staff"
            ? "09:00:00"
            : null,

    schedule_out:
        employeeType === "Warehouse Staff"
            ? "17:00:00"
            : employeeType === "Office Staff"
            ? "18:00:00"
            : null,

    grace_period:
        employeeType === "Driver"
            ? 0
            : 15,

    status: "ACTIVE"

                
                status: "ACTIVE"
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
