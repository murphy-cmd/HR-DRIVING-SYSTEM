const db = window.db;

console.log("Dashboard JS Loaded");

// ==========================================
// SAFE TEXT SETTER
// ==========================================

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value ?? 0;
}

// ==========================================
// INIT DASHBOARD
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

window.initializeDashboard = initializeDashboard;

// ==========================================
// DATE
// ==========================================

function updateDate() {

    const now = new Date();

    setText("currentDate",
        now.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        })
    );

    setText("currentDay",
        now.toLocaleDateString("en-US", {
            weekday: "long"
        })
    );
}

// ==========================================
// EMPLOYEE OVERVIEW
// ==========================================

async function loadEmployeeOverview() {

    try {

        const { count: total } = await db
            .from("employees")
            .select("*", { count: "exact", head: true });

        const { count: working } = await db
            .from("employees")
            .select("*", { count: "exact", head: true })
            .eq("status", "WORKING");

        const { count: breaking } = await db
    .from("employees")
    .select("*", { count: "exact", head: true })
    .eq("status", "ON_BREAK");

        const { count: completed } = await db
            .from("employees")
            .select("*", { count: "exact", head: true })
            .eq("status", "COMPLETED");

        setText("totalEmployees", total);
        setText("workingEmployees", working);
        setText("breakEmployees", breaking);
        setText("completedEmployees", completed);

    } catch (err) {
        console.error("Employee Overview Error:", err);
    }
}

// ==========================================
// DRIVER OVERVIEW
// ==========================================

async function loadDriverOverview() {

    try {

        const { count: totalDrivers } = await db
            .from("employees")
            .select("*", { count: "exact", head: true })
            .eq("employee_type", "driver");

        const { count: availableDrivers } = await db
            .from("employees")
            .select("*", { count: "exact", head: true })
            .eq("employee_type", "driver")
            .eq("status", "WORKING");

       const { count: drivingDrivers } = await db
    .from("employees")
    .select("*", { count: "exact", head: true })
    .eq("status", "DRIVING");

 const { count: completedTrips } = await db
    .from("employees")
    .select("*", { count: "exact", head: true })
    .eq("status", "COMPLETED");

      const { count: breakDrivers } = await db
    .from("employees")
    .select("*", { count: "exact", head: true })
    .eq("status", "ON_BREAK");

        setText("totalDrivers", totalDrivers);
        setText("availableDrivers", availableDrivers);
        setText("drivingDrivers", drivingDrivers);
        setText("completedTrips", completedTrips);
        setText("breakDrivers", breakDrivers);

    } catch (err) {
        console.error("Driver Overview Error:", err);
    }
}

// ==========================================
// ATTENDANCE
// ==========================================

async function loadTodayAttendance() {

    try {

        const today = new Date().toISOString().split("T")[0];

        const { count } = await db
            .from("attendance_logs")
            .select("*", { count: "exact", head: true })
            .eq("action_date", today);

        setText("todayAttendance", count);
        setText("summaryPresent", count);

    } catch (err) {
        console.error("Attendance Error:", err);
    }
}

// ==========================================
// LEAVE
// ==========================================

async function loadPendingLeave() {

    try {

        const { count } = await db
            .from("leave_requests")
            .select("*", { count: "exact", head: true })
            .eq("status", "Pending");

        setText("pendingLeave", count);
        setText("summaryLeave", count);

    } catch (err) {
        console.error("Leave Error:", err);
    }
}

// ==========================================
// RECENT ACTIVITY
// ==========================================

async function loadRecentActivities() {

    try {

        const { data } = await db
            .from("attendance_logs")
            .select("*")
            .order("action_date", { ascending: false })
            .order("log_time", { ascending: false })
            .limit(5);

        const container = document.getElementById("recentActivities");
        if (!container) return;

        container.innerHTML = "";

        if (!data || data.length === 0) {
            container.innerHTML = "<p>No recent activities.</p>";
            return;
        }

        data.forEach(log => {
            container.innerHTML += `
                <div class="activity">
                    <div>
                        <strong>${log.employee_name || "-"}</strong><br>
                        <small>${log.action || "-"}</small>
                    </div>
                    <span>${log.log_time || "-"}</span>
                </div>
            `;
        });

    } catch (err) {
        console.error("Recent Activities Error:", err);
    }
}
