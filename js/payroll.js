console.log("Payroll Loaded");

async function generatePayroll() {

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

        const dailyRate = 500;

        // WORK HOURS

        const workText =
            record.work_hours || "0h 0m";

        const workParts =
            workText.match(/(\d+)h\s*(\d+)m/);

        let workHours = 0;

        if (workParts) {

            const hrs =
                Number(workParts[1]);

            const mins =
                Number(workParts[2]);

            workHours =
                hrs + (mins / 60);
        }

        // OT HOURS

        const otText =
            record.ot_hours || "0h 0m";

        const otParts =
            otText.match(/(\d+)h\s*(\d+)m/);

        let otHours = 0;

        if (otParts) {

            const hrs =
                Number(otParts[1]);

            const mins =
                Number(otParts[2]);

            otHours =
                hrs + (mins / 60);
        }

        // PAYROLL COMPUTATION

        const hourlyRate =
            dailyRate / 8;

        const regularPay =
            workHours * hourlyRate;

        const overtimePay =
            otHours * hourlyRate * 1.25;

        const totalSalary =
            regularPay + overtimePay;

        html += `

        <tr>

            <td>${record.employee_name}</td>

            <td>${record.work_hours || "0h 0m"}</td>

            <td>${record.ot_hours || "0h 0m"}</td>

            <td>₱${dailyRate.toFixed(2)}</td>

            <td>₱${totalSalary.toFixed(2)}</td>

        </tr>

        `;
    });

    document.getElementById(
        "payrollTable"
    ).innerHTML = html;
}

generatePayroll();
