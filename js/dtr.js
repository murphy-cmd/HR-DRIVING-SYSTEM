// ==========================================
// RILCO DTR SYSTEM
// PART 3A
// ==========================================

// Supabase
const dtrDb = window.db;

// Table Body
const dtrBody = document.getElementById("dtrBody");

// Inputs
const employeeSearch =
    document.getElementById("employeeSearch");

const fromDate =
    document.getElementById("fromDate");

const toDate =
    document.getElementById("toDate");

// Buttons
const generateBtn =
    document.getElementById("generateBtn");

const excelBtn =
    document.getElementById("excelBtn");

const pdfBtn =
    document.getElementById("pdfBtn");

// Summary
const totalRecords =
    document.getElementById("totalRecords");

const totalWorkHours =
    document.getElementById("totalWorkHours");

const totalOTHours =
    document.getElementById("totalOTHours");

// Store Records
let dtrData = [];
// ==========================================
// GENERATE BUTTON
// ==========================================

generateBtn.addEventListener(
    "click",
    generateDTR
);
// ==========================================
// GENERATE DTR
// ==========================================

async function generateDTR() {

    dtrBody.innerHTML = `
        <tr>
            <td colspan="9" class="text-center">
                Loading...
            </td>
        </tr>
    `;

    const {

        data,

        error

} = await dtrDb
        .from("attendance_daily")
        .select("*")
        .order(
            "attendance_date",
            {
                ascending: false
            }
        );

    if(error){

        console.error(error);

        alert("Unable to load attendance.");

        return;

    }

    dtrData = data;

    filterRecords();

}
// ==========================================
// FILTER RECORDS
// ==========================================

function filterRecords(){

    let records = [...dtrData];

    const employee =
        employeeSearch.value
        .trim()
        .toLowerCase();

    const from =
        fromDate.value;

    const to =
        toDate.value;

    if(employee){

        records = records.filter(record =>

            record.employee_name
                .toLowerCase()
                .includes(employee)

        );

    }

    if(from){

        records = records.filter(record =>

            record.attendance_date >= from

        );

    }

    if(to){

        records = records.filter(record =>

            record.attendance_date <= to

        );

    }

    renderTable(records);

}
// ==========================================
// RENDER TABLE
// ==========================================

function renderTable(records){

    dtrBody.innerHTML = "";

    let totalHours = 0;

    let totalOT = 0;

    records.forEach(record=>{

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

        const workHours =
            record.work_hours || "0h 0m";

        const otHours =
            record.ot_hours || "0h 0m";

        const status =
            record.status || "-";

        dtrBody.innerHTML += `

        <tr>

            <td>${record.employee_name}</td>

            <td>${record.attendance_date}</td>

            <td>${amIn}</td>

            <td>${breakTime}</td>

            <td>${pmIn}</td>

            <td>${timeOut}</td>

            <td>${workHours}</td>

            <td>${otHours}</td>

            <td>${status}</td>

        </tr>

        `;

        totalHours += convertHours(workHours);

        totalOT += convertHours(otHours);

    });

    totalRecords.textContent = records.length;

    totalWorkHours.textContent =
        formatHours(totalHours);

    totalOTHours.textContent =
        formatHours(totalOT);

}
// ==========================================
// CONVERT HOURS
// ==========================================

function convertHours(value){

    if(!value) return 0;

    const match =
        value.match(/(\d+)h\s*(\d+)m/i);

    if(!match) return 0;

    const hours =
        parseInt(match[1]);

    const minutes =
        parseInt(match[2]);

    return (hours * 60) + minutes;

}
// ==========================================
// FORMAT HOURS
// ==========================================

function formatHours(minutes){

    const hrs =
        Math.floor(minutes / 60);

    const mins =
        minutes % 60;

    return `${hrs}h ${mins}m`;

}
// ==========================================
// EXPORT EXCEL
// ==========================================

excelBtn.addEventListener(
    "click",
    exportExcel
);

function exportExcel(){

    const table =
        document.getElementById("dtrTable");

    const html =
        table.outerHTML;

    const blob =
        new Blob(
            [html],
            {
                type:
                "application/vnd.ms-excel"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        "RILCO_DTR_Report.xls";

    a.click();

    URL.revokeObjectURL(url);

}
// ==========================================
// EXPORT PDF
// ==========================================

pdfBtn.addEventListener(
    "click",
    exportPDF
);

function exportPDF(){

    const printWindow =
        window.open(
            "",
            "_blank"
        );

    let rows = "";

    dtrBody.querySelectorAll("tr").forEach(row=>{

        rows += row.outerHTML;

    });

    printWindow.document.write(`

<!DOCTYPE html>

<html>

<head>

<title>RILCO DTR Report</title>

<link
href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
rel="stylesheet">

<style>

body{

    padding:30px;
    font-family:Arial,sans-serif;

}

h2{

    text-align:center;
    margin-bottom:5px;

}

h5{

    text-align:center;
    margin-bottom:30px;

}

table{

    width:100%;
    border-collapse:collapse;

}

table,
th,
td{

    border:1px solid #000;

}

th,
td{

    padding:8px;
    text-align:center;
    font-size:13px;

}

.summary{

    margin-top:25px;
    font-size:15px;

}

</style>

</head>

<body>

<h2>

RILCO BUILDERS CONTRACTORS & ENGINEERS

</h2>

<h5>

DAILY TIME RECORD

</h5>

<table>

<thead>

<tr>

<th>Employee</th>

<th>Date</th>

<th>AM IN</th>

<th>BREAK</th>

<th>PM IN</th>

<th>TIME OUT</th>

<th>Work Hours</th>

<th>OT Hours</th>

<th>Status</th>

</tr>

</thead>

<tbody>

${rows}

</tbody>

</table>

<div class="summary">

<p>

<strong>Total Records :</strong>

${totalRecords.textContent}

</p>

<p>

<strong>Total Work Hours :</strong>

${totalWorkHours.textContent}

</p>

<p>

<strong>Total OT Hours :</strong>

${totalOTHours.textContent}

</p>

</div>

</body>

</html>

`);

    printWindow.document.close();

    printWindow.focus();

    setTimeout(()=>{

        printWindow.print();

        printWindow.close();

    },500);

}
// ==========================================
// LIVE FILTERS
// ==========================================

employeeSearch.addEventListener(
    "keyup",
    filterRecords
);

fromDate.addEventListener(
    "change",
    filterRecords
);

toDate.addEventListener(
    "change",
    filterRecords
);

// ==========================================
// AUTO LOAD
// ==========================================

window.initializeDtr = function () {

    generateDTR();

    const generate = document.getElementById("generateBtn");
    const employee = document.getElementById("employeeSearch");
    const from = document.getElementById("fromDate");
    const to = document.getElementById("toDate");
    const excel = document.getElementById("excelBtn");
    const pdf = document.getElementById("pdfBtn");

    if (generate) generate.onclick = generateDTR;
    if (employee) employee.onkeyup = filterRecords;
    if (from) from.onchange = filterRecords;
    if (to) to.onchange = filterRecords;
    if (excel) excel.onclick = exportExcel;
    if (pdf) pdf.onclick = exportPDF;

};

// ==========================================
// SAFETY CHECK
// ==========================================

window.addEventListener(
    "error",
    function(e){

        console.error(
            "DTR ERROR :",
            e.message
        );

    }
);

// ==========================================
// FINISH
// ==========================================

console.log(
    "✅ RILCO DTR MODULE LOADED"
);
