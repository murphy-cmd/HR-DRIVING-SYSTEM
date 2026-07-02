console.log("Leave Module Loaded");

// ===============================
// LOAD EMPLOYEES
// ===============================

async function loadEmployees() {

    const select = document.getElementById("leaveEmployee");

    if (!select) return;

    select.innerHTML = "";

    const { data, error } = await supabaseClient
        .from("employees")
        .select("*")
        .order("full_name");

    if (error) {

        console.error(error);

        return;

    }

    data.forEach(emp => {

        select.innerHTML += `
            <option value="${emp.full_name}">
                ${emp.full_name}
            </option>
        `;

    });

}

// ===============================
// SAVE LEAVE
// ===============================

async function saveLeave() {

    const employee_name =
        document.getElementById("leaveEmployee").value;

    const leave_type =
        document.getElementById("leaveType").value;

    const start_date =
        document.getElementById("startDate").value;

    const end_date =
        document.getElementById("endDate").value;

    const reason =
        document.getElementById("leaveReason").value;

    const status =
        document.getElementById("leaveStatus").value;

    if (
        !employee_name ||
        !start_date ||
        !end_date
    ) {

        alert("Please complete all required fields.");

        return;

    }

    const { error } =
        await supabaseClient
            .from("leave_requests")
            .insert([{

                employee_name,

                leave_type,

                start_date,

                end_date,

                reason,

                status

            }]);

    if (error) {

        console.error(error);

        alert("Failed to save leave.");

        return;

    }

   alert("Leave request saved successfully.");

document.getElementById("leaveEmployee").selectedIndex = 0;
document.getElementById("leaveType").selectedIndex = 0;
document.getElementById("leaveStatus").selectedIndex = 0;
document.getElementById("startDate").value = "";
document.getElementById("endDate").value = "";
document.getElementById("leaveReason").value = "";

loadLeaveRequests();

}

// ===============================
// LOAD LEAVE REQUESTS
// ===============================

async function loadLeaveRequests() {

    const tbody =
        document.getElementById("leaveTable");

    if (!tbody) return;

    tbody.innerHTML = "";

    const { data, error } =
        await supabaseClient
            .from("leave_requests")
            .select("*")
            .order("start_date", {
                ascending: false
            });

    if (error) {

        console.error(error);

        return;

    }

   data.forEach(item => {

    tbody.innerHTML += `

<tr>

<td>${item.employee_name}</td>

<td>${item.leave_type}</td>

<td>${item.start_date}</td>

<td>${item.end_date}</td>

<td>${item.reason}</td>

<td>${item.status}</td>

<td>

<button
class="btn btn-success btn-sm"
onclick="approveLeave(${item.id})">

Approve

</button>

<button
class="btn btn-danger btn-sm"
onclick="rejectLeave(${item.id})">

Reject

</button>

</td>

</tr>

`;

});

}

// ===============================
// INITIALIZE
// ===============================

document
    .getElementById("saveLeave")
    ?.addEventListener("click", saveLeave);

loadEmployees();

loadLeaveRequests();


// ===============================
// APPROVE LEAVE
// ===============================

async function approveLeave(id){

    const { error } =
        await supabaseClient
            .from("leave_requests")
            .update({
                status:"Approved"
            })
            .eq("id",id);

    if(error){

        console.error(error);

        return;

    }

    alert("Leave Approved.");

    loadLeaveRequests();

}


// ===============================
// REJECT LEAVE
// ===============================

async function rejectLeave(id){

    const { error } =
        await supabaseClient
            .from("leave_requests")
            .update({
                status:"Rejected"
            })
            .eq("id",id);

    if(error){

        console.error(error);

        return;

    }

    alert("Leave Rejected.");

    loadLeaveRequests();

}
