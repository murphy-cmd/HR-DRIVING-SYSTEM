let currentEmployee = null;

async function searchEmployee() {
    const employeeId = document.getElementById("searchEmployee").value.trim();

    if (!employeeId) {
        alert("Enter Employee ID");
        return;
    }

    const { data, error } = await supabaseClient
        .from("employees")
        .select("*")
        .eq("employee_id", employeeId)
        .single();

    if (error || !data) {
        alert("Employee Not Found");
        document.getElementById("employeeCard").innerHTML = "";
        return;
    }

    currentEmployee = data;
    renderEmployeeCard();
}

function renderEmployeeCard() {

    let tripButtons = "";

    if (currentEmployee.employee_type === "driver") {
        tripButtons = `
            <hr>

            <div class="row">

                <div class="col-md-6 mb-2">
                    <button class="btn btn-dark w-100" onclick="startTrip()">
                        START TRIP
                    </button>
                </div>

                <div class="col-md-6 mb-2">
                    <button class="btn btn-secondary w-100" onclick="endTrip()">
                        END TRIP
                    </button>
                </div>

            </div>
        `;
    }

    document.getElementById("employeeCard").innerHTML = `
        <div class="card p-4">

            <button
                class="btn btn-outline-secondary mb-3"
                onclick="goBack()">
                ← BACK
            </button>

            <h3>${currentEmployee.full_name}</h3>

            <hr>

            <p>
                Employee ID:
                <strong>${currentEmployee.employee_id}</strong>
            </p>

            <p>
                Position:
                <strong>${currentEmployee.position || "-"}</strong>
            </p>

            <p>
                Department:
                <strong>${currentEmployee.department || "-"}</strong>
            </p>

            <p>
                Employee Type:
                <strong>${currentEmployee.employee_type}</strong>
            </p>

            <p>
                Status:
                <strong>${currentEmployee.status}</strong>
            </p>

            <p>
                Date:
                <strong>${new Date().toLocaleDateString()}</strong>
            </p>

            <p>
                Time:
                <strong>${new Date().toLocaleTimeString()}</strong>
            </p>

            <div class="row">

                <div class="col-md-4 mb-2">
                    <button
                        class="btn btn-success w-100"
                        onclick="timeIn()">
                        TIME IN
                    </button>
                </div>

                <div class="col-md-4 mb-2">
                    <button
                        class="btn btn-warning w-100"
                        onclick="toggleBreak()">
                        BREAK
                    </button>
                </div>

                <div class="col-md-4 mb-2">
                    <button
                        class="btn btn-danger w-100"
                        onclick="timeOut()">
                        TIME OUT
                    </button>
                </div>

            </div>

            ${tripButtons}

        </div>
    `;
}

async function logAction(action) {

    const philippinesTime =
        new Date().toLocaleString(
            "sv-SE",
            {
                timeZone: "Asia/Manila"
            }
        );

    await supabaseClient
        .from("attendance_logs")
        .insert([
            {
                employee_id: currentEmployee.employee_id,
                employee_name: currentEmployee.full_name,
                action: action,
                log_time: philippinesTime
            }
        ]);
}

async function updateStatus(status) {

    await supabaseClient
        .from("employees")
        .update({
            status: status
        })
        .eq("employee_id", currentEmployee.employee_id);

    currentEmployee.status = status;

    renderEmployeeCard();
}

async function timeIn() {

    await logAction("TIME_IN");

    if (currentEmployee.employee_type === "driver") {
        await updateStatus("AVAILABLE");
    } else {
        await updateStatus("WORKING");
    }
}

async function timeOut() {

    await logAction("TIME_OUT");

    await updateStatus("OFF_DUTY");
}

async function toggleBreak() {

    if (currentEmployee.status === "ON_BREAK") {

        await logAction("BREAK_END");

        if (currentEmployee.employee_type === "driver") {
            await updateStatus("AVAILABLE");
        } else {
            await updateStatus("WORKING");
        }

    } else {

        await logAction("BREAK_START");
        await updateStatus("ON_BREAK");
    }
}

async function startTrip() {

    if (currentEmployee.employee_type !== "driver") {
        return;
    }

    await logAction("START_TRIP");
    await updateStatus("DRIVING");
}

async function endTrip() {

    if (currentEmployee.employee_type !== "driver") {
        return;
    }

    await logAction("END_TRIP");
    await updateStatus("AVAILABLE");
}

function goBack() {

    currentEmployee = null;

    document.getElementById("employeeCard").innerHTML = "";
    document.getElementById("searchEmployee").value = "";
    document.getElementById("searchEmployee").focus();
}

document.addEventListener("DOMContentLoaded", () => {

    document
        .getElementById("searchEmployee")
        .addEventListener("keypress", function(event) {

            if (event.key === "Enter") {
                searchEmployee();
            }

        });

});
