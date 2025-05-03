import { getCategories, deleteCategory, logout } from "../../../shared/Api.js";
import { renderDataTable } from "../../js/table.js";

window.addEventListener("load", () => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
    localStorage.getItem("isAdmin") !== "true"
  ) {
    window.location.href = "../index.html";
  }
});
setTimeout(() => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
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
    if (res.status === true) {
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Category has been deleted.",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to delete category, because it has products.",
      });
    }
  },
  editUrl: "./edit-category/index.html",
});
