console.log("Attendance Board Loaded");

async function loadAttendanceBoard() {


const today =
    new Date().toLocaleDateString(
        "en-CA",
        {
            timeZone: "Asia/Manila"
        }
    );

const { data, error } =
    await supabaseClient
        .from("employees")
        .select("*")
        .order("employee_id");

if (error) {
    console.error(error);
    return;
}

const { data: dailyRecords } =
    await supabaseClient
        .from("attendance_daily")
        .select("*")
        .eq("attendance_date", today);

let html = "";

data.forEach(emp => {

    const isDriver =
        emp.employee_type === "driver";

    const daily =
        dailyRecords?.find(
            d => d.employee_id === emp.employee_id
        );

    const amInChecked =
        daily?.am_in ? "checked disabled" : "";

    const breakChecked =
        daily?.break_time ? "checked disabled" : "";

    const pmInChecked =
        daily?.pm_in ? "checked disabled" : "";

    const timeoutChecked =
        daily?.time_out ? "checked disabled" : "";

    const startTripChecked =
        daily?.start_trip ? "checked disabled" : "";

    const endTripChecked =
        daily?.end_trip ? "checked disabled" : "";

    html += `

    <tr>

        <td>${emp.employee_id}</td>

        <td>${emp.full_name}</td>

        <td>${emp.employee_type}</td>

        <td>
            <input
                type="checkbox"
                ${amInChecked}
                onclick="recordAttendance('${emp.employee_id}','${emp.full_name}','AM_IN',this)">
        </td>

        <td>
            <input
                type="checkbox"
                ${breakChecked}
                onclick="recordAttendance('${emp.employee_id}','${emp.full_name}','BREAK',this)">
        </td>

        <td>
            <input
                type="checkbox"
                ${pmInChecked}
                onclick="recordAttendance('${emp.employee_id}','${emp.full_name}','PM_IN',this)">
        </td>

        <td>
            <input
                type="checkbox"
                ${timeoutChecked}
                onclick="recordAttendance('${emp.employee_id}','${emp.full_name}','TIME_OUT',this)">
        </td>

        <td>
            ${
                isDriver
                ?
                `<input
                    type="checkbox"
                    ${startTripChecked}
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
                    ${endTripChecked}
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

    if (daily && daily.am_in) {

        const amIn =
            new Date(daily.am_in);

        const timeOut =
            new Date(philippinesTime);

        let totalMinutes =
            Math.floor(
                (timeOut - amIn)
                / 1000 / 60
            );

        // Huwag payagan ang negative

        if (totalMinutes < 0) {
            totalMinutes = 0;
        }

        const workHours =
            Math.floor(
                totalMinutes / 60
            );

        const workMinutes =
            totalMinutes % 60;

        updateData.work_hours =
            `${workHours}h ${workMinutes}m`;

        // OT COMPUTATION
        // Official end of shift = 6:00 PM

        const shiftEnd =
            new Date(amIn);

        shiftEnd.setHours(
            18,
            0,
            0,
            0
        );

        let otMinutes = 0;

        if (timeOut > shiftEnd) {

            otMinutes =
                Math.floor(
                    (timeOut - shiftEnd)
                    / 1000 / 60
                );

        }

        const otHours =
            Math.floor(
                otMinutes / 60
            );

        const remainingOtMinutes =
            otMinutes % 60;

        updateData.ot_hours =
            `${otHours}h ${remainingOtMinutes}m`;
    }

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

loadAttendanceBoard();
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

async function refreshBoard() {
    loadAttendanceBoard();
    loadTodayHistory();
}
