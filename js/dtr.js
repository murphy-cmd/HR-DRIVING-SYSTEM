async function generateDTR() {

    const employee =
        document.getElementById(
            "employeeSearch"
        ).value.toLowerCase();

    const { data, error } =
        await supabaseClient
            .from("attendance_logs")
            .select("*")
            .order(
                "log_time",
                {
                    ascending: false
                }
            );

    if (error) {

        console.error(error);

        return;
    }

    let html = "";

    data.forEach(log => {

        if (
            employee &&
            !log.employee_name
                .toLowerCase()
                .includes(employee)
        ) {
            return;
        }

        const datePH =
            new Date(log.log_time)
            .toLocaleDateString(
                "en-PH",
                {
                    timeZone: "Asia/Manila"
                }
            );

        const timePH =
            new Date(log.log_time)
            .toLocaleTimeString(
                "en-PH",
                {
                    timeZone: "Asia/Manila"
                }
            );

        html += `
        <tr>

            <td>${datePH}</td>

            <td>${log.action}</td>

            <td>${timePH}</td>

        </tr>
        `;
    });

    document.getElementById(
        "dtrTable"
    ).innerHTML = html;
}
