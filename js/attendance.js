console.log("Attendance Board Loaded");

// ===============================
// LOAD ATTENDANCE BOARD
// ===============================

async function loadAttendanceBoard() {

   const today =
        new Date().toLocaleDateString(
            "en-CA",
            {
                timeZone: "Asia/Manila"
            }
        );

    // Load Employees

    const {
        data: employees,
        error
    } =
    await supabaseClient
        .from("employees")
        .select("*")
        .order("employee_id");

    console.log("Employees:", employees);
    console.log("Error:", error);

    if (error) {

        console.error(error);

        return;

    }

    // Load Today's Attendance

    const {
        data: attendance,
        error: attendanceError
    } =
    await supabaseClient
        .from("attendance_daily")
        .select("*")
        .eq(
            "attendance_date",
            today
        );

    if (attendanceError) {

        console.error(attendanceError);

        return;

    }

    let html = "";

    employees.forEach(emp => {

        const daily =
            attendance.find(
                record =>
                record.employee_id ===
                emp.employee_id
            );

        html += createAttendanceRow(
            emp,
            daily
        );

    });

    document
        .getElementById(
            "attendanceTable"
        )
        .innerHTML =
        html;

}

// =========================================
// CREATE ATTENDANCE ROW
// =========================================

function createAttendanceRow(
    emp,
    daily
) {

    const isDriver =
        emp.employee_type ===
        "driver";

    return `

<tr>

<td>${emp.employee_id}</td>

<td>${emp.full_name}</td>

<td>${emp.employee_type}</td>

<td>

<input
type="checkbox"
${daily?.am_in ? "checked disabled" : ""}
onclick="recordAttendance('${emp.employee_id}','AM_IN',this)">

</td>

<td>

${daily?.late_display ?? "-"}

</td>

<td>

${daily?.attendance_status ?? "-"}

</td>

<td>

<input
type="checkbox"
${daily?.break_time ? "checked disabled" : ""}
onclick="recordAttendance('${emp.employee_id}','BREAK',this)">

</td>

<td>

<input
type="checkbox"
${daily?.pm_in ? "checked disabled" : ""}
onclick="recordAttendance('${emp.employee_id}','PM_IN',this)">

</td>

<td>

<input
type="checkbox"
${daily?.time_out ? "checked disabled" : ""}
onclick="recordAttendance('${emp.employee_id}','TIME_OUT',this)">

</td>

<td>

${daily?.work_hours ?? "-"}

</td>

<td>

${daily?.ot_hours ?? "-"}

</td>

<td>

${
isDriver
?
`<input
type="checkbox"
${daily?.start_trip ? "checked disabled" : ""}
onclick="recordAttendance('${emp.employee_id}','START_TRIP',this)">`
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
${daily?.end_trip ? "checked disabled" : ""}
onclick="recordAttendance('${emp.employee_id}','END_TRIP',this)">`
:
"-"
}

</td>

</tr>

`;

}

// =========================================
// RECORD ATTENDANCE
// =========================================

async function recordAttendance(

    employeeId,
    action,
    checkbox

) {

    if (!checkbox.checked) return;

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

    // Load Employee

    const {

        data: employee,
        error: employeeError

    } =
    await supabaseClient
        .from("employees")
        .select("*")
        .eq(
            "employee_id",
            employeeId
        )
        .single();

    if (employeeError) {

        console.error(employeeError);

        checkbox.checked = false;

        return;

    }

    // Check today's attendance

    const {

        data: daily

    } =
    await supabaseClient
        .from("attendance_daily")
        .select("*")
        .eq(
            "employee_id",
            employeeId
        )
        .eq(
            "attendance_date",
            today
        )
        .maybeSingle();

   console.log("TODAY:", today);
   console.log("EMPLOYEE:", employeeId);
   console.log("DAILY RECORD:", daily);

    let updateData = {};

    let employeeStatus = "WORKING";

    switch(action){

      case "AM_IN":

    updateData.am_in = philippinesTime;
    employeeStatus = "WORKING";

    if (employee.schedule_in) {

        const actualTime = new Date(philippinesTime);

        const scheduledTime = new Date(philippinesTime);

        const [hour, minute] =
            employee.schedule_in.split(":");

        scheduledTime.setHours(
            Number(hour),
            Number(minute),
            0,
            0
        );

        scheduledTime.setMinutes(
            scheduledTime.getMinutes() +
            (employee.grace_period || 0)
        );

        const lateMinutes = Math.max(
            0,
            Math.floor(
                (actualTime - scheduledTime) /
                1000 / 60
            )
        );

        updateData.late_minutes = lateMinutes;

        if (lateMinutes <= 0) {

            updateData.late_display = "On Time";

        } else {

            const hrs =
                Math.floor(lateMinutes / 60);

            const mins =
                lateMinutes % 60;

            if (hrs > 0 && mins > 0) {

                updateData.late_display =
                    `${hrs} hr ${mins} min`;

            } else if (hrs > 0) {

                updateData.late_display =
                    `${hrs} hr`;

            } else {

                updateData.late_display =
                    `${mins} min`;

            }

        }

        updateData.attendance_status =
            lateMinutes > 0
                ? "LATE"
                : "ON TIME";

    }

    break;

        case "BREAK":

            updateData.break_time =
                philippinesTime;

            employeeStatus =
                "ON_BREAK";

            break;

        case "PM_IN":

            updateData.pm_in =
                philippinesTime;

            employeeStatus =
                "WORKING";

            break;

       case "TIME_OUT":

    updateData.time_out = philippinesTime;
    updateData.completed = true;
    employeeStatus = "COMPLETED";

    if (daily && daily.am_in) {

        const amIn = new Date(daily.am_in);
        const timeOut = new Date(philippinesTime);

        let totalMinutes =
            Math.floor(
                (timeOut - amIn) / 1000 / 60
            );

        if (totalMinutes < 0) {
            totalMinutes = 0;
        }

        updateData.work_hours =
            `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;

        const shiftEnd = new Date(amIn);

        if (employee.employee_type === "office") {

            shiftEnd.setHours(18, 0, 0, 0);

        } else if (employee.employee_type === "warehouse") {

            shiftEnd.setHours(17, 0, 0, 0);

        } else {

            shiftEnd.setHours(18, 0, 0, 0);

        }

        let otMinutes = 0;

        if (timeOut > shiftEnd) {

            otMinutes =
                Math.floor(
                    (timeOut - shiftEnd) / 1000 / 60
                );

        }

        updateData.ot_hours =
            `${Math.floor(otMinutes / 60)}h ${otMinutes % 60}m`;

    }

    break;

        case "START_TRIP":

            updateData.start_trip =
                philippinesTime;

            employeeStatus =
                "DRIVING";

            break;

        case "END_TRIP":

            updateData.end_trip =
                philippinesTime;

            employeeStatus =
                "AVAILABLE";

            break;

    }

    updateData.status =
        employeeStatus;

      if (!daily) {

        updateData.employee_id =
            employee.employee_id;

        updateData.employee_name =
            employee.full_name;

        updateData.employee_type =
            employee.employee_type;

        updateData.attendance_date =
            today;

        await supabaseClient
            .from("attendance_daily")
            .insert([
                updateData
            ]);

         } else {

    await supabaseClient
        .from("attendance_daily")
        .update(updateData)
        .eq("id", daily.id);

    }

     await supabaseClient
        .from("employees")
        .update({

            status:
                employeeStatus

        })
        .eq(
            "employee_id",
            employeeId
        );

    checkbox.disabled = true;

    loadAttendanceBoard();

    loadTodayHistory();

}

// ===============================
// TODAY'S ACTIVITY
// ===============================

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
                <td>${new Date(log.log_time).toLocaleString()}</td>
                <td>${log.employee_name}</td>
                <td>${log.action}</td>
            </tr>
        `;

    });

    document.getElementById("todayHistory").innerHTML = html;

}

loadAttendanceBoard();

loadTodayHistory();

setInterval(() => {

    loadAttendanceBoard();

    loadTodayHistory();

}, 5000);

