import { getAdmin, logout } from "../../shared/Api.js";

window.addEventListener("load", () => {
    if (localStorage.getItem("isLoggedIn") !== "true" && localStorage.getItem("isAdmin") !== "true") {
        window.location.href = "../index.html";
    }
});

const logoutBtn = document.getElementById("logout");

logoutBtn.addEventListener("click", () => {
    logout();
    window.location.href = "../index.html";
});

const admin = await getAdmin();

console.log(admin)