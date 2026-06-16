```javascript
async function loadDrivers(){

    const { data, error } =
        await supabaseClient
            .from("employees")
            .select("*")
            .eq(
                "employee_type",
                "driver"
            )
            .order(
                "full_name",
                {
                    ascending:true
                }
            );

    if(error){

        console.error(error);

        return;
    }

    let html = "";

    data.forEach(driver => {

        let badge =
            "secondary";

        if(
            driver.status ===
            "AVAILABLE"
        ){
            badge =
            "success";
        }

        if(
            driver.status ===
            "DRIVING"
        ){
            badge =
            "dark";
        }

        if(
            driver.status ===
            "ON_BREAK"
        ){
            badge =
            "warning";
        }

        if(
            driver.status ===
            "OFF_DUTY"
        ){
            badge =
            "danger";
        }

        html += `

        <tr>

            <td>
                ${driver.employee_id}
            </td>

            <td>
                ${driver.full_name}
            </td>

            <td>

                <span class="badge bg-${badge}">
                    ${driver.status}
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
```
