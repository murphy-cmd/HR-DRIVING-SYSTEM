async function generateDTR() {

    const employee =
        document
        .getElementById("employeeSearch")
        .value
        .toLowerCase();

    const { data, error } =
        await supabaseClient
            .from("attendance_logs")
            .select("*")
            .order("log_time", {
                ascending: false
            });

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

        html += `
        <tr>

            <td>
                ${new Date(log.log_time)
                    .toLocaleDateString()}
            </td>

            <td>
                ${log.action}
            </td>

            <td>
                ${new Date(log.log_time)
                    .toLocaleTimeString()}
            </td>

        </tr>
        `;
    });

    document
        .getElementById("dtrTable")
        .innerHTML = html;
}
