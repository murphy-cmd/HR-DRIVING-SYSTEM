window.generatePayslip = async function () {

    const employee =
        document.getElementById(
            "employeeSearch"
        ).value.toLowerCase();

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

    const record =
        data.find(
            emp =>
                emp.employee_name &&
                emp.employee_name
                    .toLowerCase()
                    .includes(employee)
        );

    if (!record) {

        alert("Employee not found");

        return;
    }

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

    // COMPUTE SALARY

    const hourlyRate =
        dailyRate / 8;

    const regularPay =
        workHours * hourlyRate;

    const overtimePay =
        otHours * hourlyRate * 1.25;

    const totalSalary =
        regularPay + overtimePay;

    // DISPLAY RESULT

    document.getElementById(
        "employeeName"
    ).innerText =
        record.employee_name;

    document.getElementById(
        "workHours"
    ).innerText =
        record.work_hours || "0h 0m";

    document.getElementById(
        "otHours"
    ).innerText =
        record.ot_hours || "0h 0m";

    document.getElementById(
        "dailyRate"
    ).innerText =
        dailyRate.toFixed(2);

    document.getElementById(
        "totalSalary"
    ).innerText =
        totalSalary.toFixed(2);

};
