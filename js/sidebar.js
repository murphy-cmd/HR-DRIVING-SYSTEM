document.addEventListener("DOMContentLoaded", () => {

    const sidebar = document.querySelector(".sidebar");
    const main = document.querySelector(".main");
    const menuToggle = document.getElementById("menuToggle");

    menuToggle.addEventListener("click", () => {

        sidebar.classList.toggle("collapsed");
        main.classList.toggle("expanded");

    });

});
