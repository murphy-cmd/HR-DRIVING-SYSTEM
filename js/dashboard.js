async function loadDashboard() {

// EMPLOYEES

const { data: employees, error } =
    await supabaseClient
        .from("employees")
        .select("*");

if (error) {
    console.error(error);
    return;
}

const today =
    new Date().toLocaleDateString(
        "en-CA",
        {
            timeZone: "Asia/Manila"
        }
    );

// DAILY ATTENDANCE

const { data: daily, error: dailyError } =
    await supabaseClient
        .from("attendance_daily")
        .select("*")
        .eq("attendance_date", today);

if (dailyError) {
    console.error(dailyError);
    return;
}

// EMPLOYEE COUNTS

const officeEmployees =
    employees.filter(
        emp => emp.employee_type === "office"
    );

document.getElementById(
    "totalEmployees"
).innerText =
    officeEmployees.length;

document.getElementById(
    "workingEmployees"
).innerText =
    officeEmployees.filter(
        emp => emp.status === "WORKING"
    ).length;

document.getElementById(
    "breakEmployees"
).innerText =
    officeEmployees.filter(
        emp => emp.status === "ON_BREAK"
    ).length;

document.getElementById(
    "completedEmployees"
).innerText =
    daily.filter(
        row =>
            row.employee_type === "office" &&
            row.completed === true
    ).length;

// DRIVER COUNTS

const drivers =
    employees.filter(
        emp => emp.employee_type === "driver"
    );

document.getElementById(
    "totalDrivers"
).innerText =
    drivers.length;

document.getElementById(
    "availableDrivers"
).innerText =
    drivers.filter(
        emp => emp.status === "AVAILABLE"
    ).length;

document.getElementById(
    "drivingEmployees"
).innerText =
    drivers.filter(
        emp => emp.status === "DRIVING"
    ).length;

document.getElementById(
    "completedTrips"
).innerText =
    daily.filter(
        row =>
            row.employee_type === "driver" &&
            row.completed === true
    ).length;

}

loadDashboard();

setInterval(
loadDashboard,
3000
);
