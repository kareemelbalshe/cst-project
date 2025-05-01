import { logout, getSiteReview,getCustomer } from "../../../../shared/Api.js";

window.addEventListener("load", () => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
    localStorage.getItem("isAdmin") !== "true"
  ) {
    window.location.href = "../../../index.html";
  }
});
setTimeout(() => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
    localStorage.getItem("isAdmin") !== "true"
  ) {
    window.location.href = "../../../index.html";
  }
}, 100);

const logoutBtn = document.getElementById("logout");

logoutBtn.addEventListener("click", () => {
  logout();
  window.location.href = "../../../index.html";
});

const params = new URLSearchParams(window.location.search);
const site_reviews = params.get("id");
const response_SiteReview = await getSiteReview(site_reviews);
console.log(response_SiteReview);
const customerId = response_SiteReview.customer;
const response_Customer = await getCustomer(customerId);
console.log(response_Customer);

const review = document.getElementById("review");
const reviewid=document.getElementById("reviewid");
const customerName = document.getElementById("customername");
const customerImage = document.getElementById("customerimage");
const customerEmail = document.getElementById("customeremail");
const customerAddress = document.getElementById("custmoeradd");
const customerPhone = document.getElementById("customerphone");

review.innerHTML = response_SiteReview.comment;
reviewid.innerHTML = response_SiteReview.id;
customerName.innerHTML = response_Customer.name;
customerEmail.innerHTML = response_Customer.email;
customerAddress.innerHTML = response_Customer.address;
customerPhone.innerHTML = response_Customer.phone;
const customerImageContainer = document.querySelector(".customer-image-container");

if (response_Customer.image) {
  customerImage.src = response_Customer.image;
  customerImageContainer.classList.remove("d-none");
} else {
  customerImageContainer.classList.add("d-none");
}
