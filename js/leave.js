async function submitLeave() {

    const employeeName =
        document.getElementById(
            "employeeName"
        ).value;

    const leaveType =
        document.getElementById(
            "leaveType"
        ).value;

    const startDate =
        document.getElementById(
            "startDate"
        ).value;

    const endDate =
        document.getElementById(
            "endDate"
        ).value;

    const reason =
        document.getElementById(
            "reason"
        ).value;

    if (
        !employeeName ||
        !startDate ||
        !endDate
    ) {

        alert(
            "Please complete all fields."
        );

        return;
    }

    const { error } =
        await supabaseClient
            .from("leave_requests")
            .insert([
                {
                    employee_name:
                        employeeName,

                    leave_type:
                        leaveType,

                    start_date:
                        startDate,

                    end_date:
                        endDate,

                    reason:
                        reason,

                    status:
                        "PENDING"
                }
            ]);

    if (error) {

        console.error(error);

        alert(
            "Failed to submit leave."
        );

        return;
    }

    alert(
        "Leave request submitted."
    );

    document.getElementById(
        "employeeName"
    ).value = "";

    document.getElementById(
        "reason"
    ).value = "";

    loadLeaves();
}

async function approveLeave(id) {

    await supabaseClient
        .from("leave_requests")
        .update({
            status:
                "APPROVED"
        })
        .eq(
            "id",
            id
        );

    loadLeaves();
}

async function rejectLeave(id) {

    await supabaseClient
        .from("leave_requests")
        .update({
            status:
                "REJECTED"
        })
        .eq(
            "id",
            id
        );

    loadLeaves();
}

async function loadLeaves() {

    const { data, error } =
        await supabaseClient
            .from("leave_requests")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );

    if (error) {

        console.error(error);

        return;
    }

    let html = "";

    data.forEach(row => {

        let badge = "";

        if (
            row.status ===
            "APPROVED"
        ) {

            badge =
                `<span class="badge bg-success">
                    APPROVED
                </span>`;
        }

        else if (
            row.status ===
            "REJECTED"
        ) {

            badge =
                `<span class="badge bg-danger">
                    REJECTED
                </span>`;
        }

        else {

            badge =
                `<span class="badge bg-warning text-dark">
                    PENDING
                </span>`;
        }

        html += `

        <tr>

            <td>
                ${row.employee_name}
            </td>

            <td>
                ${row.leave_type}
            </td>

            <td>
                ${row.start_date}
            </td>

            <td>
                ${row.end_date}
            </td>

            <td>
                ${row.reason || "-"}
            </td>

            <td>
                ${badge}
            </td>

            <td>

                <button
                    class="btn btn-success btn-sm"
                    onclick="approveLeave(${row.id})">

                    Approve

                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="rejectLeave(${row.id})">

                    Reject

                </button>

            </td>

        </tr>

        `;
    });

    document.getElementById(
        "leaveTable"
    ).innerHTML = html;
}

loadLeaves();
