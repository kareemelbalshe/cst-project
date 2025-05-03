import { deleteReview, getReview, logout } from "../../../../shared/Api.js";

window.addEventListener("load", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!isLoggedIn || !isAdmin) {
    window.location.href = "../../../index.html";
    return;
  }
});

setTimeout(() => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
    localStorage.getItem("isAdmin") !== "true"
  ) {
    window.location.href = "../../../index.html";
  }
}, 1000);

const logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener("click", () => {
  logout();
  window.location.href = "../../../index.html";
});


const urlParams = new URLSearchParams(window.location.search);
const reviewId = urlParams.get("id");
const ReviewID = document.getElementById('reviewId');
const customerNameElement = document.getElementById("customerName");
const productNameElement = document.getElementById("productName");
const starsElement = document.getElementById("stars");
const commentElement = document.getElementById("comment");
const createdAtElement = document.getElementById("createdAt");

async function loadReview() {
    const { data, product, customer } = await getReview(reviewId);
    ReviewID.innerHTML=reviewId;
    customerNameElement.innerHTML = customer?.name || data.userName || "Unknown";
    productNameElement.innerHTML = product?.name || "Unknown Product";
    starsElement.innerHTML = data.stars ?? "No stars rating";
    commentElement.innerHTML = data.comment || "No comment";
    createdAtElement.innerHTML = new Date(data.createdAt).toLocaleString()
}
loadReview();

const deleteThis = document.getElementById("deleteThis");
deleteThis.addEventListener("click", async () => {
  Swal.fire({
    title: "Are you sure?",
    text: "This item will be deleted permanently.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      await deleteReview(reviewId);
      window.location.href = "../index.html";
    }
  });
});
