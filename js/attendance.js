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

   console.log("Attendance Data:", attendance);

attendance.forEach(item => {
    console.log(
        item.employee_id,
        item.employee_name,
        item.attendance_status
    );
});

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
   
const daily = attendance.find(record =>
    record.employee_id === emp.employee_id &&
    record.attendance_date === today
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

if (!daily && currentHour >= 23) {

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

: daily?.am_in
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
// CALCULATE LATE
// =========================================

function calculateLate(employee, actualTime) {

    let lateMinutes = 0;
    let lateDisplay = "On Time";
    let attendanceStatus = "PRESENT";

    if (!employee.schedule_in) {

        return {
            lateMinutes,
            lateDisplay,
            attendanceStatus
        };

    }

    const [hour, minute] = employee.schedule_in.split(":");

    const scheduledTime = new Date(actualTime);

    scheduledTime.setHours(
        Number(hour),
        Number(minute),
        0,
        0
    );

    const graceLimit = new Date(scheduledTime);

    graceLimit.setMinutes(
        graceLimit.getMinutes() +
        (employee.grace_period || 0)
    );

    if (actualTime > graceLimit) {

        lateMinutes = Math.floor(
            (actualTime - scheduledTime) /
            1000 / 60
        );

    }

    if (lateMinutes > 0) {

        attendanceStatus = "LATE";

        const hrs = Math.floor(lateMinutes / 60);
        const mins = lateMinutes % 60;

        if (hrs > 0 && mins > 0) {

            lateDisplay = `${hrs} hr ${mins} min`;

        } else if (hrs > 0) {

            lateDisplay = `${hrs} hr`;

        } else {

            lateDisplay = `${mins} min`;

        }

    }

    return {

        lateMinutes,
        lateDisplay,
        attendanceStatus

    };

}


 
// =========================================
// CALCULATE WORK HOURS
// =========================================

function calculateWorkHours(amIn, breakTime, pmIn, timeOut) {

    let totalMinutes = Math.floor(
        (timeOut - amIn) / 1000 / 60
    );

    // Deduct break

    if (breakTime && pmIn) {

        const breakMinutes = Math.floor(
            (pmIn - breakTime) / 1000 / 60
        );

        totalMinutes -= breakMinutes;

    }

    if (totalMinutes < 0) {

        totalMinutes = 0;

    }

    return {

        totalMinutes,

        display:
            `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`

    };

}
// =========================================
// CALCULATE OVERTIME
// =========================================

function calculateOvertime(workMinutes) {

    const REQUIRED_MINUTES = 8 * 60; // 8 hours

    let otMinutes = 0;

    if (workMinutes > REQUIRED_MINUTES) {

        otMinutes = workMinutes - REQUIRED_MINUTES;

    }

    return {

        otMinutes,

        display:
            `${Math.floor(otMinutes / 60)}h ${otMinutes % 60}m`

    };

}
// =========================================
// GET EMPLOYEE SHIFT
// =========================================

async function getEmployeeShift(employeeId, date) {

    const { data, error } = await supabaseClient
        .from("shift_assignments")
        .select("shift_type")
        .eq("employee_id", employeeId)
        .eq("shift_date", date)
        .maybeSingle();

    if (error) {

        console.error("Shift Error:", error);

        return "DAY";

    }

    return data?.shift_type || "DAY";

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


  const now = new Date(philippinesTime);

const { data: openAttendance } = await supabaseClient
    .from("attendance_daily")
    .select("*")
    .eq("employee_id", employeeId)
    .is("time_out", null)
    .order("attendance_date", { ascending: false })
    .limit(1);

let daily = null;

if (openAttendance && openAttendance.length > 0) {

    daily = openAttendance[0];

} else {

    const { data: todayAttendance } = await supabaseClient
        .from("attendance_daily")
        .select("*")
        .eq("employee_id", employeeId)
        .eq("attendance_date", today)
        .maybeSingle();

    daily = todayAttendance;


}

  console.log("TODAY:", today);
  console.log("EMPLOYEE:", employeeId);
  console.log("DAILY RECORD:", daily);

const employeeShift = await getEmployeeShift(
    employeeId,
    today
);

if (employeeShift === "NIGHT") {

    employee.schedule_in = "20:00:00";
    employee.schedule_out = "05:00:00";

}

console.log("SHIFT:", employeeShift);

let updateData = {};

let employeeStatus = "WORKING";

switch (action) {

    case "AM_IN":

        console.log("Employee ID:", employee.employee_id);
        console.log("Employee Type:", employee.employee_type);
        console.log("Schedule In:", employee.schedule_in);
        console.log("Grace Period:", employee.grace_period);

        updateData.am_in = philippinesTime;

        employeeStatus = "WORKING";

        const late = calculateLate(
            employee,
            new Date(philippinesTime)
        );

        updateData.late_minutes = late.lateMinutes;
        updateData.late_display = late.lateDisplay;
        updateData.attendance_status = late.attendanceStatus;

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

        if (daily?.am_in) {

            const work = calculateWorkHours(

                new Date(daily.am_in),

                daily.break_time
                    ? new Date(daily.break_time)
                    : null,

                daily.pm_in
                    ? new Date(daily.pm_in)
                    : null,

                new Date(philippinesTime)

            );

            updateData.work_hours = work.display;
            updateData.work_minutes = work.totalMinutes;

            const nightDiff =
    calculateNightDifferential(...);

            updateData.ot_hours = overtime.display;
            updateData.ot_minutes = overtime.otMinutes;

        }

        break;

    case "START_TRIP":

        updateData.start_trip = philippinesTime;

        employeeStatus = "DRIVING";

        break;

    case "END_TRIP":

        updateData.end_trip = philippinesTime;

        employeeStatus = "COMPLETED";

        break;

}
    updateData.status = employeeStatus;

    if (!daily && action === "AM_IN") {

        updateData.employee_id = employee.employee_id;
        updateData.employee_name = employee.full_name;
        updateData.employee_type = employee.employee_type;
        updateData.attendance_date = today;

        const { error: insertError } = await supabaseClient
            .from("attendance_daily")
            .insert([updateData]);

        if (insertError) {

            console.error(insertError);

            checkbox.checked = false;

            return;

        }

    } else if (!daily) {

        alert("Employee must AM IN first.");

        checkbox.checked = false;

        return;

    } else {

        const { error: updateError } = await supabaseClient
            .from("attendance_daily")
            .update(updateData)
            .eq("id", daily.id);

        if (updateError) {

            console.error(updateError);

            checkbox.checked = false;

            return;

        }

    }

    await supabaseClient
        .from("employees")
        .update({
            status: employeeStatus
        })
        .eq("employee_id", employeeId);

    await supabaseClient
        .from("attendance_logs")
        .insert([{

            employee_id: employee.employee_id,
            employee_name: employee.full_name,
            action: action,
            log_time: philippinesTime,
            action_date: today

        }]);

    checkbox.disabled = true;

    await loadAttendanceBoard();

    await loadTodayHistory();

}

// =========================================
// TODAY'S ACTIVITY
// =========================================

async function loadTodayHistory() {

   const tbody =
    document.getElementById("todayHistory");
    if (!tbody) return;

    const today =
        new Date().toLocaleDateString(
            "en-CA",
            {
                timeZone: "Asia/Manila"
            }
        );

    const {

        data,
        error

    } = await supabaseClient
        .from("attendance_logs")
        .select("*")
        .eq("action_date", today)
        .order("log_time", { ascending: false });

    if (error) {

        console.error(error);

        return;

    }

    let html = "";

    data.forEach(log => {

        html += `

<tr>

<td>${log.log_time}</td>

<td>${log.employee_name}</td>

<td>${log.action}</td>

</tr>

`;

    });

    tbody.innerHTML = html;

}
// ===============================
// ATTENDANCE TABS
// ===============================

const boardTab = document.getElementById("boardTab");
const summaryTab = document.getElementById("summaryTab");
const shiftTab = document.getElementById("shiftTab");

const attendanceBoard = document.getElementById("attendanceBoard");
const attendanceSummary = document.getElementById("attendanceSummary");
const shiftManagement = document.getElementById("shiftManagement");

if (
    boardTab &&
    summaryTab &&
    shiftTab &&
    attendanceBoard &&
    attendanceSummary &&
    shiftManagement
) {
  boardTab.addEventListener("click", () => {

    boardTab.classList.add("active");
    summaryTab.classList.remove("active");
    shiftTab.classList.remove("active");

    attendanceBoard.style.display = "block";
    attendanceSummary.style.display = "none";
    shiftManagement.style.display = "none";

});
   summaryTab.addEventListener("click", () => {

    summaryTab.classList.add("active");
    boardTab.classList.remove("active");
    shiftTab.classList.remove("active");

    attendanceBoard.style.display = "none";
    attendanceSummary.style.display = "block";
    shiftManagement.style.display = "none";

    loadAttendanceSummary();

});
    shiftTab.addEventListener("click", () => {

    shiftTab.classList.add("active");

    boardTab.classList.remove("active");
    summaryTab.classList.remove("active");

    attendanceBoard.style.display = "none";
    attendanceSummary.style.display = "none";
    shiftManagement.style.display = "block";

    loadShiftManagement();

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

    const record = data.find(item => {

        if (item.employee_id !== emp.employee_id)
            return false;

        if (selectedDate && item.attendance_date !== selectedDate)
            return false;

        return true;

    }) || null;

    console.log("EMPLOYEE:", emp.employee_id);
    console.log("RECORD:", record);

Pagkatapos:
   
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
       record.attendance_status === "PRESENT" ||
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

<td>${record?.attendance_date ?? "-"}</td>

<td>${record?.employee_id ?? "-"}</td>

<td>${record?.employee_name ?? "-"}</td>

<td>${record?.employee_type ?? "-"}</td>

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

   : record?.attendance_status === "PRESENT"

? `<span class="badge bg-success">
        PRESENT
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
// ===============================
// LOAD SHIFT MANAGEMENT
// ===============================

async function loadShiftManagement() {

    console.log("Loading Shift Management...");

    const tbody = document.getElementById("shiftTable");

    if (!tbody) {

        console.error("shiftTable not found.");
        return;

    }

    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="text-center">
                Loading...
            </td>
        </tr>
    `;

    const today = new Date().toLocaleDateString(
        "en-CA",
        {
            timeZone: "Asia/Manila"
        }
    );

    // ===============================
    // LOAD EMPLOYEES
    // ===============================

    const {
        data: employees,
        error: employeeError
    } = await supabaseClient
        .from("employees")
        .select("*")
        .order("employee_id");

    if (employeeError) {

        console.error(employeeError);

        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-danger text-center">
                    Failed to load employees.
                </td>
            </tr>
        `;

        return;

    }

    // ===============================
    // LOAD SHIFT ASSIGNMENTS
    // ===============================

    const {
        data: shifts,
        error: shiftError
    } = await supabaseClient
        .from("shift_assignments")
        .select("*")
        .eq("shift_date", today);

    if (shiftError) {

        console.error(shiftError);

    }

    let html = "";

    if (!employees || employees.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    No employees found.
                </td>
            </tr>
        `;

        return;

    }

    employees.forEach(emp => {

        const assigned = shifts?.find(s =>
            s.employee_id === emp.employee_id
        );

        html += `
        <tr>

            <td>${emp.employee_id}</td>

            <td>${emp.full_name}</td>

            <td>${emp.employee_type}</td>

            <td>${today}</td>

            <td>

                <select
                    id="shift_${emp.employee_id}"
                    class="form-select">

                    <option
                        value="DAY"
                        ${assigned?.shift_type === "DAY" ? "selected" : ""}>

                        🌞 DAY SHIFT

                    </option>

                    <option
                        value="NIGHT"
                        ${assigned?.shift_type === "NIGHT" ? "selected" : ""}>

                        🌙 NIGHT SHIFT

                    </option>

                </select>

            </td>

            <td>

                <button
                    class="btn btn-success btn-sm"
                    onclick="saveShift('${emp.employee_id}')">

                    Save

                </button>

            </td>

        </tr>
        `;

    });

    tbody.innerHTML = html;

    console.log("Shift Management Loaded Successfully.");

}
