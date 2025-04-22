import { logout } from "../../../shared/Api.js";

window.addEventListener("load", () => {
    if (localStorage.getItem("isLoggedIn") !== "true" && localStorage.getItem("isSeller") !== "true") {
        window.location.href = "../../index.html";
    }
});

const logoutBtn = document.getElementById("logout");

logoutBtn.addEventListener("click", () => {
    logout();
    window.location.href = "../../index.html";
}); 