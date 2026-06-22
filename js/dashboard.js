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

// TODAY

const today =
    new Date().toLocaleDateString(
        "en-CA",
        {
            timeZone: "Asia/Manila"
        }
    );

// ATTENDANCE DAILY

const { data: daily } =
    await supabaseClient
        .from("attendance_daily")
        .select("*")
        .eq("attendance_date", today);

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

// ON BREAK

document.getElementById(
    "breakEmployees"
).innerText =
    employees.filter(
        emp => emp.status === "ON_BREAK"
    ).length;

// DRIVING

document.getElementById(
    "drivingEmployees"
).innerText =
    employees.filter(
        emp => emp.status === "DRIVING"
    ).length;

// COMPLETED TODAY

document.getElementById(
    "completedEmployees"
).innerText =
    daily.filter(
        item => item.completed === true
    ).length;

}

loadDashboard();

setInterval(
loadDashboard,
3000
);
