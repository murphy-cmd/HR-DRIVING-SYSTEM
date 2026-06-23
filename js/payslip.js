async function generatePayslip() {

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
                emp.employee_name
                .toLowerCase()
                .includes(employee)
        );

    if (!record) {

        alert(
            "Employee not found"
        );

        return;
    }

    const dailyRate = 500;

    const workMatch =
        (record.work_hours || "0h 0m")
        .match(/(\d+)h\s*(\d+)m/);

    let workHours = 0;

    if (workMatch) {

        workHours =
            Number(workMatch[1]) +
            Number(workMatch[2]) / 60;
    }

    const otMatch =
        (record.ot_hours || "0h 0m")
        .match(/(\d+)h\s*(\d+)m/);

    let otHours = 0;

    if (otMatch) {

        otHours =
            Number(otMatch[1]) +
            Number(otMatch[2]) / 60;
    }

    const hourlyRate =
        dailyRate / 8;

    const totalSalary =
        (workHours * hourlyRate)
        +
        (
            otHours *
            hourlyRate *
            1.25
        );

    document.getElementById(
        "employeeName"
    ).innerText =
        record.employee_name;

    document.getElementById(
        "workHours"
    ).innerText =
        record.work_hours;

    document.getElementById(
        "otHours"
    ).innerText =
        record.ot_hours;

    document.getElementById(
        "totalSalary"
    ).innerText =
        totalSalary.toFixed(2);
}
