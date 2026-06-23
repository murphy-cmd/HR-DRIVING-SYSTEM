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

Palitan mo ng buong ito:

html += `
<tr>

    <td>${record.employee_name}</td>

    <td>${record.attendance_date}</td>

    <td>${
        record.am_in
        ? new Date(record.am_in).toLocaleTimeString(
            "en-PH",
            {
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit"
            }
        )
        : "-"
    }</td>

    <td>${
        record.break_time
        ? new Date(record.break_time).toLocaleTimeString(
            "en-PH",
            {
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit"
            }
        )
        : "-"
    }</td>

    <td>${
        record.pm_in
        ? new Date(record.pm_in).toLocaleTimeString(
            "en-PH",
            {
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit"
            }
        )
        : "-"
    }</td>

    <td>${
        record.time_out
        ? new Date(record.time_out).toLocaleTimeString(
            "en-PH",
            {
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit"
            }
        )
        : "-"
    }</td>

    <td>${record.work_hours || "0h 0m"}</td>

    <td>${record.ot_hours || "0h 0m"}</td>

    <td>${record.status || "-"}</td>

</tr>
`;
