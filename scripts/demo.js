// js/demo.js
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("demoModal");
    const openBtn = document.getElementById("openDemo");
    const closeBtn = document.getElementById("closeModal");

    if (!modal || !openBtn || !closeBtn) return; // Safety check

    openBtn.onclick = () => {
        modal.style.display = "block";
    };

    closeBtn.onclick = () => {
        modal.style.display = "none";
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
});
