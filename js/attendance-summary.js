console.log("Attendance Summary Loaded");

async function loadAttendanceSummary() {

    const tbody = document.getElementById("summaryTable");

    tbody.innerHTML = "";

    const { data, error } = await supabaseClient
        .from("attendance_daily")
        .select("*")
        .order("attendance_date", { ascending: false });

    if (error) {

        console.error(error);
        return;

    }

    data.forEach(record => {

        tbody.innerHTML += `
        <tr>

            <td>${record.attendance_date ?? "-"}</td>
            <td>${record.employee_id ?? "-"}</td>
            <td>${record.employee_name ?? "-"}</td>
            <td>${record.employee_type ?? "-"}</td>

            <td>${formatTime(record.am_in)}</td>
            <td>${formatTime(record.break_time)}</td>
            <td>${formatTime(record.pm_in)}</td>
            <td>${formatTime(record.time_out)}</td>

            <td>${record.late_display ?? "-"}</td>
            <td>${record.work_hours ?? "-"}</td>
            <td>${record.ot_hours ?? "-"}</td>

            <td>${record.attendance_status || record.status || "-"}</td>

        </tr>
        `;

    });

}

function formatTime(value) {

    if (!value) return "-";

    return new Date(value).toLocaleTimeString("en-PH", {

        hour: "2-digit",
        minute: "2-digit"

    });

}

loadAttendanceSummary();
