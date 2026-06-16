async function loadDrivers(){

    const { data } =
        await supabaseClient
            .from("employees")
            .select("*")
            .eq(
                "employee_type",
                "driver"
            );

    let html = "";

    data.forEach(driver => {

        html += `
        <tr>

            <td>
                ${driver.full_name}
            </td>

            <td>
                ${driver.status}
            </td>

        </tr>
        `;

    });

    document.getElementById(
        "driverTable"
    ).innerHTML = html;
}

loadDrivers();

setInterval(
    loadDrivers,
    3000
);
