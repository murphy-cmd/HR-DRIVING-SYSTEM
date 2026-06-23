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

        const workMatch =
            (record.work_hours || "0h 0m")
            .match(/(\d+)h\s+(\d+)m/);

        const workHours =
            workMatch
            ? parseInt(workMatch[1]) +
              parseInt(workMatch[2]) / 60
            : 0;

        // OT HOURS

        const otMatch =
            (record.ot_hours || "0h 0m")
            .match(/(\d+)h\s+(\d+)m/);

        const otHours =
            otMatch
            ? parseInt(otMatch[1]) +
              parseInt(otMatch[2]) / 60
            : 0;

        // SALARY COMPUTATION

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

            <td>
                ₱${totalSalary.toFixed(2)}
            </td>

        </tr>

        `;
    });

    document.getElementById(
        "payrollTable"
    ).innerHTML = html;
}

generatePayroll();
