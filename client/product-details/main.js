import {
  logout,
  addReview,
  getReviews,
  getProduct,
  getCategory,
} from "../../shared/Api.js";
import { addToCart } from "../js/addToCart.js";
import createId from "../js/createId.js";

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const headerActions = document.getElementById("header-actions");

  if (!headerActions) return;

  if (currentUser) {
    const logoutBtn = document.createElement("button");
    logoutBtn.className = "btn btn-outline-dark";
    logoutBtn.innerHTML = 'Logout <i class="bi bi-box-arrow-left"></i>';
    logoutBtn.addEventListener("click", async () => {
      await logout();
      window.location.href = "../index.html";
    });

    headerActions.innerHTML = "";

    const profileLink = document.createElement("a");
    profileLink.className = "btn btn-outline-dark me-2";
    profileLink.href = "../profile/index.html";
    profileLink.innerHTML = `<i class="bi bi-person-circle me-1"></i> ${currentUser.name}`;

    const cartLink = document.createElement("a");
    cartLink.className = "btn btn-outline-dark me-2";
    cartLink.href = "../cart/index.html";
    cartLink.innerHTML = '<i class="bi bi-cart4"></i>';

    headerActions.appendChild(profileLink);
    headerActions.appendChild(logoutBtn);
    headerActions.appendChild(cartLink);
  }

  const productId = new URLSearchParams(window.location.search).get("id");

  const productName = document.getElementById("product-name");
  const productImage = document.getElementById("product-image");
  const productDescription = document.getElementById("product-description");
  const productDetailsList = document.querySelectorAll(".list-group-item");
  const starContainer = document.getElementById("starContainer");
  const commentInput = document.getElementById("comment");
  const submitReviewBtn = document.getElementById("submitReview");
  const commentList = document.getElementById("commentList");
  const addToCartBtn = document.getElementById("addToCartButton");

  let selectedStars = 0;

  // Handle star rating
  function handleStarClick(index) {
    selectedStars = index + 1;
    const stars = starContainer.querySelectorAll("i");
    stars.forEach((star, i) => {
      star.className =
        i <= index ? "bi bi-star-fill text-warning fs-4" : "bi bi-star fs-4";
    });
  }

  // Setup star click listeners
  if (starContainer) {
    starContainer.querySelectorAll("i").forEach((star, index) => {
      star.addEventListener("click", () => handleStarClick(index));
    });
  }

  // Submit review
  if (submitReviewBtn) {
    submitReviewBtn.addEventListener("click", async () => {
      if (!currentUser) {
        return Swal.fire("Error", "Please log in to proceed with review.").then(
          setTimeout(() => {
            window.location.href = "../login/index.html";
          }, 2000)
        );
      }

      if (selectedStars === 0)
        return Swal.fire("Error", "Please select a star rating.");

      if (commentInput.value.trim() === "")
        return Swal.fire("Error", "Please write a comment.");

      const review = {
        id: createId(),
        stars: selectedStars,
        comment: commentInput.value.trim(),
        product: productId,
        customer: currentUser.id,
        userName: currentUser.name,
        createdAt: new Date().toISOString(),
      };

      try {
        await addReview(review);
        commentList.prepend(createReviewElement(review));
        commentInput.value = "";
        selectedStars = 0;
        handleStarClick(-1);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to submit review. Try again later.");
      }
    });
  }

  function createReviewElement(review) {
    const div = document.createElement("div");
    div.className = "border-bottom pb-2 mb-2";
    div.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <strong>${review.userName}</strong>
        <small class="text-muted">${new Date(
          review.createdAt
        ).toLocaleString()}</small>
      </div>
      <div class="mb-1">
        ${"★".repeat(review.stars)}${"☆".repeat(5 - review.stars)}
      </div>
      <p>${review.comment}</p>
    `;
    return div;
  }

  // Load all reviews
  async function loadReviews() {
    try {
      const reviews = await getReviews();
      const productReviews = reviews.filter((r) => r.product === productId);

      commentList.innerHTML = productReviews.length
        ? ""
        : "<p class='text-muted'>No reviews yet.</p>";

      productReviews.forEach((r) =>
        commentList.appendChild(createReviewElement(r))
      );
    } catch (err) {
      console.error("Error loading reviews:", err);
      commentList.innerHTML =
        "<p class='text-danger'>Failed to load reviews.</p>";
    }
  }

  // Load product details
  async function loadProduct() {
    try {
      const product = await getProduct(productId);
      const category = await getCategory(product.category);

      productName.textContent = product.name;
      productImage.src = product.image;
      productImage.alt = product.name;
      productDescription.textContent = product.description;

      const discountPrice = (
        product.price *
        (1 - product.discount / 100)
      ).toFixed(2);

      productDetailsList[0].textContent = `Name: ${product.name}`;
      productDetailsList[1].innerHTML =
        product.discount > 0
          ? `<span style="text-decoration: line-through; color: gray;">${product.price}$</span>
           <span style="color: green; font-weight: bold; margin-left: 8px;">${discountPrice}$</span>
           <span style="color: red; margin-left: 8px;">(${product.discount}% OFF)</span>`
          : `<span style="font-weight: bold; color: black;">${product.price}$</span>`;

      productDetailsList[2].textContent = `Category: ${category.name}`;
      productDetailsList[3].textContent = `Rating: ${product.rating}⭐`;
      productDetailsList[4].textContent = `Reviews: ${product.totalRatings}`;
      productDetailsList[5].textContent = `Sales: ${product.sales}`;
      productDetailsList[6].textContent = `Quantity: ${product.quantity}`;
      productDetailsList[7].textContent = `Created At: ${new Date(
        product.createdAt
      ).toLocaleString()}`;
    } catch (err) {
      console.error("Error loading product:", err);
    }
  }

  // Add to cart handler

  addToCartBtn.addEventListener("click", async () => {
    try {
      const product = await getProduct(productId);
      addToCart(
        productId,
        product.name,
        product.price,
        product.price_after_discount,
        1,
        product.quantity
      );
    } catch (err) {
      console.error("Failed to add to cart:", err);
      Swal.fire("Error", "Failed to add product to cart.");
    }
  });

  // Initialize
  loadProduct();
  loadReviews();
});
