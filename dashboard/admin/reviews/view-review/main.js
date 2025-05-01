import { getReview } from "../../../../shared/Api.js";
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
    createdAt.innerHTML = new Date(data.createdAt).toLocaleString()
}
loadReview();
