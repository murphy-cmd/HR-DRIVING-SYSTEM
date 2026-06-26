console.log("Employees JS Loaded");

async function saveEmployee() {

    const employeeId =
        document.getElementById("employeeId").value.trim();

    const fullName =
        document.getElementById("fullName").value.trim();

    const position =
        document.getElementById("position").value.trim();

    const employeeType =
        document.getElementById("employeeType").value;

    if (!employeeId || !fullName || !employeeType) {

        alert("Please complete all required fields.");

        return;
    }

    let scheduleIn = null;
    let scheduleOut = null;
    let gracePeriod = 15;

    // OFFICE STAFF
    if (employeeType === "office") {

        scheduleIn = "09:00:00";
        scheduleOut = "18:00:00";
        gracePeriod = 15;

    }

    // WAREHOUSE STAFF
    else if (employeeType === "warehouse") {

        scheduleIn = "08:00:00";
        scheduleOut = "17:00:00";
        gracePeriod = 15;

    }

    // DRIVER
    else if (employeeType === "driver") {

        scheduleIn = null;
        scheduleOut = null;
        gracePeriod = 0;

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
                    schedule_in: scheduleIn,
                    schedule_out: scheduleOut,
                    grace_period: gracePeriod,
                    status: "ACTIVE"
                }
            ]);

    if (error) {

        console.error(error);

        alert(error.message);

        return;
    }

    alert("Employee Saved Successfully!");

    document.getElementById("employeeId").value = "";
    document.getElementById("fullName").value = "";
    document.getElementById("position").value = "";
    document.getElementById("employeeType").selectedIndex = 0;

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

        let type = "";

        if (emp.employee_type === "office") {

            type = "Office Staff";

        } else if (emp.employee_type === "warehouse") {

            type = "Warehouse Staff";

        } else if (emp.employee_type === "driver") {

            type = "Driver";

        }

        html += `
            <tr>
                <td>${emp.employee_id}</td>
                <td>${emp.full_name}</td>
                <td>${emp.position || ""}</td>
                <td>${emp.status || ""}</td>
            </tr>
        `;

    });

    document.getElementById("employeeTable").innerHTML = html;

}

loadEmployees();
