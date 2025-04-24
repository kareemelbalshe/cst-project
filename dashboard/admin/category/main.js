import { getCategories } from "../../../shared/Api.js";
import { renderDataTable } from "../../../shared/table.js";
import { logout } from "../../../shared/Api.js";
import { deleteCategory } from "../../../shared/Api.js";

window.addEventListener("load", () => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" &&
    localStorage.getItem("isAdmin") !== "true"
  ) {
    window.location.href = "../index.html";
  }
});
setTimeout(() => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" &&
    localStorage.getItem("isAdmin") !== "true"
  ) {
    window.location.href = "../index.html";
  }
}, 1000);

const logoutBtn = document.getElementById("logout");

logoutBtn.addEventListener("click", () => {
  logout();
  window.location.href = "../../index.html";
});

const Category = await getCategories();

renderDataTable({
  containerId: "page",
  data: Category,
  onDelete: async (id) => {
    const res = await deleteCategory(id);
    if (res.success) {
      alert("Category deleted successfully!");
    } else {
      alert("Category is used by products, cannot delete!");
    }
  },
  editUrl: "./edit-category/index.html",
});
