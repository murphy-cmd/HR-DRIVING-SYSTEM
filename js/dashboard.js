// ==========================================
// RILCO HR SYSTEM
// DASHBOARD CONTROLLER
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    initializeDashboard();
});

// ==========================================
// INITIALIZE
// ==========================================

async function initializeDashboard() {

    updateDate();

    await loadEmployeeOverview();

    await loadDriverOverview();

    await loadTodayAttendance();

    await loadPendingLeave();

    await loadRecentActivities();

}

// ==========================================
// DATE
// ==========================================

function updateDate() {

    const now = new Date();

    document.getElementById("currentDate").innerHTML =
        now.toLocaleDateString("en-US",{
            month:"long",
            day:"numeric",
            year:"numeric"
        });

    document.getElementById("currentDay").innerHTML =
        now.toLocaleDateString("en-US",{
            weekday:"long"
        });

}

// ==========================================
// EMPLOYEE OVERVIEW
// ==========================================

async function loadEmployeeOverview(){

    // TOTAL EMPLOYEES
    const { count: totalEmployees } = await supabaseClient
        .from("employees")
        .select("*",{count:"exact",head:true});

    document.getElementById("totalEmployees").textContent =
        totalEmployees || 0;

    // WORKING
    const { count: workingEmployees } = await supabaseClient
        .from("employees")
        .select("*",{count:"exact",head:true})
        .eq("status","WORKING");

    document.getElementById("workingEmployees").textContent =
        workingEmployees || 0;

    // BREAK
    const { count: breakEmployees } = await supabaseClient
        .from("employees")
        .select("*",{count:"exact",head:true})
        .eq("status","BREAK");

    document.getElementById("breakEmployees").textContent =
        breakEmployees || 0;

    // COMPLETED
    const { count: completedEmployees } = await supabaseClient
        .from("employees")
        .select("*",{count:"exact",head:true})
        .eq("status","COMPLETED");

    document.getElementById("completedEmployees").textContent =
        completedEmployees || 0;

}

// ==========================================
// DRIVER OVERVIEW
// ==========================================

async function loadDriverOverview(){

    const { count: totalDrivers } = await supabaseClient
        .from("employees")
        .select("*",{count:"exact",head:true})
        .eq("employee_type","driver");

    document.getElementById("totalDrivers").textContent =
        totalDrivers || 0;

    const { count: availableDrivers } = await supabaseClient
        .from("employees")
        .select("*",{count:"exact",head:true})
        .eq("status","AVAILABLE");

    document.getElementById("availableDrivers").textContent =
        availableDrivers || 0;

    const { count: drivingDrivers } = await supabaseClient
        .from("employees")
        .select("*",{count:"exact",head:true})
        .eq("status","DRIVING");

    document.getElementById("drivingDrivers").textContent =
        drivingDrivers || 0;

    const { count: completedTrips } = await supabaseClient
        .from("assignments")
        .select("*",{count:"exact",head:true})
        .eq("status","COMPLETED");

    document.getElementById("completedTrips").textContent =
        completedTrips || 0;

}

// ==========================================
// TODAY ATTENDANCE
// ==========================================

async function loadTodayAttendance(){

    const today = new Date().toISOString().split("T")[0];

    const { count } = await supabaseClient
        .from("attendance")
        .select("*",{count:"exact",head:true})
        .gte("created_at",today+"T00:00:00")
        .lte("created_at",today+"T23:59:59");

    document.getElementById("todayAttendance").textContent =
        count || 0;

}

// ==========================================
// PENDING LEAVE
// ==========================================

async function loadPendingLeave(){

    const { count } = await supabaseClient
        .from("leave_requests")
        .select("*",{count:"exact",head:true})
        .eq("status","Pending");

    document.getElementById("pendingLeave").textContent =
        count || 0;

}

// ==========================================
// RECENT ACTIVITIES
// ==========================================

async function loadRecentActivities(){

    const { data } = await supabaseClient
        .from("attendance_logs")
        .select("*")
        .order("log_time",{ascending:false})
        .limit(5);

    const container =
        document.getElementById("recentActivities");

    container.innerHTML = "";

    if(!data || data.length===0){

        container.innerHTML=`
        <p>No recent activities.</p>
        `;

        return;

    }

    data.forEach(activity=>{

        container.innerHTML +=`

        <div class="activity">

            <div>

                <strong>${activity.employee_name}</strong>

                <br>

                <small>${activity.action}</small>

            </div>

            <span>

                ${new Date(activity.log_time)
                    .toLocaleTimeString([],{
                        hour:'2-digit',
                        minute:'2-digit'
                    })}

            </span>

        </div>

        `;

    });

}
