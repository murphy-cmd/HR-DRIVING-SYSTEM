let currentEmployee = null;

async function searchEmployee() {

    const employeeId =
        document
        .getElementById("searchEmployee")
        .value
        .trim();

    if (!employeeId) {

        alert("Enter Employee ID");

        return;
    }

    const { data, error } =
        await supabaseClient
            .from("employees")
            .select("*")
            .eq("employee_id", employeeId)
            .single();

    if (error || !data) {

        alert("Employee Not Found");

        document.getElementById(
            "employeeCard"
        ).innerHTML = "";

        return;
    }

    currentEmployee = data;

    document.getElementById(
        "employeeCard"
    ).innerHTML = `

    <div class="card p-4">

        <h3>${data.full_name}</h3>

        <hr>

        <p>
            Employee ID:
            <strong>${data.employee_id}</strong>
        </p>

        <p>
            Position:
            <strong>${data.position || "-"}</strong>
        </p>

        <p>
            Department:
            <strong>${data.department || "-"}</strong>
        </p>

        <p>
            Status:
            <strong>${data.status}</strong>
        </p>

        <div class="row">

            <div class="col-md-3 mb-2">

                <button
                class="btn btn-success w-100"
                onclick="recordAction('TIME_IN')">

                TIME IN

                </button>

            </div>

            <div class="col-md-3 mb-2">

                <button
                class="btn btn-danger w-100"
                onclick="recordAction('TIME_OUT')">

                TIME OUT

                </button>

            </div>

            <div class="col-md-3 mb-2">

                <button
                class="btn btn-warning w-100"
                onclick="recordAction('BREAK_OUT')">

                BREAK OUT

                </button>

            </div>

            <div class="col-md-3 mb-2">

                <button
                class="btn btn-info w-100"
                onclick="recordAction('BREAK_IN')">

                BREAK IN

                </button>

            </div>

        </div>

        <div class="row mt-2">

            <div class="col-md-6">

                <button
                class="btn btn-dark w-100"
                onclick="startTrip()">

                START TRIP

                </button>

            </div>

            <div class="col-md-6">

                <button
                class="btn btn-secondary w-100"
                onclick="endTrip()">

                END TRIP

                </button>

            </div>

        </div>

    </div>

    `;
}

async function recordAction(action) {

    if (!currentEmployee) {

        alert("Search Employee First");

        return;
    }

    const { error } =
        await supabaseClient
            .from("attendance")
            .insert([
                {
                    employee_id:
                        currentEmployee.employee_id,

                    action:
                        action
                }
            ]);

    if(error){

        console.error(error);

        alert(error.message);

        return;
    }

    let newStatus =
        currentEmployee.status;

    if(action === "TIME_IN")
        newStatus = "AVAILABLE";

    if(action === "TIME_OUT")
        newStatus = "OFF_DUTY";

    if(action === "BREAK_OUT")
        newStatus = "BREAK";

    if(action === "BREAK_IN")
        newStatus = "AVAILABLE";

    await supabaseClient
        .from("employees")
        .update({
            status: newStatus
        })
        .eq(
            "employee_id",
            currentEmployee.employee_id
        );

    alert(action + " Recorded");

    searchEmployee();
}

async function startTrip() {

    if(!currentEmployee){

        alert("Search Employee First");

        return;
    }

    await supabaseClient
        .from("employees")
        .update({
            status: "DRIVING"
        })
        .eq(
            "employee_id",
            currentEmployee.employee_id
        );

    alert("Trip Started");

    searchEmployee();
}

async function endTrip() {

    if(!currentEmployee){

        alert("Search Employee First");

        return;
    }

    await supabaseClient
        .from("employees")
        .update({
            status: "AVAILABLE"
        })
        .eq(
            "employee_id",
            currentEmployee.employee_id
        );

    alert("Trip Ended");

    searchEmployee();
}
