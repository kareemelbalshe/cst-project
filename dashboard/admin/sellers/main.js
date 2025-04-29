import { deleteSeller, getSellers, logout } from "../../../shared/Api.js";
import { renderDataTable } from "../../js/table.js";

window.addEventListener("load", () => {
  if (
    localStorage.getItem("isLoggedIn") !== true &&
    localStorage.getItem("isAdmin") !== true
  ) {
    window.location.href = "../../index.html";
  }
});

setTimeout(() => {
  if (
    localStorage.getItem("isLoggedIn") !== true &&
    localStorage.getItem("isAdmin") !== true
  ) {
    window.location.href = "../../index.html";
  }
}, 100);

const logoutBtn = document.getElementById("logout");

logoutBtn.addEventListener("click", () => {
  logout();
  window.location.href = "../../index.html";
});

const sellers = await getSellers();

renderDataTable({
  containerId: "page",
  data: sellers,
  onDelete: async (id) => {
    await deleteSeller(id);
  },
  viewUrl: "./view-sellers/index.html",
});
