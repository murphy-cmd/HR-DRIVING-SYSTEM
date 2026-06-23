async function generateDTR() {

    const employee =
        document.getElementById(
            "employeeSearch"
        ).value.toLowerCase();

    const { data, error } =
        await supabaseClient
            .from("attendance_daily")
            .select("*")
            .order(
                "attendance_date",
                {
                    ascending: false
                }
            );

    if (error) {

        console.error(error);

        return;
    }

    let html = "";

    data.forEach(record => {

        if (
            employee &&
            !record.employee_name
                .toLowerCase()
                .includes(employee)
        ) {
            return;
        }

        html += `
        <tr>

            <td>${record.employee_name}</td>

            <td>${record.attendance_date}</td>

            <td>${record.am_in || "-"}</td>

            <td>${record.break_time || "-"}</td>

            <td>${record.pm_in || "-"}</td>

            <td>${record.time_out || "-"}</td>

            <td>${record.work_hours || "0h 0m"}</td>

            <td>${record.ot_hours || "0h 0m"}</td>

            <td>${record.status || "-"}</td>

        </tr>
        `;
    });

    document.getElementById(
        "dtrTable"
    ).innerHTML = html;
}

generateDTR();
