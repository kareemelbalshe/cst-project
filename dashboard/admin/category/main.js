import { getCategories } from "../../../shared/Api.js";
import { renderDataTable } from "../../../shared/table.js";
import { logout } from "../../../shared/Api.js";
import { deleteCategory } from "../../../shared/Api.js";


window.addEventListener("load", () => {
    if (localStorage.getItem("isLoggedIn") !== "true" && localStorage.getItem("isAdmin") !== "true") {
        window.location.href = "../index.html";
    }
});

const Category=await getCategories();

renderDataTable({
  containerId: "page",
  data: Category,
  onDelete: (id) => {
    deleteCategory(id);
  },
  editUrl: "./edit-category/index.html",
//   viewUrl: "./view-product/index.html",
});

const logoutBtn = document.getElementById("logout");

logoutBtn.addEventListener("click", () => {
    logout();
    window.location.href = "../../index.html";
});