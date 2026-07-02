// ==========================================
// RILCO HR MANAGEMENT SYSTEM
// PRINT DTR
// ==========================================

const params = new URLSearchParams(window.location.search);

const employee =
    params.get("employee") || "";

const fromDate =
    params.get("from") || "";

const toDate =
    params.get("to") || "";

document.getElementById("employeeName").textContent =
    employee || "All Employees";

document.getElementById("dateRange").textContent =
    (fromDate && toDate)
    ? `${fromDate} - ${toDate}`
    : "All Dates";

document.getElementById("generatedDate").textContent =
    new Date().toLocaleString();

let totalRecords = 0;
let totalMinutes = 0;
let totalOTMinutes = 0;

loadReport();

async function loadReport(){

    const tbody =
        document.getElementById("printTable");

    tbody.innerHTML = `
        <tr>
            <td colspan="9">
                Loading Report...
            </td>
        </tr>
    `;

    const { data, error } =
        await supabaseClient
        .from("attendance_daily")
        .select("*")
        .order(
            "attendance_date",
            {
                ascending:true
            }
        );

    if(error){

        console.error(error);

        tbody.innerHTML = `
            <tr>

                <td colspan="9">

                    Failed to load report.

                </td>

            </tr>
        `;

        return;

    }

    let html = "";

    data.forEach(record=>{

        if(

            employee &&

            !record.employee_name

            .toLowerCase()

            .includes(employee.toLowerCase())

        ){

            return;

        }

        if(

            fromDate &&

            record.attendance_date < fromDate

        ){

            return;

        }

        if(

            toDate &&

            record.attendance_date > toDate

        ){

            return;

        }

        totalRecords++;

        const amIn =
            formatTime(record.am_in);

        const breakTime =
            formatTime(record.break_time);

        const pmIn =
            formatTime(record.pm_in);

        const timeOut =
            formatTime(record.time_out);

        html += `

        <tr>

            <td>

                ${record.employee_name}

            </td>

            <td>

                ${record.attendance_date}

            </td>

            <td>

                ${amIn}

            </td>

            <td>

                ${breakTime}

            </td>

            <td>

                ${pmIn}

            </td>

            <td>

                ${timeOut}

            </td>

            <td>

                ${record.work_hours || "-"}

            </td>

            <td>

                ${record.ot_hours || "-"}

            </td>

            <td>

                ${record.status || "-"}

            </td>

        </tr>

        `;

        totalMinutes +=
            convertMinutes(
                record.work_hours
            );

        totalOTMinutes +=
            convertMinutes(
                record.ot_hours
            );

    });

    if(html===""){

        html=`

        <tr>

            <td colspan="9">

                No attendance record found.

            </td>

        </tr>

        `;

    }

    tbody.innerHTML=html;

    document.getElementById(
        "totalRecords"
    ).textContent=totalRecords;

    document.getElementById(
        "totalHours"
    ).textContent=
        convertHours(totalMinutes);

    document.getElementById(
        "totalOT"
    ).textContent=
        convertHours(totalOTMinutes);
