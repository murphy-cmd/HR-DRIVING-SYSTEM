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


if (!checkbox.checked) {
    return;
}

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
