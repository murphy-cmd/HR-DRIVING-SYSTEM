async function loadHistory() {

    const search =
        document
        .getElementById(
            "searchEmployee"
        )
        .value
        .toLowerCase();

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
            search &&
            !log.employee_name
                .toLowerCase()
                .includes(search)
        ) {
            return;
        }

        let badge = "secondary";

        if (
            log.action ===
            "TIME_IN"
        ) {
            badge = "success";
        }

        if (
            log.action ===
            "TIME_OUT"
        ) {
            badge = "danger";
        }

        if (
            log.action ===
            "BREAK_START"
        ) {
            badge = "warning";
        }

        if (
            log.action ===
            "BREAK_END"
        ) {
            badge = "info";
        }

        if (
            log.action ===
            "START_TRIP"
        ) {
            badge = "dark";
        }

        if (
            log.action ===
            "END_TRIP"
        ) {
            badge = "primary";
        }

       html += `

<tr>

    <td>
        ${log.employee_name}
    </td>

    <td>

        <span class="badge bg-${badge}">
            ${log.action}
        </span>

    </td>

    <td>
        ${new Date(
            log.log_time
        ).toLocaleString(
            "en-PH",
            {
                timeZone: "Asia/Manila"
            }
        )}
    </td>

</tr>

`;
    });

    document.getElementById(
        "historyTable"
    ).innerHTML = html;
}

loadHistory();

setInterval(
    loadHistory,
    5000
);
