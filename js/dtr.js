async function generateDTR() {

    const employee =
        document.getElementById("employeeSearch")
        .value
        .toLowerCase();

    const { data, error } =
        await supabaseClient
            .from("attendance_daily")
            .select("*")
            .order(
                "attendance_date",
                { ascending: false }
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

        const amIn =
            record.am_in
            ? record.am_in.split("T")[1]
            : "-";

        const breakTime =
            record.break_time
            ? record.break_time.split("T")[1]
            : "-";

        const pmIn =
            record.pm_in
            ? record.pm_in.split("T")[1]
            : "-";

        const timeOut =
            record.time_out
            ? record.time_out.split("T")[1]
            : "-";

        html += `
        <tr>

            <td>${record.employee_name}</td>

            <td>${record.attendance_date}</td>

            <td>${amIn}</td>

            <td>${breakTime}</td>

            <td>${pmIn}</td>

            <td>${timeOut}</td>

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
