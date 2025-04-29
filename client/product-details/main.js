import {
  logout,
  addReview,
  getReviews,
  getProduct,
  getCategory,
} from "../../shared/Api.js";
import createId from "../js/createId.js";

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const headerActions = document.getElementById("header-actions");
  const starContainer = document.getElementById("starContainer");
  const commentInput = document.getElementById("comment");
  const submitReviewBtn = document.getElementById("submitReview");
  const commentList = document.getElementById("commentList");

  // Updated selectors to use IDs for more precise targeting
  const productName = document.getElementById("product-name");
  const productImage = document.getElementById("product-image");
  const productDescription = document.getElementById("product-description");
  const productDetailsList = document.querySelectorAll(".list-group-item");

  let selectedStars = 0;
  const productId = new URLSearchParams(window.location.search).get("id");

  if (!headerActions) return;

  if (currentUser) {
    const logoutBtn = document.createElement("button");
    logoutBtn.className = "btn btn-outline-dark";
    logoutBtn.innerHTML = 'Logout <i class="bi bi-box-arrow-left"></i>';
    logoutBtn.addEventListener("click", () => {
      logout();
      window.location.href = "../index.html";
    });

    headerActions.innerHTML = "";

    const profileLink = document.createElement("a");
    profileLink.className = "btn btn-outline-dark me-2";
    profileLink.href = "../profile/index.html";
    profileLink.innerHTML = `<i class="bi bi-person-circle me-1"></i> ${currentUser.name}`;
    headerActions.appendChild(profileLink);

    const cartLink = document.createElement("a");
    cartLink.className = "btn btn-outline-dark me-2";
    cartLink.href = "../cart/index.html";
    cartLink.innerHTML = '<i class="bi bi-cart4"></i>';

    headerActions.appendChild(logoutBtn);
    headerActions.appendChild(cartLink);
  }

  function handleStarClick(index) {
    selectedStars = index + 1;
    const stars = starContainer.querySelectorAll("i");

    stars.forEach((star, i) => {
      if (i <= index) {
        star.classList.remove("bi-star");
        star.classList.add("bi-star-fill", "text-warning");
      } else {
        star.classList.add("bi-star");
        star.classList.remove("bi-star-fill", "text-warning");
      }
    });
  }

  const stars = starContainer.querySelectorAll("i");
  stars.forEach((star, index) => {
    star.addEventListener("click", () => handleStarClick(index));
  });

  submitReviewBtn.addEventListener("click", async () => {
    if (!currentUser) {
      alert("You must be logged in to leave a review.");
      window.location.href = "../login/index.html";
      return;
    }

    if (selectedStars === 0) {
      alert("Please select a star rating.");
      return;
    }

    if (commentInput.value.trim() === "") {
      alert("Please write a comment.");
      return;
    }

    const reviewBody = {
      id: createId(),
      stars: selectedStars,
      comment: commentInput.value.trim(),
      product: productId,
      user: currentUser.id,
      userName: currentUser.name,
      createdAt: new Date().toISOString(),
    };

    try {
      await addReview(reviewBody);

      const reviewElement = document.createElement("div");
      reviewElement.className = "border-bottom pb-2 mb-2";

      reviewElement.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
          <strong>${currentUser.name}</strong>
          <small class="text-muted">${new Date(
            reviewBody.createdAt
          ).toLocaleString()}</small>
        </div>
        <div class="mb-1">
          ${"★".repeat(reviewBody.stars)}${"☆".repeat(5 - reviewBody.stars)}
        </div>
        <p>${reviewBody.comment}</p>
      `;

      commentList.prepend(reviewElement);

      commentInput.value = "";
      selectedStars = 0;
      handleStarClick(-1);
    } catch (error) {
      console.error(error);
      alert("Failed to submit review. Try again later.");
    }
  });

  async function loadReviews() {
    try {
      const allReviews = await getReviews();
      const productReviews = allReviews.filter(
        (review) => review.product === productId
      );

      commentList.innerHTML = "";

      if (productReviews.length === 0) {
        commentList.innerHTML = "<p>No reviews yet.</p>";
        return;
      }

      productReviews.forEach((review) => {
        const reviewElement = document.createElement("div");
        reviewElement.className = "border-bottom pb-2 mb-2";

        reviewElement.innerHTML = `
          <div class="d-flex justify-content-between align-items-center">
            <strong>${review.userName}</strong>
            <small class="text-muted">${new Date(
              review.createdAt
            ).toLocaleString()}</small>
          </div>
          <div class="mb-1">
            ${"⭐".repeat(review.stars)}${`<i class="bi bi-star"></i>`.repeat(
          5 - review.stars
        )}
          </div>
          <p>${review.comment}</p>
        `;

        commentList.appendChild(reviewElement);
      });
    } catch (error) {
      console.error("Error loading reviews:", error);
      commentList.innerHTML = "<p>Failed to load reviews.</p>";
    }
  }

  async function loadProduct() {
    const product = await getProduct(productId);

    const Category = await getCategory(product.category);
    // Update product name
    productName.textContent = product.name;

    // Set image properties and ensure it's visible
    productImage.src = product.image;
    productImage.alt = product.name;

    // Update product description
    productDescription.textContent = product.description;

    // Update product details - fixing the spacing in the text formatting
    productDetailsList[0].textContent = `Name: ${product.name}`;
    if (product.discount > 0) {
      const discountedPrice = (
        product.price *
        (1 - product.discount / 100)
      ).toFixed(2);
      productDetailsList[1].innerHTML = `
          <span style="text-decoration: line-through; color: gray; font-size: 0.9em;">
            ${product.price}$
          </span>
          <span style="color: green; font-weight: bold; margin-left: 8px;">
            ${discountedPrice}$
          </span>
          <span style="color: red; margin-left: 8px;">
            (${product.discount}% OFF)
          </span>
        `;
    } else {
      productDetailsList[1].innerHTML = `
          <span style="font-weight: bold; color: black;">
            ${product.price}$
          </span>
        `;
    }
    productDetailsList[2].textContent = `Category: ${Category.name}`;
    productDetailsList[3].textContent = `Rating: ${product.rating}⭐`;
    productDetailsList[4].textContent = `Reviews: ${product.totalRatings}`;
    productDetailsList[5].textContent = `Sales: ${product.sales}`;
    productDetailsList[6].textContent = `Quantity: ${product.quantity}`;
    productDetailsList[7].textContent = `Created At: ${new Date(
      product.createdAt
    ).toLocaleString()}`;
  }

  // Initialize
  loadProduct();
  loadReviews();
});
