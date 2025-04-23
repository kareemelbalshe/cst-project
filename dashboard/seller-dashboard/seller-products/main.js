import { deleteProduct, getProductsToSeller, logout } from "../../../shared/Api.js";
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

const productsToSeller = await getProductsToSeller(localStorage.getItem("Id"));

renderDataTable({
  containerId: "page",
  data: productsToSeller,
  onDelete: (id) => {
    deleteProduct(id);
  },
  editUrl: "./edit-product/index.html",
//   viewUrl: "./view-product/index.html",
});
