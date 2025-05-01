import { getReviews, deleteReview, logout } from "../../../shared/Api.js";
import { renderDataTable } from "../../js/tableReviews.js"

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
const container = document.getElementById("page");

async function loadData() {
  const reviews = await getReviews();
  renderDataTable({
    containerId: "page",
    data: reviews,
    viewUrl: "./view-review/index.html",
    onDelete: async (id) => {
      await deleteReview(id);
      loadData();
    },
  });
}
loadData();