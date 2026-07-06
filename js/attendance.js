console.log("Attendance Board Loaded");

// ===============================
// LOAD ATTENDANCE BOARD
// ===============================

async function loadAttendanceBoard() {

    const table = document.getElementById("attendanceTable");

    if (!table) return;


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

   // ===============================
// LOAD APPROVED LEAVES
// ===============================

const {
    data: leaveRequests,
    error: leaveError
} =
await supabaseClient
    .from("leave_requests")
    .select("*");

if (leaveError) {

    console.error(leaveError);

    return;

}

    let html = "";

for (const emp of employees) {
   
const daily =
    attendance.find(
        record =>
            record.employee_id ===
            emp.employee_id
    );

   const currentHour = new Date().getHours();

// ===============================
// CHECK APPROVED LEAVE
// ===============================

const leave = leaveRequests.find(item => {

    return (
        item.employee_name === emp.full_name &&
        today >= item.start_date &&
        today <= item.end_date &&
        (
            item.status === "Approved" ||
            item.status === "Rejected"
        )
    );

});


 if (
    leave &&
    leave.status === "Approved" &&
    today >= leave.start_date &&
    today <= leave.end_date
) {

   if (!daily) {

    const { data: existing } = await supabaseClient
        .from("attendance_daily")
        .select("id")
        .eq("employee_id", emp.employee_id)
        .eq("attendance_date", today)
        .maybeSingle();

    if (!existing) {

        const { error } = await supabaseClient
            .from("attendance_daily")
            .insert([{

                employee_id: emp.employee_id,
                employee_name: emp.full_name,
                employee_type: emp.employee_type,

                attendance_date: today,

                attendance_status: "ON LEAVE"

            }]);

        if (error) {

            console.error(error);

        }

    }

}

   html += createAttendanceRow(
    emp,
    {
        ...(daily || {}),
        attendance_status: "ON LEAVE",
        status: "COMPLETED"
    }
);

}
else if (
    leave &&
    leave.status === "Rejected" &&
    today >= leave.start_date &&
    today <= leave.end_date
)

{

    html += createAttendanceRow(
        emp,
        daily
            ? daily
            : {
                  attendance_status: "LEAVE REJECTED"
              }
    );

}
else {

    // Auto Absent kapag 12:00 AM na ng susunod na araw
    if (!daily && currentHour >= 0) {

        const { data: existing } = await supabaseClient
            .from("attendance_daily")
            .select("id")
            .eq("employee_id", emp.employee_id)
            .eq("attendance_date", today)
            .maybeSingle();

        if (!existing) {

            await supabaseClient
                .from("attendance_daily")
                .insert([{
                    employee_id: emp.employee_id,
                    employee_name: emp.full_name,
                    employee_type: emp.employee_type,
                    attendance_date: today,
                    attendance_status: "ABSENT"
                }]);

            html += createAttendanceRow(
                emp,
                {
                    attendance_status: "ABSENT"
                }
            );

        } else {

            html += createAttendanceRow(
                emp,
                daily
            );

        }

    } else {

        html += createAttendanceRow(
            emp,
            daily
        );

    }

}

} // end for loop

document
    .getElementById("attendanceTable")
    .innerHTML = html;

} // end loadAttendanceBoard

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

   const onLeave =
    daily?.attendance_status === "ON LEAVE";

    return `

<tr>

<td>${emp.employee_id}</td>

<td>${emp.full_name}</td>

<td>${emp.employee_type}</td>

<td>

<input
type="checkbox"
${daily?.am_in ? "checked disabled" : ""}
${onLeave ? "disabled" : ""}
onclick="recordAttendance('${emp.employee_id}','AM_IN',this)">

</td>

<td>

${daily?.late_display ?? "-"}

</td>

<td>

${
    daily?.attendance_status === "LEAVE REJECTED"
    ? `<span class="badge bg-danger">LEAVE REJECTED</span>`

    : onLeave
    ? `<span class="badge bg-warning text-dark">ON LEAVE</span>`

    : daily?.attendance_status === "LATE"
    ? `<span class="badge bg-danger">LATE</span>`

    : daily?.attendance_status === "PRESENT"
    ? `<span class="badge bg-success">PRESENT</span>`

    : daily?.attendance_status === "ABSENT"
    ? `<span class="badge bg-secondary">ABSENT</span>`

    : "-"
}

</td>

<td>

<input
type="checkbox"
${daily?.break_time ? "checked disabled" : ""}
${onLeave ? "disabled" : ""}
onclick="recordAttendance('${emp.employee_id}','BREAK',this)">
</td>

<td>

<input
type="checkbox"
${daily?.pm_in ? "checked disabled" : ""}
${onLeave ? "disabled" : ""}
onclick="recordAttendance('${emp.employee_id}','PM_IN',this)">

</td>

<td>

<input
type="checkbox"
${daily?.time_out ? "checked disabled" : ""}
${onLeave ? "disabled" : ""}
onclick="recordAttendance('${emp.employee_id}','TIME_OUT',this)">

</td>

<td>

${
    onLeave
        ? "-"
        : (daily?.work_hours ?? "-")
}
</td>

<td>

${
    onLeave
        ? "-"
        : (daily?.ot_hours ?? "-")
}
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

   console.log("TODAY =", today);

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

   console.log("Employee ID:", employee.employee_id);
    console.log("Employee Type:", employee.employee_type);
    console.log("Schedule In:", employee.schedule_in);
    console.log("Grace Period:", employee.grace_period);


    updateData.am_in = philippinesTime;
    employeeStatus = "WORKING";

    if (employee.schedule_in) {

        const actualTime = new Date(philippinesTime);

       const [hour, minute] =
    employee.schedule_in.split(":");

// Original schedule (9:00 AM)
const scheduledTime = new Date(philippinesTime);

scheduledTime.setHours(
    Number(hour),
    Number(minute),
    0,
    0
);

// Grace limit (9:15 AM)
const graceLimit = new Date(scheduledTime);

graceLimit.setMinutes(
    graceLimit.getMinutes() +
    (employee.grace_period || 0)
);

let lateMinutes = 0;

// Kung lumagpas sa grace period,
// doon lang bibilang ang late
if (actualTime > graceLimit) {

    lateMinutes = Math.floor(
        (actualTime - scheduledTime) /
        1000 / 60
    );

}

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

    if (!daily?.am_in) {

        alert("Employee must AM IN first.");

        checkbox.checked = false;

        return;

    }

    updateData.break_time = philippinesTime;

    employeeStatus = "ON_BREAK";

    break;

        case "PM_IN":

    if (!daily?.break_time) {

        alert("Employee must take BREAK first.");

        checkbox.checked = false;

        return;

    }

    updateData.pm_in = philippinesTime;

    employeeStatus = "WORKING";

    break;

      case "TIME_OUT":

    if (!daily?.pm_in) {

        alert("Employee must PM IN first.");

        checkbox.checked = false;

        return;

    }

    updateData.time_out = philippinesTime;
    updateData.completed = true;
    employeeStatus = "COMPLETED";

    if (daily && daily.am_in) {

        const amIn = new Date(daily.am_in);
        const timeOut = new Date(philippinesTime);

        let totalMinutes = Math.floor(
            (timeOut - amIn) / 1000 / 60
        );

        // Ibawas ang lunch break
        if (daily.break_time && daily.pm_in) {

            const breakStart = new Date(daily.break_time);
            const breakEnd = new Date(daily.pm_in);

            const breakMinutes = Math.floor(
                (breakEnd - breakStart) / 1000 / 60
            );

            totalMinutes -= breakMinutes;
        }

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

    otMinutes = Math.floor(
        (timeOut - shiftEnd) / 1000 / 60
    );

}

updateData.ot_hours =
    `${Math.floor(otMinutes / 60)}h ${otMinutes % 60}m`;


updateData.work_minutes = totalMinutes;
updateData.ot_minutes = otMinutes;

}

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

   const { error: logError } =
await supabaseClient
    .from("attendance_logs")
    .insert([{

        employee_id: employee.employee_id,

        employee_name: employee.full_name,

        action: action,

        log_time: philippinesTime,

        action_date: today

    }]);

if (logError) {

    console.error("Attendance Log Error:", logError);

}

   await supabaseClient
    .from("attendance_logs")
    .insert({

        employee_id: employee.employee_id,

        employee_name: employee.full_name,

        action: action,

        log_time: philippinesTime,

        action_date: today

    });

checkbox.disabled = true;

loadAttendanceBoard();

loadTodayHistory();

    checkbox.disabled = true;

    loadAttendanceBoard();

    loadTodayHistory();

}

// ===============================
// TODAY'S ACTIVITY
// ===============================

async function loadTodayHistory() {

    const history = document.getElementById("todayHistory");

    if (!history) return;


    const today =
    new Date().toLocaleDateString(
        "en-CA",
        {
            timeZone: "Asia/Manila"
        }
    );

const { data, error } =
    await supabaseClient
        .from("attendance_logs")
        .select("*")
        .eq("action_date", today)
        .order("log_time", {
            ascending: false
        });

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

// ===============================
// ATTENDANCE TABS
// ===============================

const boardTab = document.getElementById("boardTab");
const summaryTab = document.getElementById("summaryTab");

const attendanceBoard = document.getElementById("attendanceBoard");
const attendanceSummary = document.getElementById("attendanceSummary");

if (boardTab && summaryTab && attendanceBoard && attendanceSummary) {

   boardTab.addEventListener("click", () => {

    boardTab.classList.add("active");
    summaryTab.classList.remove("active");

    attendanceBoard.style.display = "block";
    attendanceSummary.style.display = "none";

});

   summaryTab.addEventListener("click", () => {

    summaryTab.classList.add("active");
    boardTab.classList.remove("active");

    attendanceBoard.style.display = "none";
    attendanceSummary.style.display = "block";

    // Load Attendance Summary
    loadAttendanceSummary();

});
}
setInterval(() => {

    loadAttendanceBoard();

    loadTodayHistory();

}, 5000);

console.log("Attendance Summary Loaded");

// ===============================
// LOAD ATTENDANCE SUMMARY
// ===============================

async function loadAttendanceSummary() {

    const tbody = document.getElementById("summaryTable");

tbody.innerHTML = "";

const searchValue =
    document
        .getElementById("searchEmployee")
        .value
        .trim()
        .toLowerCase();

const selectedDate =
    document
        .getElementById("summaryDate")
        .value;

const selectedStatus =
    document
        .getElementById("statusFilter")
        .value;

    const {
        data,
        error
    } = await supabaseClient

        .from("attendance_daily")

        .select("*")

        .order("attendance_date", {
            ascending: false
        })

        .order("employee_name");

    console.log("Attendance Daily:", data);
console.log("Selected Date:", selectedDate);

    if (error) {

        console.error(error);

        return;

    }

   
// ===============================
// LOAD APPROVED LEAVES
// ===============================
   
const {
    data: leaveRequests,
    error: leaveError
} = await supabaseClient
    .from("leave_requests")
    .select("*");

if (leaveError) {

    console.error(leaveError);

    return;

}

   const {
    data: employees,
    error: employeeError
} = await supabaseClient
    .from("employees")
    .select("*")
    .order("employee_id");

if (employeeError) {

    console.error(employeeError);

    return;

}

let present = 0;
let late = 0;
let absent = 0;
let leaveCount = 0;   

employees.forEach(emp => {

   const record =
    data.find(item => {

        if (item.employee_id !== emp.employee_id)
            return false;

        if (selectedDate)
            return item.attendance_date === selectedDate;

        return true;

    });
   
  if (
    searchValue &&
    !emp.full_name
        .toLowerCase()
        .includes(searchValue) &&
    !emp.employee_id
        .toLowerCase()
        .includes(searchValue)
) {
    return;
}

// Date Filter

// Wala nang Date Filter dito
// Kasi nasa paghanap pa lang ng record ginagamit na natin ang selectedDate.

// Status Filter

if (
    selectedStatus &&
    record &&
    record.attendance_status !== selectedStatus
) {
    return;
}
        
const leaveRequest = leaveRequests.find(item => {
    return (

        item.employee_name === emp.full_name &&

        (!record ||

        (
            record.attendance_date >= item.start_date &&
            record.attendance_date <= item.end_date
        ))

    );

});
   
// ===============================
// COMPUTE SUMMARY COUNTERS
// ===============================

// Approved Leave
if (
    leaveRequest &&
    leaveRequest.status === "Approved"
) {

    leaveCount++;

}

// Present
if (
    record &&
    !(
        leaveRequest &&
        leaveRequest.status === "Approved"
    ) &&
    (
        record.attendance_status === "ON TIME" ||
        record.attendance_status === "LATE"
    )
) {

    present++;

}

// Late
if (
    record &&
    record.attendance_status === "LATE"
) {

    late++;

}

// Absent
if (
    record &&
    record.attendance_status === "ABSENT"
) {

    absent++;

}
   

        tbody.innerHTML += `

<tr>

<td>${record.attendance_date ?? "-"}</td>

<td>${record.employee_id ?? "-"}</td>

<td>${record.employee_name ?? "-"}</td>

<td>${record.employee_type ?? "-"}</td>

<td>

${
  leaveRequest &&
leaveRequest.status === "Approved"
    ? "-"
        : formatTime(record?.am_in)
}
</td>

<td>
${
 leaveRequest &&
leaveRequest.status === "Approved"
    ? "-"
        : formatTime(record?.break_time)
}
</td>

<td>
${
 leaveRequest &&
leaveRequest.status === "Approved"        ? "-"
        : formatTime(record?.pm_in)
}
</td>

<td>
${
 leaveRequest &&
leaveRequest.status === "Approved"        ? "-"
        : formatTime(record?.time_out)
}
</td>

<td>
${
 leaveRequest &&
leaveRequest.status === "Approved"        ? "-"
        : (record?.late_display ?? "On Time")
}
</td>

<td>
${
 leaveRequest &&
leaveRequest.status === "Approved"        ? "-"
        : (record?.work_hours ?? "-")
}
</td>

<td>
${
 leaveRequest &&
leaveRequest.status === "Approved"        ? "-"
        : (record?.ot_hours ?? "-")
}
</td>

<td>

${
    leaveRequest &&
    leaveRequest.status === "Approved"

        ? `<span class="badge bg-warning text-dark">
                ON LEAVE
           </span>`

    : leaveRequest &&
      leaveRequest.status === "Rejected" &&
      !record?.am_in

        ? `<span class="badge bg-danger">
                LEAVE REJECTED
           </span>`

    : record?.attendance_status === "LATE"

        ? `<span class="badge bg-danger">
                LATE
           </span>`

    : record?.attendance_status === "ON TIME"

        ? `<span class="badge bg-success">
                ON TIME
           </span>`

    : record?.attendance_status === "ABSENT"

        ? `<span class="badge bg-secondary">
                ABSENT
           </span>`

    : record?.attendance_status === "PRESENT"

        ? `<span class="badge bg-success">
                PRESENT
           </span>`

    : "-"

}

</td>
</tr>

`;

    });

   document.getElementById("presentCount").textContent = present;

document.getElementById("lateCount").textContent = late;

document.getElementById("absentCount").textContent = absent;

document.getElementById("leaveCount").textContent = leaveCount;

}

function formatTime(value) {

    if (!value) return "-";

    return new Date(value).toLocaleTimeString("en-PH", {

        hour: "2-digit",

        minute: "2-digit",

        hour12: true

    });

}

document
    .getElementById("searchBtn")
    .addEventListener("click", loadAttendanceSummary);

loadAttendanceSummary();
