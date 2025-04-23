import { deleteSeller, getCustomers, logout } from "../../../shared/Api.js";
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

const Customers = await getCustomers();

renderDataTable({
  containerId: "page",
  data: Customers,
  onDelete: (id) => {
    deleteSeller(id);
  },
  viewUrl: "./view-customer/index.html",
});
