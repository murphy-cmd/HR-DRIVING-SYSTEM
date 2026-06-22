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

// TOTAL EMPLOYEES

document.getElementById(
    "totalEmployees"
).innerText =
    employees.length;

// WORKING

document.getElementById(
    "workingEmployees"
).innerText =
    employees.filter(
        emp => emp.status === "WORKING"
    ).length;

// DRIVING

document.getElementById(
    "drivingEmployees"
).innerText =
    employees.filter(
        emp => emp.status === "DRIVING"
    ).length;

// ON BREAK

document.getElementById(
    "breakEmployees"
).innerText =
    employees.filter(
        emp => emp.status === "ON_BREAK"
    ).length;

// COMPLETED TODAY

document.getElementById(
    "completedEmployees"
).innerText =
    daily.filter(
        row => row.completed === true
    ).length;


}

loadDashboard();

setInterval(
loadDashboard,
3000
);
