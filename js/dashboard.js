console.log("Dashboard JS Loaded");
// ==========================================
// RILCO HR DRIVING SYSTEM
// DASHBOARD CONTROLLER
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    initializeDashboard();
});

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

        // Total Employees
        const { count: totalEmployees } = await supabaseClient
            .from("employees")
            .select("*", { count: "exact", head: true });

        // Working
        const { count: workingEmployees } = await supabaseClient
            .from("employees")
            .select("*", { count: "exact", head: true })
            .eq("status", "WORKING");

        // Break
        const { count: breakEmployees } = await supabaseClient
            .from("employees")
            .select("*", { count: "exact", head: true })
            .eq("status", "BREAK");

        // Completed
        const { count: completedEmployees } = await supabaseClient
            .from("employees")
            .select("*", { count: "exact", head: true })
            .eq("status", "COMPLETED");

        document.getElementById("totalEmployees").textContent = totalEmployees || 0;
        document.getElementById("workingEmployees").textContent = workingEmployees || 0;
        document.getElementById("breakEmployees").textContent = breakEmployees || 0;
        document.getElementById("completedEmployees").textContent = completedEmployees || 0;

    } catch (err) {

        console.error("Employee Overview:", err);

    }

}

// ==========================================
// DRIVER OVERVIEW
// ==========================================

async function loadDriverOverview() {

    try {

        // Total Drivers
        const { count: totalDrivers } = await supabaseClient
            .from("employees")
            .select("*", { count: "exact", head: true })
            .eq("employee_type", "driver");

        // Available Drivers
        const { count: availableDrivers } = await supabaseClient
            .from("employees")
            .select("*", { count: "exact", head: true })
            .eq("employee_type", "driver")
            .eq("status", "WORKING");

        // Driving
        const { count: drivingDrivers } = await supabaseClient
            .from("assignments")
            .select("*", { count: "exact", head: true })
            .eq("status", "ONGOING");

        // Completed Trips
        const { count: completedTrips } = await supabaseClient
            .from("assignments")
            .select("*", { count: "exact", head: true })
            .eq("status", "COMPLETED");

        document.getElementById("totalDrivers").textContent = totalDrivers || 0;
        document.getElementById("availableDrivers").textContent = availableDrivers || 0;
        document.getElementById("drivingDrivers").textContent = drivingDrivers || 0;
        document.getElementById("completedTrips").textContent = completedTrips || 0;

    } catch (err) {

        console.error("Driver Overview:", err);

    }

}

// ==========================================
// TODAY ATTENDANCE
// ==========================================

async function loadTodayAttendance() {

    try {

        const today = new Date().toISOString().split("T")[0];

        const { count } = await supabaseClient
            .from("attendance_logs")
            .select("*", { count: "exact", head: true })
            .gte("created_at", `${today}T00:00:00`)
            .lt("created_at", `${today}T23:59:59`);

        document.getElementById("todayAttendance").textContent = count || 0;

    } catch (err) {

        console.error("Attendance:", err);

    }

}

// ==========================================
// PENDING LEAVE
// ==========================================

async function loadPendingLeave() {

    try {

        const { count } = await supabaseClient
            .from("leave_requests")
            .select("*", { count: "exact", head: true })
            .eq("status", "Pending");

        document.getElementById("pendingLeave").textContent = count || 0;

    } catch (err) {

        console.error("Leave:", err);

    }

}

// ==========================================
// RECENT ACTIVITIES
// ==========================================

async function loadRecentActivities() {

    try {

        const { data } = await supabaseClient
            .from("attendance_logs")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(5);

        const container = document.getElementById("recentActivities");

        if (!container) return;

        container.innerHTML = "";

        if (!data || data.length === 0) {

            container.innerHTML = `
                <p>No recent activities.</p>
            `;

            return;

        }

        for (const log of data) {

            let employeeName = log.employee_id;

            const { data: emp } = await supabaseClient
                .from("employees")
                .select("full_name")
                .eq("employee_id", log.employee_id)
                .single();

            if (emp) {
                employeeName = emp.full_name;
            }

            container.innerHTML += `

                <div class="activity">

                    <div>

                        <strong>${employeeName}</strong>

                        <br>

                        <small>${log.action}</small>

                    </div>

                    <span>

                        ${new Date(log.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                        })}

                    </span>

                </div>

            `;

        }

    } catch (err) {

        console.error("Recent Activities:", err);

    }

}
