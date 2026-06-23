console.log("Payroll JS Loaded");

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

    console.log("Payroll Data:", data);
    console.log("Payroll Error:", error);

    if (error) {

        console.error(error);

        alert(error.message);

        return;
    }

    let html = "";

    data.forEach(record => {

        const dailyRate = 500;

        const workHours =
            parseInt(record.work_hours) || 0;

        const otHours =
            parseInt(record.ot_hours) || 0;

        const hourlyRate =
            dailyRate / 8;

        const totalSalary =
            (workHours * hourlyRate)
            +
            (otHours * hourlyRate * 1.25);

        html += `

        <tr>

            <td>${record.employee_name || "-"}</td>

            <td>${record.work_hours || "0h 0m"}</td>

            <td>${record.ot_hours || "0h 0m"}</td>

            <td>₱${dailyRate}</td>

            <td>₱${totalSalary.toFixed(2)}</td>

        </tr>

        `;
    });

    document.getElementById(
        "payrollTable"
    ).innerHTML = html;
}

generatePayroll();
