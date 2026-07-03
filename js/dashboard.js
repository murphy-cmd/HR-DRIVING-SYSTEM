console.log("Dashboard JS Loaded");

// ==========================================
// RILCO HR DRIVING SYSTEM
// DASHBOARD CONTROLLER
// ==========================================

async function initializeDashboard() {

    updateDate();

    await Promise.all([
        loadEmployeeOverview(),
        loadDriverOverview(),
        loadTodayAttendance(),
        loadPendingLeave(),
        loadRecentActivities()
    ]);

}

// expose to app.js
window.initializeDashboard = initializeDashboard;

// ==========================================
// DATE
// ==========================================

function updateDate() {

    const now = new Date();

    const date = document.getElementById("currentDate");
    const day = document.getElementById("currentDay");

    if (date) {

        date.textContent = now.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });

    }

    if (day) {

        day.textContent = now.toLocaleDateString("en-US", {
            weekday: "long"
        });

    }

}

// ==========================================
// EMPLOYEE OVERVIEW
// ==========================================

async function loadEmployeeOverview() {

    try {

        const { count: totalEmployees, error: e1 } =
            await supabaseClient
                .from("employees")
                .select("*", {
                    count: "exact",
                    head: true
                });

        const { count: workingEmployees, error: e2 } =
            await supabaseClient
                .from("employees")
                .select("*", {
                    count: "exact",
                    head: true
                })
                .eq("status", "WORKING");

        const { count: breakEmployees, error: e3 } =
            await supabaseClient
                .from("employees")
                .select("*", {
                    count: "exact",
                    head: true
                })
                .eq("status", "BREAK");

        const { count: completedEmployees, error: e4 } =
            await supabaseClient
                .from("employees")
                .select("*", {
                    count: "exact",
                    head: true
                })
                .eq("status", "COMPLETED");

        if (e1 || e2 || e3 || e4) {

            console.error(e1 || e2 || e3 || e4);
            return;

        }

        document.getElementById("totalEmployees").textContent =
            totalEmployees ?? 0;

        document.getElementById("workingEmployees").textContent =
            workingEmployees ?? 0;

        document.getElementById("breakEmployees").textContent =
            breakEmployees ?? 0;

        document.getElementById("completedEmployees").textContent =
            completedEmployees ?? 0;

        // Dashboard Summary
        document.getElementById("summaryEmployees").textContent =
            totalEmployees ?? 0;

    }

    catch (err) {

        console.error("Employee Overview", err);

    }

}

// ==========================================
// DRIVER + EMPLOYEE OVERVIEW FIXED
// ==========================================

async function loadDriverOverview() {

    try {

        // TOTAL DRIVERS
        const { count: totalDrivers } = await supabaseClient
            .from("employees")
            .select("*", { count: "exact", head: true })
            .eq("employee_type", "driver");

        // AVAILABLE (WORKING)
        const { count: availableDrivers } = await supabaseClient
            .from("employees")
            .select("*", { count: "exact", head: true })
            .eq("employee_type", "driver")
            .eq("status", "WORKING");

        // DRIVING (ONGOING ASSIGNMENTS)
        const { count: drivingDrivers } = await supabaseClient
            .from("assignments")
            .select("*", { count: "exact", head: true })
            .eq("status", "ONGOING");

        // COMPLETED TRIPS
        const { count: completedTrips } = await supabaseClient
            .from("assignments")
            .select("*", { count: "exact", head: true })
            .eq("status", "COMPLETED");

        // BREAK (if wala ka column, fallback = 0 safe)
        const { count: breakDrivers } = await supabaseClient
            .from("employees")
            .select("*", { count: "exact", head: true })
            .eq("status", "BREAK");

        // UPDATE UI
        document.getElementById("totalDrivers").textContent = totalDrivers || 0;
        document.getElementById("availableDrivers").textContent = availableDrivers || 0;
        document.getElementById("drivingDrivers").textContent = drivingDrivers || 0;
        document.getElementById("completedTrips").textContent = completedTrips || 0;

        // optional kung may break card ka
        const breakEl = document.getElementById("breakDrivers");
        if (breakEl) breakEl.textContent = breakDrivers || 0;

    } catch (err) {
        console.error("Driver Overview Error:", err);
    }

}

// ==========================================
// TODAY ATTENDANCE
// ==========================================

async function loadTodayAttendance() {

    try {

        const today =
            new Date().toISOString().split("T")[0];

        const { count, error } =
            await supabaseClient
                .from("attendance_logs")
                .select("*", {
                    count: "exact",
                    head: true
                })
                .eq("action_date", today);

        if (error) {

            console.error(error);
            return;

        }

        document.getElementById("todayAttendance").textContent =
            count ?? 0;

        document.getElementById("summaryPresent").textContent =
            count ?? 0;

    }

    catch (err) {

        console.error("Attendance", err);

    }

}

// ==========================================
// PENDING LEAVE
// ==========================================

async function loadPendingLeave() {

    try {

        const { count, error } =
            await supabaseClient
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

        document.getElementById("pendingLeave").textContent =
            count ?? 0;

        document.getElementById("summaryLeave").textContent =
            count ?? 0;

    }

    catch (err) {

        console.error("Leave", err);

    }

}

// ==========================================
// RECENT ACTIVITIES
// ==========================================

async function loadRecentActivities() {

    try {

        const { data, error } =
            await supabaseClient
                .from("attendance_logs")
                .select("*")
                .order("action_date", {
                    ascending: false
                })
                .order("log_time", {
                    ascending: false
                })
                .limit(5);

        if (error) {

            console.error(error);
            return;

        }

        const container =
            document.getElementById("recentActivities");

        if (!container) return;

        container.innerHTML = "";

        if (!data || data.length === 0) {

            container.innerHTML =
                "<p>No recent activities.</p>";

            return;

        }

        data.forEach(log => {

            container.innerHTML += `

                <div class="activity">

                    <div>

                        <strong>${log.employee_name}</strong>

                        <br>

                        <small>${log.action}</small>

                    </div>

                    <span>${log.log_time}</span>

                </div>

            `;

        });

    }

    catch (err) {

        console.error("Recent Activities", err);

    }

}
