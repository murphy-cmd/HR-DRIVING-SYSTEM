console.log("Attendance Board Loaded");

async function loadAttendanceBoard() {


const { data, error } =
    await supabaseClient
        .from("employees")
        .select("*")
        .order("employee_id");

if (error) {

    console.error(error);
    return;
}

let html = "";

data.forEach(emp => {

    const isDriver =
        emp.employee_type === "driver";

    html += `

    <tr>

        <td>${emp.employee_id}</td>

        <td>${emp.full_name}</td>

        <td>${emp.employee_type}</td>

        <td>
            <input
                type="checkbox"
                onclick="recordAttendance('${emp.employee_id}','${emp.full_name}','AM_IN',this)">
        </td>

        <td>
            <input
                type="checkbox"
                onclick="recordAttendance('${emp.employee_id}','${emp.full_name}','BREAK',this)">
        </td>

        <td>
            <input
                type="checkbox"
                onclick="recordAttendance('${emp.employee_id}','${emp.full_name}','PM_IN',this)">
        </td>

        <td>
            <input
                type="checkbox"
                onclick="recordAttendance('${emp.employee_id}','${emp.full_name}','TIME_OUT',this)">
        </td>

        <td>
            ${
                isDriver
                ?
                `<input
                    type="checkbox"
                    onclick="recordAttendance('${emp.employee_id}','${emp.full_name}','START_TRIP',this)">`
                :
                "-"
            }
        </td>

        <td>
            ${
                isDriver
                ?
                `<input
                    type="checkbox"
                    onclick="recordAttendance('${emp.employee_id}','${emp.full_name}','END_TRIP',this)">`
                :
                "-"
            }
        </td>

    </tr>

    `;
});

document.getElementById(
    "attendanceTable"
).innerHTML = html;


}

async function recordAttendance(
    employeeId,
    employeeName,
    action,
    checkbox
) {

    if (!checkbox.checked) return;

    const now = new Date();

    const philippinesTime =
        new Date().toLocaleString(
            "sv-SE",
            {
                timeZone: "Asia/Manila"
            }
        );

    const today =
        new Date().toLocaleDateString(
            "en-CA",
            {
                timeZone: "Asia/Manila"
            }
        );

    // SAVE TO LOGS

    const { error } =
        await supabaseClient
            .from("attendance_logs")
            .insert([
                {
                    employee_id: employeeId,
                    employee_name: employeeName,
                    action: action,
                    log_time: philippinesTime,
                    action_date: today
                }
            ]);

    if (error) {

        console.error(error);

        alert(error.message);

        checkbox.checked = false;

        return;
    }

    // FIND DAILY RECORD

    const { data: daily } =
        await supabaseClient
            .from("attendance_daily")
            .select("*")
            .eq("employee_id", employeeId)
            .eq("attendance_date", today)
            .maybeSingle();

    let updateData = {};
    let employeeStatus = "WORKING";

    switch(action){

        case "AM_IN":
            updateData.am_in = philippinesTime;
            employeeStatus = "WORKING";
            break;

        case "BREAK":
            updateData.break_time = philippinesTime;
            employeeStatus = "ON_BREAK";
            break;

        case "PM_IN":
            updateData.pm_in = philippinesTime;
            employeeStatus = "WORKING";
            break;

        case "TIME_OUT":
            updateData.time_out = philippinesTime;
            updateData.completed = true;
            employeeStatus = "COMPLETED";
            break;

        case "START_TRIP":
            updateData.start_trip = philippinesTime;
            employeeStatus = "DRIVING";
            break;

        case "END_TRIP":
            updateData.end_trip = philippinesTime;
            employeeStatus = "AVAILABLE";
            break;
    }

    updateData.status = employeeStatus;

    if (!daily) {

        updateData.employee_id = employeeId;
        updateData.employee_name = employeeName;
        updateData.employee_type =
            employeeId.startsWith("DR")
                ? "driver"
                : "office";

        updateData.attendance_date = today;

        await supabaseClient
            .from("attendance_daily")
            .insert([updateData]);

    } else {

        await supabaseClient
            .from("attendance_daily")
            .update(updateData)
            .eq("id", daily.id);

    }

    // UPDATE EMPLOYEE STATUS

    await supabaseClient
        .from("employees")
        .update({
            status: employeeStatus
        })
        .eq("employee_id", employeeId);

    checkbox.disabled = true;

    loadTodayHistory();
}

async function loadTodayHistory() {


const { data, error } =
    await supabaseClient
        .from("attendance_logs")
        .select("*")
        .order(
            "log_time",
            {
                ascending: false
            }
        )
        .limit(20);

if (error) {

    console.error(error);

    return;
}

let html = "";

data.forEach(log => {

    html += `

    <tr>

        <td>
            ${new Date(log.log_time)
                .toLocaleString(
                    "en-PH",
                    {
                        timeZone: "Asia/Manila"
                    }
                )}
        </td>

        <td>
            ${log.employee_name}
        </td>

        <td>
            ${log.action}
        </td>

    </tr>

    `;
});

document.getElementById(
    "todayHistory"
).innerHTML = html;


}

loadAttendanceBoard();

loadTodayHistory();

setInterval(
loadTodayHistory,
5000
);
