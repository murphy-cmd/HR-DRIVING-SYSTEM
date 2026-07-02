// ==========================================
// PRINT DTR
// RILCO HR SYSTEM
// ==========================================

// Kailangan naka-load na ang supabaseClient
const params = new URLSearchParams(window.location.search);

const employeeFilter = params.get("employee") || "";
const fromDate = params.get("from") || "";
const toDate = params.get("to") || "";

document.getElementById("employeeName").textContent =
    employeeFilter || "All Employees";

if (fromDate && toDate) {
    document.getElementById("dateRange").textContent =
        `${fromDate} to ${toDate}`;
} else {
    document.getElementById("dateRange").textContent =
        "All Dates";
}

document.getElementById("generatedDate").textContent =
    "Generated: " + new Date().toLocaleString();

loadPrintDTR();

async function loadPrintDTR() {

    const tbody = document.getElementById("printTable");

    tbody.innerHTML = `
        <tr>
            <td colspan="9" class="text-center">
                Loading...
            </td>
        </tr>
    `;

    const { data, error } = await supabaseClient
        .from("attendance_daily")
        .select("*")
        .order("attendance_date", {
            ascending: true
        });

    if (error) {

        console.error(error);

        tbody.innerHTML = `
            <tr>
                <td colspan="9">
                    Failed to load records.
                </td>
            </tr>
        `;

        return;
    }

    let html = "";

    let totalRecords = 0;
    let totalWorkMinutes = 0;
    let totalOTMinutes = 0;

    data.forEach(record => {

        if (
            employeeFilter &&
            !record.employee_name
                .toLowerCase()
                .includes(employeeFilter.toLowerCase())
        ) {
            return;
        }

        if (
            fromDate &&
            record.attendance_date < fromDate
        ) {
            return;
        }

        if (
            toDate &&
            record.attendance_date > toDate
        ) {
            return;
        }

        totalRecords++;

        const amIn =
            record.am_in
            ? record.am_in.split("T")[1].substring(0,5)
            : "-";

        const breakTime =
            record.break_time
            ? record.break_time.split("T")[1].substring(0,5)
            : "-";

        const pmIn =
            record.pm_in
            ? record.pm_in.split("T")[1].substring(0,5)
            : "-";

        const timeOut =
            record.time_out
            ? record.time_out.split("T")[1].substring(0,5)
            : "-";

        html += `
        <tr>

            <td>${record.employee_name}</td>

            <td>${record.attendance_date}</td>

            <td>${amIn}</td>

            <td>${breakTime}</td>

            <td>${pmIn}</td>

            <td>${timeOut}</td>

            <td>${record.work_hours || "-"}</td>

            <td>${record.ot_hours || "-"}</td>

            <td>${record.status || "-"}</td>

        </tr>
        `;

        totalWorkMinutes += convertToMinutes(
            record.work_hours
        );

        totalOTMinutes += convertToMinutes(
            record.ot_hours
        );

    });

    if (html === "") {

        html = `
        <tr>
            <td colspan="9" class="text-center">
                No DTR records found.
            </td>
        </tr>
        `;
    }

    tbody.innerHTML = html;

    document.getElementById("totalRecords").textContent =
        totalRecords;

    document.getElementById("totalHours").textContent =
        convertToHours(totalWorkMinutes);

    document.getElementById("totalOT").textContent =
        convertToHours(totalOTMinutes);

    // Hintaying ma-render bago mag-print
    setTimeout(() => {

        window.print();

    }, 500);

}

function convertToMinutes(value){

    if(!value) return 0;

    const match = value.match(/(\d+)\s*h\s*(\d+)\s*m/i);

    if(!match) return 0;

    return parseInt(match[1])*60 + parseInt(match[2]);

}

function convertToHours(minutes){

    const h = Math.floor(minutes/60);

    const m = minutes%60;

    return `${h}h ${m}m`;

}
