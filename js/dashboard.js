// ==========================================
// DASHBOARD CONTROLLER
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    loadDashboard();

    updateDate();

});

// ==========================================
// LOAD DASHBOARD
// ==========================================

async function loadDashboard(){

    loadEmployeeSummary();

    loadDriverSummary();

}

// ==========================================
// EMPLOYEE SUMMARY
// ==========================================

async function loadEmployeeSummary(){

    // Total Employees
    const { count: totalEmployees } = await db
        .from("employees")
        .select("*", { count: "exact", head: true });

    document.getElementById("totalEmployees").innerText =
        totalEmployees ?? 0;

    // Working Employees
    const { count: workingEmployees } = await db
        .from("employees")
        .select("*", { count: "exact", head: true })
        .eq("status", "WORKING");

    document.getElementById("workingEmployees").innerText =
        workingEmployees ?? 0;

    // On Break
    const { count: breakEmployees } = await db
        .from("employees")
        .select("*", { count: "exact", head: true })
        .eq("status", "BREAK");

    document.getElementById("breakEmployees").innerText =
        breakEmployees ?? 0;

}

// ==========================================
// DRIVER SUMMARY
// ==========================================

async function loadDriverSummary(){

    // Total Drivers
    const { count: totalDrivers } = await db
        .from("employees")
        .select("*", { count: "exact", head: true })
        .eq("employee_type", "driver");

    document.getElementById("totalDrivers").innerText =
        totalDrivers ?? 0;

    // Available Drivers
    const { count: availableDrivers } = await db
        .from("employees")
        .select("*", { count: "exact", head: true })
        .eq("status", "AVAILABLE");

    document.getElementById("availableDrivers").innerText =
        availableDrivers ?? 0;

    // Driving
    const { count: drivingDrivers } = await db
        .from("employees")
        .select("*", { count: "exact", head: true })
        .eq("status", "DRIVING");

    document.getElementById("drivingDrivers").innerText =
        drivingDrivers ?? 0;

}

// ==========================================
// DATE
// ==========================================

function updateDate(){

    const now = new Date();

    const date = document.getElementById("currentDate");

    const day = document.getElementById("currentDay");

    if(date){

        date.innerHTML = now.toLocaleDateString("en-US",{

            month:"long",

            day:"numeric",

            year:"numeric"

        });

    }

    if(day){

        day.innerHTML = now.toLocaleDateString("en-US",{

            weekday:"long"

        });

    }

}
