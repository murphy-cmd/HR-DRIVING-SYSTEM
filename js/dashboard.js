// ==========================================
// DASHBOARD CONTROLLER
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    initializeDashboard();

});

async function initializeDashboard() {

    updateDate();

    await loadEmployeeSummary();

    await loadDriverSummary();

    await loadTodayAttendance();

    await loadPendingLeave();

    await loadRecentActivities();

}

// ==========================================
// DATE
// ==========================================

function updateDate() {

    const now = new Date();

    document.getElementById("currentDate").textContent =
        now.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });

    document.getElementById("currentDay").textContent =
        now.toLocaleDateString("en-US", {
            weekday: "long"
        });

}

// ==========================================
// EMPLOYEE SUMMARY
// ==========================================

async function loadEmployeeSummary() {

    try {

        const { data, error } = await supabaseClient
            .from("employees")
            .select("*");

        if (error) throw error;

        const employees = data || [];

        document.getElementById("totalEmployees").textContent =
            employees.length;

        document.getElementById("workingEmployees").textContent =
            employees.filter(e => e.status === "WORKING").length;

        document.getElementById("breakEmployees").textContent =
            employees.filter(e => e.status === "BREAK").length;

        document.getElementById("completedEmployees").textContent =
            employees.filter(e => e.status === "COMPLETED").length;

    }

    catch (err) {

        console.error(err);

    }

}
// ==========================================
// DRIVER SUMMARY
// ==========================================

async function loadDriverSummary() {

    try {

        // Get all drivers
        const { data: drivers, error } = await supabaseClient
            .from("employees")
            .select("*")
            .eq("employee_type", "driver");

        if (error) throw error;

        document.getElementById("totalDrivers").textContent =
            drivers.length;

        document.getElementById("availableDrivers").textContent =
            drivers.filter(driver =>
                driver.status === "AVAILABLE"
            ).length;

        document.getElementById("drivingDrivers").textContent =
            drivers.filter(driver =>
                driver.status === "DRIVING"
            ).length;

        // Completed Trips
        const { count: completedTrips } = await supabaseClient
            .from("driver_trips")
            .select("*", {
                count: "exact",
                head: true
            })
            .eq("status", "COMPLETED");

        document.getElementById("completedTrips").textContent =
            completedTrips ?? 0;

    }

    catch (error) {

        console.error("Driver Summary:", error);

    }

}
// ==========================================
// TODAY'S ATTENDANCE
// ==========================================

async function loadTodayAttendance() {

    try {

        const today = new Date().toISOString().split("T")[0];

        const { count, error } = await supabaseClient
            .from("attendance")
            .select("*", {
                count: "exact",
                head: true
            })
            .gte("created_at", `${today}T00:00:00`)
            .lte("created_at", `${today}T23:59:59`);

        if (error) throw error;

        document.getElementById("todayAttendance").textContent =
            count ?? 0;

    }

    catch (error) {

        console.error("Today's Attendance:", error);

    }

}
// ==========================================
// PENDING LEAVE
// ==========================================

async function loadPendingLeave() {

    try {

        const { count, error } = await supabaseClient
            .from("leave_requests")
            .select("*", {
                count: "exact",
                head: true
            })
            .eq("status", "Pending");

        if (error) throw error;

        document.getElementById("pendingLeave").textContent =
            count ?? 0;

    }

    catch (error) {

        console.error("Pending Leave:", error);

    }

}
// ==========================================
// RECENT ACTIVITIES
// ==========================================

async function loadRecentActivities() {

    try {

        const { data, error } = await supabaseClient
            .from("attendance_logs")
            .select("*")
            .order("log_time", { ascending: false })
            .limit(5);

        if (error) throw error;

        const container = document.getElementById("recentActivities");

        if (!container) return;

        if (!data || data.length === 0) {

            container.innerHTML = `
                <p>No recent activities.</p>
            `;

            return;

        }

        container.innerHTML = "";

        data.forEach(item => {

            container.innerHTML += `
                <div class="activity">
                    <div>
                        <strong>${item.employee_name}</strong><br>
                        <small>${item.action}</small>
                    </div>
                    <span>${new Date(item.log_time).toLocaleTimeString()}</span>
                </div>
            `;

        });

    }

    catch (error) {

        console.error("Recent Activities:", error);

    }

}
