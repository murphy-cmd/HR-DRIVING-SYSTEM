async function loadDashboard() {

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

    const { data: daily, error: dailyError } =
        await supabaseClient
            .from("attendance_daily")
            .select("*")
            .eq("attendance_date", today);

    if (dailyError) {
        console.error(dailyError);
        return;
    }

    // EMPLOYEE OVERVIEW

    const officeEmployees =
        employees.filter(
            emp => emp.employee_type === "office"
        );

    document.getElementById("totalEmployees").innerText =
        officeEmployees.length;

    document.getElementById("workingEmployees").innerText =
        officeEmployees.filter(
            emp => emp.status === "WORKING"
        ).length;

    document.getElementById("breakEmployees").innerText =
        officeEmployees.filter(
            emp => emp.status === "ON_BREAK"
        ).length;

    document.getElementById("completedEmployees").innerText =
        daily.filter(
            row =>
                row.employee_type === "office" &&
                row.completed === true
        ).length;

    // DRIVER OVERVIEW

    const drivers =
        employees.filter(
            emp => emp.employee_type === "driver"
        );

    document.getElementById("totalDrivers").innerText =
        drivers.length;

    document.getElementById("availableDrivers").innerText =
        drivers.filter(
            emp => emp.status === "AVAILABLE"
        ).length;

    document.getElementById("drivingEmployees").innerText =
        drivers.filter(
            emp => emp.status === "DRIVING"
        ).length;

    document.getElementById("completedTrips").innerText =
        daily.filter(
            row =>
                row.employee_type === "driver" &&
                row.completed === true
        ).length;
}

async function loadEmployeeSummary() {

    const today =
        new Date().toLocaleDateString(
            "en-CA",
            {
                timeZone: "Asia/Manila"
            }
        );

    const { data, error } =
        await supabaseClient
            .from("attendance_daily")
            .select("*")
            .eq("attendance_date", today);

    if (error) {
        console.error(error);
        return;
    }

    let html = "";

    const officeEmployees =
        data.filter(
            row =>
                row.employee_type &&
                row.employee_type.toLowerCase() === "office"
        );

    officeEmployees.forEach(emp => {

        html += `
            <tr>
                <td>${emp.employee_name}</td>
                <td>${emp.status || "-"}</td>
                <td>${emp.work_hours || "0h 0m"}</td>
                <td>${emp.ot_hours || "0h 0m"}</td>
            </tr>
        `;
    });

    document.getElementById(
        "employeeSummaryTable"
    ).innerHTML = html;
}

async function loadDriverSummary() {

    const today =
        new Date().toLocaleDateString(
            "en-CA",
            {
                timeZone: "Asia/Manila"
            }
        );

    const { data, error } =
        await supabaseClient
            .from("attendance_daily")
            .select("*")
            .eq("attendance_date", today);

    if (error) {
        console.error(error);
        return;
    }

    let html = "";

    const drivers =
        data.filter(
            row =>
                row.employee_type &&
                row.employee_type.toLowerCase() === "driver"
        );

    drivers.forEach(driver => {

        const startTrip =
            driver.start_trip
            ? new Date(driver.start_trip)
                .toLocaleTimeString("en-PH")
            : "-";

        const endTrip =
            driver.end_trip
            ? new Date(driver.end_trip)
                .toLocaleTimeString("en-PH")
            : "-";

        html += `
            <tr>
                <td>${driver.employee_name}</td>
                <td>${driver.status || "-"}</td>
                <td>${startTrip}</td>
                <td>${endTrip}</td>
                <td>${driver.work_hours || "0h 0m"}</td>
            </tr>
        `;
    });

    document.getElementById(
        "driverSummaryTable"
    ).innerHTML = html;
}

loadDashboard();
loadEmployeeSummary();
loadDriverSummary();

setInterval(() => {

    loadDashboard();
    loadEmployeeSummary();
    loadDriverSummary();

}, 3000);
// ===============================
// CURRENT DATE
// ===============================

const dateElement = document.getElementById("currentDate");

if (dateElement) {

    const today = new Date();

    const options = {
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    dateElement.textContent = today.toLocaleDateString("en-US", options);

}
