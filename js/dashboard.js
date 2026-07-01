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

    await loadEmployeeSummary();

    await loadDriverSummary();

    await loadTodayAttendance();

    await loadPendingLeave();

    await loadRecentActivities();

}

// ==========================================
// EMPLOYEE SUMMARY
// ==========================================

async function loadEmployeeSummary(){

    // Total Employees
    const { count: totalEmployees } = await supabaseClient
        .from("employees")
        .select("*", { count: "exact", head: true });

    document.getElementById("totalEmployees").innerText =
        totalEmployees ?? 0;

    // Working Employees
    const { count: workingEmployees } = await supabaseClient
        .from("employees")
        .select("*", { count: "exact", head: true })
        .eq("status", "WORKING");

    document.getElementById("workingEmployees").innerText =
        workingEmployees ?? 0;

    // On Break
    const { count: breakEmployees } = await supabaseClient
        .from("employees")
        .select("*", { count: "exact", head: true })
        .eq("status", "BREAK");

    document.getElementById("breakEmployees").innerText =
        breakEmployees ?? 0;

}
// Completed Today
const { count: completedEmployees } = await supabaseClient
    .from("employees")
    .select("*", {
        count: "exact",
        head: true
    })
    .eq("status", "COMPLETED");

document.getElementById("completedEmployees").innerText =
    completedEmployees ?? 0;

// ==========================================
// DRIVER SUMMARY
// ==========================================

async function loadDriverSummary(){

    // Total Drivers
    const { count: totalDrivers } = await supabaseClient
        .from("employees")
        .select("*", { count: "exact", head: true })
        .eq("employee_type", "driver");

    document.getElementById("totalDrivers").innerText =
        totalDrivers ?? 0;

    // Available Drivers
    const { count: availableDrivers } = await supabaseClient
        .from("employees")
        .select("*", { count: "exact", head: true })
        .eq("status", "AVAILABLE");

    document.getElementById("availableDrivers").innerText =
        availableDrivers ?? 0;

    // Driving
    const { count: drivingDrivers } = await supabaseClient
        .from("employees")
        .select("*", { count: "exact", head: true })
        .eq("status", "DRIVING");

    document.getElementById("drivingDrivers").innerText =
        drivingDrivers ?? 0;

}
// Completed Today
const { count: completedEmployees } = await supabaseClient
    .from("employees")
    .select("*", {
        count: "exact",
        head: true
    })
    .eq("status", "COMPLETED");

document.getElementById("completedEmployees").innerText =
    completedEmployees ?? 0;

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
// ==========================================
// TODAY ATTENDANCE
// ==========================================

async function loadTodayAttendance() {

    const today = new Date().toISOString().split("T")[0];

    const { count, error } = await supabaseClient
        .from("attendance")
        .select("*", {
            count: "exact",
            head: true
        })
        .gte("created_at", today + "T00:00:00")
        .lt("created_at", today + "T23:59:59");

    if (error) {

        console.error(error);

        return;

    }

    document.getElementById("todayAttendance").innerText =
        count || 0;

}
// ==========================================
// PENDING LEAVE
// ==========================================

async function loadPendingLeave() {

    const { count, error } = await supabaseClient
        .from("leave_requests")
        .select("*", {
            count: "exact",
            head: true
        })
        .eq("status", "Pending");

    if (error) {

        console.error(error);

        return;

    }

    document.getElementById("pendingLeave").innerText =
        count || 0;

}
// ==========================================
// RECENT ACTIVITIES
// ==========================================

async function loadRecentActivities() {

    const { data, error } = await supabaseClient

        .from("attendance_logs")

        .select("*")

        .order("log_time", {
            ascending: false
        })

        .limit(5);

    if (error) {

        console.error(error);

        return;

    }

    const container = document.getElementById("recentActivities");

    if (!container) return;

    container.innerHTML = "";

    if (data.length === 0) {

        container.innerHTML = "<p>No recent activities.</p>";

        return;

    }

    data.forEach(item => {

        container.innerHTML += `

        <div class="activity">

            <div>

                <strong>${item.employee_name}</strong>

                <br>

                <small>${item.action}</small>

            </div>

            <span>

                ${new Date(item.log_time).toLocaleTimeString()}

            </span>

        </div>

        `;

    });

}

