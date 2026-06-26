// Procedure List

let procedures = [

    {
        name: "Primer Application",
        department: "Painting",
        duration: "2 Hours"
    },

    {
        name: "Putty Application",
        department: "Painting",
        duration: "1 Hour"
    },

    {
        name: "Sanding",
        department: "Finishing",
        duration: "2 Hours"
    }

];


// Display Procedures

displayProcedures();

function displayProcedures() {

    const table = document.getElementById("procedureTable");

    table.innerHTML = "";

    procedures.forEach((procedure, index) => {

        table.innerHTML += `

        <tr>

            <td>${procedure.name}</td>

            <td>${procedure.department}</td>

            <td>${procedure.duration}</td>

            <td>

                <button class="btn btn-warning btn-sm"
                onclick="editProcedure(${index})">

                    Edit

                </button>

                <button class="btn btn-danger btn-sm"
                onclick="deleteProcedure(${index})">

                    Delete

                </button>

            </td>

        </tr>

        `;

    });

}


// Save Procedure

document.getElementById("saveProcedure").addEventListener("click", function () {

    const name = document.getElementById("procedureName").value.trim();

    const department = document.getElementById("department").value;

    const duration = document.getElementById("duration").value.trim();

    if (!name || !department || !duration) {

        alert("Please complete all fields.");

        return;

    }

    procedures.push({

        name,
        department,
        duration

    });

    displayProcedures();

    clearForm();

});


// Clear Form

function clearForm() {

    document.getElementById("procedureName").value = "";

    document.getElementById("department").value = "";

    document.getElementById("duration").value = "";

}


// Delete

function deleteProcedure(index) {

    if (confirm("Delete this procedure?")) {

        procedures.splice(index, 1);

        displayProcedures();

    }

}


// Edit

function editProcedure(index) {

    const newName = prompt("Procedure Name", procedures[index].name);

    if (newName) {

        procedures[index].name = newName;

        displayProcedures();

    }

}


// Search

document.getElementById("search").addEventListener("keyup", function () {

    const keyword = this.value.toLowerCase();

    const rows = document.querySelectorAll("#procedureTable tr");

    rows.forEach(row => {

        row.style.display = row.innerText.toLowerCase().includes(keyword)

            ? ""

            : "none";

    });

});
