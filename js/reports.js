// ==========================================
// REPORTS MODULE
// RILCO HR SYSTEM
// ==========================================

const reportDb = window.supabaseClient;

// ==========================================
// INITIALIZE REPORTS
// ==========================================

window.initializeReports = function () {

    loadEmployeeSummary();
    loadProjectSummary();
    loadProcedureSummary();
    loadAttendanceSummary();
    loadLeaveSummary();
    loadDriverSummary();
    loadDTRSummary();

};

// ==========================================
// FORMAT NUMBER
// ==========================================

function setText(id, value) {

    const el = document.getElementById(id);

    if (el) {

        el.textContent = value ?? 0;

    }

}

// ==========================================
// EMPLOYEE SUMMARY
// ==========================================

async function loadEmployeeSummary() {

    try {

        const { data, error } = await reportDb

            .from("employees")

            .select("employee_type");

        if (error) throw error;

        const employees = data || [];

        setText(
            "reportTotalEmployees",
            employees.length
        );

        setText(

            "reportOfficeStaff",

            employees.filter(e =>
                e.employee_type === "Office Staff"
            ).length

        );

        setText(

            "reportWarehouseStaff",

            employees.filter(e =>
                e.employee_type === "Warehouse Staff"
            ).length

        );

        setText(

            "reportDrivers",

            employees.filter(e =>
                e.employee_type === "Driver"
            ).length

        );

    }

    catch (err) {

        console.error(

            "Employee Summary Error",

            err

        );

    }

}
// ==========================================
// PROJECT SUMMARY
// ==========================================

async function loadProjectSummary() {

    try {

        const { data, error } = await reportDb

            .from("projects")

            .select("status");

        if (error) throw error;

        const projects = data || [];

        setText(
            "reportTotalProjects",
            projects.length
        );

        setText(

            "reportOngoingProjects",

            projects.filter(p =>
                p.status === "Ongoing"
            ).length

        );

        setText(

            "reportCompletedProjects",

            projects.filter(p =>
                p.status === "Completed"
            ).length

        );

        setText(

            "reportCancelledProjects",

            projects.filter(p =>
                p.status === "Cancelled"
            ).length

        );

    }

    catch (err) {

        console.error(

            "Project Summary Error",

            err

        );

    }

}

// ==========================================
// PROCEDURE SUMMARY
// ==========================================

async function loadProcedureSummary() {

    try {

        const { data, error } = await reportDb

            .from("procedures")

            .select("status");

        if (error) throw error;

        const procedures = data || [];

        setText(
            "reportTotalProcedures",
            procedures.length
        );

        setText(

            "reportActiveProcedures",

            procedures.filter(p =>
                p.status === "Active"
            ).length

        );

        setText(

            "reportInactiveProcedures",

            procedures.filter(p =>
                p.status === "Inactive"
            ).length

        );

    }

    catch (err) {

        console.error(

            "Procedure Summary Error",

            err

        );

    }

}
// ==========================================
// ATTENDANCE SUMMARY
// ==========================================

async function loadAttendanceSummary() {

    try {

        const { data, error } = await reportDb

            .from("attendance_daily")

            .select("attendance_status");

        if (error) throw error;

        const attendance = data || [];

        setText(

            "reportPresent",

            attendance.filter(a =>
                a.attendance_status === "Present"
            ).length

        );

        setText(

            "reportLate",

            attendance.filter(a =>
                a.attendance_status === "Late"
            ).length

        );

        setText(

            "reportAbsent",

            attendance.filter(a =>
                a.attendance_status === "Absent"
            ).length

        );

        setText(

            "reportLeave",

            attendance.filter(a =>
                a.attendance_status === "Leave"
            ).length

        );

    }

    catch (err) {

        console.error(

            "Attendance Summary Error",

            err

        );

    }

}

// ==========================================
// LEAVE SUMMARY
// ==========================================

async function loadLeaveSummary() {

    try {

        const { data, error } = await reportDb

            .from("leave_requests")

            .select("status");

        if (error) throw error;

        const leaves = data || [];

        setText(

            "reportPendingLeave",

            leaves.filter(l =>
                l.status === "Pending"
            ).length

        );

        setText(

            "reportApprovedLeave",

            leaves.filter(l =>
                l.status === "Approved"
            ).length

        );

        setText(

            "reportRejectedLeave",

            leaves.filter(l =>
                l.status === "Rejected"
            ).length

        );

    }

    catch (err) {

        console.error(

            "Leave Summary Error",

            err

        );

    }

}
// ==========================================
// DRIVER SUMMARY
// ==========================================

async function loadDriverSummary() {

    try {

        const { data: employees, error: empError } = await reportDb

            .from("employees")

            .select("employee_type");

        if (empError) throw empError;

        const { data: trips, error: tripError } = await reportDb

            .from("driver_trips")

            .select("status");

        if (tripError) throw tripError;

        const drivers = (employees || []).filter(e =>
            e.employee_type === "Driver"
        );

        const tripList = trips || [];

        setText(

            "reportTotalDrivers",

            drivers.length

        );

        setText(

            "reportDrivingDrivers",

            tripList.filter(t =>
                t.status === "Driving"
            ).length

        );

        setText(

            "reportCompletedTrips",

            tripList.filter(t =>
                t.status === "Completed"
            ).length

        );

        const available =
            drivers.length -
            tripList.filter(t =>
                t.status === "Driving"
            ).length;

        setText(

            "reportAvailableDrivers",

            available < 0 ? 0 : available

        );

    }

    catch (err) {

        console.error(

            "Driver Summary Error",

            err

        );

    }

}

// ==========================================
// DTR SUMMARY
// ==========================================

async function loadDTRSummary() {

    try {

        const { data, error } = await reportDb

            .from("attendance_daily")

            .select(`
                work_hours,
                work_minutes,
                ot_hours,
                ot_minutes,
                late_minutes
            `);

        if (error) throw error;

        const rows = data || [];

        let totalWorkMinutes = 0;
        let totalOTMinutes = 0;
        let totalLateMinutes = 0;

        rows.forEach(row => {

            totalWorkMinutes +=
                ((row.work_hours || 0) * 60) +
                (row.work_minutes || 0);

            totalOTMinutes +=
                ((row.ot_hours || 0) * 60) +
                (row.ot_minutes || 0);

            totalLateMinutes +=
                (row.late_minutes || 0);

        });

        setText(

            "reportWorkingHours",

            (totalWorkMinutes / 60).toFixed(2)

        );

        setText(

            "reportOvertimeHours",

            (totalOTMinutes / 60).toFixed(2)

        );

        setText(

            "reportLateMinutes",

            totalLateMinutes

        );

    }

    catch (err) {

        console.error(

            "DTR Summary Error",

            err

        );

    }

}
// ==========================================
// REFRESH REPORTS
// ==========================================

async function refreshReports() {

    await Promise.all([

        loadEmployeeSummary(),

        loadProjectSummary(),

        loadProcedureSummary(),

        loadAttendanceSummary(),

        loadLeaveSummary(),

        loadDriverSummary(),

        loadDTRSummary()

    ]);

}

// ==========================================
// AUTO REFRESH
// ==========================================

let reportRefreshTimer = null;

function startReportAutoRefresh() {

    if (reportRefreshTimer) {

        clearInterval(reportRefreshTimer);

    }

    reportRefreshTimer = setInterval(() => {

        refreshReports();

    }, 30000);

}
// ==========================================
// REPORTS READY
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    if (!document.querySelector(".reports-page")) {
        return;
    }

    refreshReports();

    startReportAutoRefresh();

});

// ==========================================
// MANUAL REFRESH
// ==========================================

window.refreshReports = refreshReports;

// ==========================================
// STOP AUTO REFRESH
// ==========================================

window.addEventListener("beforeunload", () => {

    if (reportRefreshTimer) {

        clearInterval(reportRefreshTimer);

    }

});
// ==========================================
// REPORTS UTILITIES
// ==========================================

function resetReports() {

    setText("reportTotalEmployees", 0);
    setText("reportOfficeStaff", 0);
    setText("reportWarehouseStaff", 0);
    setText("reportDrivers", 0);

    setText("reportTotalProjects", 0);
    setText("reportOngoingProjects", 0);
    setText("reportCompletedProjects", 0);
    setText("reportCancelledProjects", 0);

    setText("reportTotalProcedures", 0);
    setText("reportActiveProcedures", 0);
    setText("reportInactiveProcedures", 0);

    setText("reportPresent", 0);
    setText("reportLate", 0);
    setText("reportAbsent", 0);
    setText("reportLeave", 0);

    setText("reportPendingLeave", 0);
    setText("reportApprovedLeave", 0);
    setText("reportRejectedLeave", 0);

    setText("reportTotalDrivers", 0);
    setText("reportAvailableDrivers", 0);
    setText("reportDrivingDrivers", 0);
    setText("reportCompletedTrips", 0);

    setText("reportWorkingHours", 0);
    setText("reportOvertimeHours", 0);
    setText("reportLateMinutes", 0);

}

// ==========================================
// RELOAD REPORTS
// ==========================================

window.reloadReports = async function () {

    resetReports();

    await refreshReports();

};
// ==========================================
// FINAL INITIALIZATION
// ==========================================

window.initializeReports = async function () {

    try {

        resetReports();

        await refreshReports();

        startReportAutoRefresh();

        console.log("Reports module initialized successfully.");

    }

    catch (err) {

        console.error("Reports Initialization Error:", err);

    }

};

// ==========================================
// FORCE RELOAD SUPPORT
// ==========================================

window.addEventListener("focus", () => {

    if (document.querySelector(".reports-page")) {

        refreshReports();

    }

});

// ==========================================
// END OF REPORTS MODULE
// ==========================================
