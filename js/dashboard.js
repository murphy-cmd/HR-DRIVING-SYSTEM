// ==========================================
// DASHBOARD CONTROLLER
// ==========================================

document.addEventListener("DOMContentLoaded", ()=>{

    updateDate();

});

// ==========================================

updateDate();

function updateDate(){

    const now = new Date();

    const date=document.getElementById("currentDate");

    const day=document.getElementById("currentDay");

    if(date){

        date.innerHTML=now.toLocaleDateString("en-US",{

            month:"long",

            day:"numeric",

            year:"numeric"

        });

    }

    if(day){

        day.innerHTML=now.toLocaleDateString("en-US",{

            weekday:"long"

        });

    }

}
