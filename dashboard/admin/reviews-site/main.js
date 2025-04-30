import { logout, deleteSiteReview, getSiteReviews } from "../../../shared/Api.js";
import { renderDataTable } from "../../js/tableReviews.js";

window.addEventListener("load", () => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
    localStorage.getItem("isAdmin") !== "true"
  ) {
    window.location.href = "../../index.html";
  }
});
setTimeout(() => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
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

const siteReview = await getSiteReviews();

console.log(siteReview)
renderDataTable({
  containerId: "page",
  data: siteReview,
  onDelete: async (id) => {
    await deleteSiteReview(id);
  },
  viewUrl: "./view-review/index.html",
});
 