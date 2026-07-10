// =========================================
// SHIFT MANAGEMENT
// =========================================

console.log("Shift Management Loaded");

// =========================================
// GET EMPLOYEE SHIFT
// =========================================

async function getEmployeeShift(employeeId, date) {

    const { data, error } = await supabaseClient
        .from("shift_assignments")
        .select("shift_type")
        .eq("employee_id", employeeId)
        .eq("shift_date", date)
        .maybeSingle();

    if (error) {

        console.error(error);

        return "DAY";

    }

    return data?.shift_type || "DAY";

}

// =========================================
// LOAD SHIFT MANAGEMENT
// =========================================

async function loadShiftManagement() {

    console.log("Loading Shift Management...");

    const tbody = document.getElementById("shiftTable");

    if (!tbody) return;

    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="text-center">
                Loading...
            </td>
        </tr>
    `;

    const today = new Date().toLocaleDateString(
        "en-CA",
        {
            timeZone: "Asia/Manila"
        }
    );

    const {
        data: employees,
        error: employeeError
    } = await supabaseClient
        .from("employees")
        .select("*")
        .order("employee_id");

    if (employeeError) {

        console.error(employeeError);

        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-danger text-center">
                    Failed to load employees.
                </td>
            </tr>
        `;

        return;

    }

    const {
        data: shifts,
        error: shiftError
    } = await supabaseClient
        .from("shift_assignments")
        .select("*")
        .eq("shift_date", today);

    if (shiftError) {

        console.error(shiftError);

    }

    let html = "";

    employees.forEach(emp => {

        const assigned = shifts?.find(s =>
            s.employee_id === emp.employee_id
        );

        html += `

<tr>

<td>${emp.employee_id}</td>

<td>${emp.full_name}</td>

<td>${emp.employee_type}</td>

<td>${today}</td>

<td>

<select
id="shift_${emp.employee_id}"
class="form-select">

<option
value="DAY"
${assigned?.shift_type === "DAY" ? "selected" : ""}>

🌞 DAY SHIFT

</option>

<option
value="NIGHT"
${assigned?.shift_type === "NIGHT" ? "selected" : ""}>

🌙 NIGHT SHIFT

</option>

</select>

</td>

<td>

<button
class="btn btn-success btn-sm"
onclick="saveShift('${emp.employee_id}')">

Save

</button>

</td>

</tr>

`;

    });

    tbody.innerHTML = html;

    console.log("Shift Management Loaded Successfully.");

}
// =========================================
// SAVE SHIFT
// =========================================

async function saveShift(employeeId) {

    const today = new Date().toLocaleDateString(
        "en-CA",
        {
            timeZone: "Asia/Manila"
        }
    );

    const shiftType = document.getElementById(
        `shift_${employeeId}`
    ).value;

    // Check existing assignment

    const { data: existing } = await supabaseClient
        .from("shift_assignments")
        .select("id")
        .eq("employee_id", employeeId)
        .eq("shift_date", today)
        .maybeSingle();

    if (existing) {

        const { error } = await supabaseClient
            .from("shift_assignments")
            .update({

                shift_type: shiftType

            })
            .eq("id", existing.id);

        if (error) {

            console.error(error);

            alert("Failed to update shift.");

            return;

        }

    } else {

        const { error } = await supabaseClient
            .from("shift_assignments")
            .insert([{

                employee_id: employeeId,

                shift_date: today,

                shift_type: shiftType

            }]);

        if (error) {

            console.error(error);

            alert("Failed to save shift.");

            return;

        }

    }

    alert("Shift saved successfully!");

    loadShiftManagement();

}
