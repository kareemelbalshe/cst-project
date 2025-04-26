import {
  deleteCategory,
  getProductsToSeller,
  logout,
} from "../../../shared/Api.js";
import { renderDataTable } from "../../js/table.js";

window.addEventListener("load", () => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" &&
    localStorage.getItem("isSeller") !== "true"
  ) {
    window.location.href = "../../index.html";
  }
});

setTimeout(() => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" &&
    localStorage.getItem("isSeller") !== "true"
  ) {
    window.location.href = "../../index.html";
  }
}, 1000);

const logoutBtn = document.getElementById("logout");

logoutBtn.addEventListener("click", () => {
  logout();
  window.location.href = "../../index.html";
});

const productsToSeller = await getProductsToSeller(localStorage.getItem("Id"));

renderDataTable({
  containerId: "page",
  data: productsToSeller,
  onDelete: (id) => {
    deleteCategory(id);
  },
  editUrl: "./edit-product/index.html",
  //   viewUrl: "./view-product/index.html",
});
