console.log("Attendance Board Loaded");

async function loadAttendanceBoard() {

    const today =
        new Date().toLocaleDateString(
            "en-CA",
            {
                timeZone: "Asia/Manila"
            }
        );

    const { data: employees, error } =
        await supabaseClient
            .from("employees")
            .select("*")
            .order("employee_id");

    if (error) {

        console.error(error);

        return;

    }

    const { data: dailyRecords } =
        await supabaseClient
            .from("attendance_daily")
            .select("*")
            .eq("attendance_date", today);

    let html = "";

    employees.forEach(emp => {

        const daily =
            dailyRecords?.find(
                d => d.employee_id === emp.employee_id
            );

        const isDriver =
            emp.employee_type === "driver";

        const amInChecked =
            daily?.am_in ? "checked disabled" : "";

        const breakChecked =
            daily?.break_time ? "checked disabled" : "";

        const pmInChecked =
            daily?.pm_in ? "checked disabled" : "";

        const timeoutChecked =
            daily?.time_out ? "checked disabled" : "";

        const startTripChecked =
            daily?.start_trip ? "checked disabled" : "";

        const endTripChecked =
            daily?.end_trip ? "checked disabled" : "";

        html += `

        <tr>

            <td>${emp.employee_id}</td>

            <td>${emp.full_name}</td>

            <td>${emp.employee_type}</td>

            <td>

                <input
                    type="checkbox"
                    ${amInChecked}
                    onclick="recordAttendance('${emp.employee_id}','${emp.full_name}','AM_IN',this)">

            </td>

            <td>

                ${daily?.late_minutes ?? "-"}

            </td>

            <td>

                ${daily?.attendance_status ?? "-"}

            </td>

            <td>

                <input
                    type="checkbox"
                    ${breakChecked}
                    onclick="recordAttendance('${emp.employee_id}','${emp.full_name}','BREAK',this)">

            </td>

            <td>

                <input
                    type="checkbox"
                    ${pmInChecked}
                    onclick="recordAttendance('${emp.employee_id}','${emp.full_name}','PM_IN',this)">

            </td>

            <td>

                <input
                    type="checkbox"
                    ${timeoutChecked}
                    onclick="recordAttendance('${emp.employee_id}','${emp.full_name}','TIME_OUT',this)">

            </td>

            <td>

                ${daily?.work_hours ?? "-"}

            </td>

            <td>

                ${daily?.ot_hours ?? "-"}

            </td>

            <td>

                ${
                    isDriver
                    ?
                    `<input
                        type="checkbox"
                        ${startTripChecked}
                        onclick="recordAttendance('${emp.employee_id}','${emp.full_name}','START_TRIP',this)">`
                    :
                    "-"
                }

            </td>

            <td>

                ${
                    isDriver
                    ?
                    `<input
                        type="checkbox"
                        ${endTripChecked}
                        onclick="recordAttendance('${emp.employee_id}','${emp.full_name}','END_TRIP',this)">`
                    :
                    "-"
                }

            </td>

        </tr>

        `;

    });

    document.getElementById(
        "attendanceTable"
    ).innerHTML = html;

}

