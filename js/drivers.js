async function loadDrivers(){

    const { data, error } =
        await supabaseClient
            .from("employees")
            .select("*")
            .order("full_name");

    if(error){

        console.error(error);

        return;
    }

    let html = "";

    data.forEach(emp => {

        let badge = "secondary";

        if(emp.status === "AVAILABLE")
            badge = "success";

        if(emp.status === "DRIVING")
            badge = "dark";

        if(emp.status === "BREAK")
            badge = "warning";

        if(emp.status === "OFF_DUTY")
            badge = "danger";

        html += `

        <tr>

            <td>${emp.employee_id}</td>

            <td>${emp.full_name}</td>

            <td>${emp.position || ""}</td>

            <td>

                <span class="badge bg-${badge}">
                    ${emp.status}
                </span>

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
