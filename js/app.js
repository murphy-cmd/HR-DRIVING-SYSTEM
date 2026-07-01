// ==========================================
// PAGE NAVIGATION
// ==========================================

function showPage(pageId) {

    // Itago lahat ng pages
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    // Ipakita ang napiling page
    document.getElementById(pageId).classList.add("active");

    // Active menu
    document.querySelectorAll(".sidebar-menu li").forEach(item => {
        item.classList.remove("active");
    });

    const activeMenu = document.querySelector(
        `[data-page="${pageId}"]`
    );

    if (activeMenu) {
        activeMenu.classList.add("active");
    }

}

// Default page
document.addEventListener("DOMContentLoaded", () => {

    showPage("dashboardPage");

});
