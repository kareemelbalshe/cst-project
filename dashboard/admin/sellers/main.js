import { deleteSeller, getSellers, logout } from "../../../shared/Api.js";
import { renderDataTable } from "../../../shared/table.js";

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

const sellers = await getSellers();

renderDataTable({
  containerId: "page",
  data: sellers,
  onDelete: (id) => {
    deleteSeller(id);
  },
  viewUrl: "./view-sellers/index.html",
});
