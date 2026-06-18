async function loadDashboard() {

    const { data, error } =
        await supabaseClient
        .from("employees")
        .select("*");

    if(error){

        console.error(error);

        return;
    }

    document.getElementById(
        "totalEmployees"
    ).innerText = data.length;

    document.getElementById(
        "availableEmployees"
    ).innerText =
    data.filter(
        emp => emp.status === "AVAILABLE"
    ).length;

    document.getElementById(
        "drivingEmployees"
    ).innerText =
    data.filter(
        emp => emp.status === "DRIVING"
    ).length;

    document.getElementById(
        "breakEmployees"
    ).innerText =
    data.filter(
        emp => emp.status === "ON_BREAK"
    ).length;
}

loadDashboard();

setInterval(
    loadDashboard,
    3000
);
