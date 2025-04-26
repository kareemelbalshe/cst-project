import { logout, deleteProduct, getProducts } from "../../../shared/Api.js";
import { renderDataTable } from "../../js/table.js";

window.addEventListener("load", () => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" &&
    localStorage.getItem("isAdmin") !== "true"
  ) {
    window.location.href = "../../index.html";
  }
});
setTimeout(() => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" &&
    localStorage.getItem("isAdmin") !== "true"
  ) {
    window.location.href = "../../index.html";
  }
}, 100);

const logoutBtn = document.getElementById("logout");

logoutBtn.addEventListener("click", () => {
  logout();
  window.location.href = "../../index.html";
});

const products = await getProducts();

renderDataTable({
  containerId: "page",
  data: products,
  onDelete: async (id) => {
    await deleteProduct(id);
  },
  editUrl: "./edit-product/index.html",
});
