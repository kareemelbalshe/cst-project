import {
  addSiteReview,
  getCategories,
  getCategory,
  getProducts,
  getSiteReviews,
  logout,
} from "../shared/Api.js";
import { addToCart } from "./js/addToCart.js";
import createId from "./js/createId.js";
import getCurrentTimestamp from "./js/setTime.js";



document.addEventListener("DOMContentLoaded", async () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const headerActions = document.getElementById("header-actions");

  if (!headerActions) return;

  if (currentUser) {
    const logoutBtn = document.createElement("button");
    logoutBtn.className = "btn btn-outline-dark";
    logoutBtn.innerHTML = 'Logout <i class="bi bi-box-arrow-left"></i>';
    logoutBtn.addEventListener("click", async () => {
      await logout();
      window.location.href = "index.html";
    });

    headerActions.innerHTML = "";

    const profileLink = document.createElement("a");
    profileLink.className = "btn btn-outline-dark me-2";
    profileLink.href = "./profile/index.html";
    profileLink.innerHTML = `<i class="bi bi-person-circle me-1"></i> ${currentUser.name}`;
    headerActions.appendChild(profileLink);

    const cartLink = document.createElement("a");
    cartLink.className = "btn btn-outline-dark me-2";
    cartLink.href = "./cart/index.html";
    cartLink.innerHTML = '<i class="bi bi-cart4"></i>';

    headerActions.appendChild(logoutBtn);
    headerActions.appendChild(cartLink);
  }

  const popup = document.getElementById("review-popup");
  const submitBtn = document.getElementById("submit-review");
  const starRating = document.getElementById("star-rating");
  let selectedStars = 0;

  starRating.addEventListener("click", (e) => {
    console.log(e.target);
    if (e.target.tagName === "I") {
      selectedStars = parseInt(e.target.dataset.value);
      updateStarUI(selectedStars);
    }
  });

  function updateStarUI(value) {
    const stars = starRating.querySelectorAll("span");
    stars.forEach((star, index) => {
      star.classList.toggle("active", index < value);
    });
  }

  setTimeout(() => {
    if (localStorage.getItem("siteReviewed") !== "true") {
      popup.style.display = "flex";
    }
  }, 2000);

  submitBtn.addEventListener("click", async () => {
    const comment = document.getElementById("review-comment").value.trim();
    const customerId = localStorage.getItem("Id");

    if (!comment || selectedStars === 0) {
      alert("Please fill in all fields.");
      return;
    }

    const review = {
      id: createId(),
      stars: selectedStars,
      comment,
      customer: customerId,
      createdAt: getCurrentTimestamp() 
    };

    await addSiteReview(review);
    localStorage.setItem("siteReviewed", "true");
    popup.style.display = "none";
    Swal.fire({
      title: "Success",
      text: "Thank you for your review!",
      icon: "success",
    });
  });

  const closePopup = document.getElementById("close-popup");
  closePopup.addEventListener("click", () => {
    popup.style.display = "none";
  });

  const CategorySection = document.getElementById("categoriesSection");
  const categories = await getCategories();

  categories.map((item) => {
    CategorySection.innerHTML += `
        <a href="./all-products/index.html?category=${item.id}" class="categoryItem d-flex flex-column align-items-center text-decoration-none text-dark border border-3 border-dark rounded-lg shadow-sm">
          <img style="width: 150px; height: 150px;object-fit: cover;" src="${item.image}" alt="${item.name}" class="border-3 border-bottom border-dark mb-2" />
          <p>${item.name}</p>
        </a>`;
  });

  const products = await getProducts();
  const bestSalesSlider = document.getElementById("slider-track");
  bestSalesSlider.innerHTML = "";

  const bestSales = (products || [])
    .filter((item) => item.quantity > 0)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 20);

  const cardWidth = 440;

  (async () => {
    let html = "";

    for (const product of bestSales) {
      const categoryObj = await getCategory(product.category);

      html += `
        <div class="row align-items-center g-3">
          <div class="col-md-6">
            <div class="card product-card shadow-lg p-1">
              <div class="card-body position-relative">
                <a 
                  href="./product-details/index.html?id=${product.id}" 
                  class="eye-icon position-absolute top-1 end-1 m-3 bg-white rounded-circle shadow align-items-center justify-content-center"
                  style="width: 40px; height: 40px;z-index: 10;"
                >
                  <i class="bi bi-eye fs-4 text-primary"></i>
                </a>
  
                <img
                  src="${product.image}"
                  alt="Product Image"
                  class="img-fluid product-image"
                />
                <div class="">
                  <h2 class="card-title fw-bold mb-1">${product.name.slice(0, 19)}</h2>
                  <p class="text-muted">${product.description.slice(
                    0,
                    70
                  )}...</p>
                  <ul class="list-unstyled mt-1 mb-1">
                    <li class="fs-4">
                      <strong>Price:</strong>
                      ${
                        product.discount > 0
                          ? `<span class="text-danger text-decoration-line-through">${product.price}$</span>`
                          : ""
                      }
                      <span class="text-success fw-bold ms-2">${
                        product.price_after_discount
                      }$</span>
                    </li>
                    ${
                      product.discount > 0
                        ? `<li><strong>Discount:</strong> <span class="text-danger">${product.discount}%</span></li>`
                        : ""
                    }
                    <li><strong>Quantity:</strong> ${product.quantity}</li>
                    <li><strong>Rating:</strong> ${product.rating} ⭐</li>
                    <li><strong>Category:</strong> (${categoryObj.name})</li>
                  </ul>
                  <button
                    class="btn add-to-cart-btn-1 px-4 py-2 rounded-pill text-white"
                    data-id="${product.id}"
                    data-name="${product.name}"
                    data-price="${product.price}"
                    data-price-after-discount="${product.price_after_discount}"
                    data-stock="${product.quantity}"
                    data-quantity="1"
                  >
                    <i class="bi bi-cart-plus"></i> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    bestSalesSlider.innerHTML = html;

    document.querySelectorAll(".add-to-cart-btn-1").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const name = btn.getAttribute("data-name");
        const price = parseFloat(btn.getAttribute("data-price"));
        const priceAfterDiscount = parseFloat(
          btn.getAttribute("data-price-after-discount")
        );
        const quantity = parseInt(btn.getAttribute("data-quantity"));
        const stock = parseInt(btn.getAttribute("data-stock"));

        addToCart(id, name, price, priceAfterDiscount, quantity, stock);
      });
    });
  })();

  let currentPosition = 0;
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  prevBtn.addEventListener("click", () => {
    if (currentPosition < 0) {
      currentPosition += cardWidth;
      bestSalesSlider.style.transform = `translateX(${currentPosition}px)`;
      bestSalesSlider.style.transition = "transform 0.5s ease";
    }
  });

  nextBtn.addEventListener("click", () => {
    const maxScroll = -(
      cardWidth *
      (bestSales.length - Math.floor(window.innerWidth / cardWidth))
    );
    if (currentPosition > maxScroll) {
      currentPosition -= cardWidth;
      bestSalesSlider.style.transform = `translateX(${currentPosition}px)`;
      bestSalesSlider.style.transition = "transform 0.5s ease";
    }
  });

  const lessQualitySlider = document.getElementById("slider-track-less");
  lessQualitySlider.innerHTML = "";

  const lessQuality = (products || [])
    .filter((item) => item.quantity > 0)
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 20);

  (async () => {
    let html = "";

    for (const product of lessQuality) {
      const categoryObj = await getCategory(product.category);

      html += `
          <div class="row align-items-center g-3">
          <div class="col-md-6">
            <div class="card product-card shadow-lg p-1">
              <div class="card-body position-relative">
                <a 
                  href="./product-details/index.html?id=${product.id}" 
                  class="eye-icon position-absolute top-1 end-1 m-3 bg-white rounded-circle shadow align-items-center justify-content-center"
                  style="width: 40px; height: 40px;z-index: 10;"
                >
                  <i class="bi bi-eye fs-4 text-primary"></i>
                </a>
  
                <img
                  src="${product.image}"
                  alt="Product Image"
                  class="img-fluid product-image"
                />
                <div class="">
                  <h2 class="card-title fw-bold mb-1">${product.name.slice(0, 19)}</h2>
                  <p class="text-muted">${product.description.slice(
                    0,
                    70
                  )}...</p>
                  <ul class="list-unstyled mt-1 mb-1">
                    <li class="fs-4">
                      <strong>Price:</strong>
                      ${
                        product.discount > 0
                          ? `<span class="text-danger text-decoration-line-through">${product.price}$</span>`
                          : ""
                      }
                      <span class="text-success fw-bold ms-2">${
                        product.price_after_discount
                      }$</span>
                    </li>
                    ${
                      product.discount > 0
                        ? `<li><strong>Discount:</strong> <span class="text-danger">${product.discount}%</span></li>`
                        : ""
                    }
                    <li><strong>Quantity:</strong> ${product.quantity}</li>
                    <li><strong>Rating:</strong> ${product.rating} ⭐</li>
                    <li><strong>Category:</strong> (${categoryObj.name})</li>
                  </ul>
                  <button
                    class="btn add-to-cart-btn-2 px-4 py-2 rounded-pill text-white"
                    data-id="${product.id}"
                    data-name="${product.name}"
                    data-price="${product.price}"
                    data-price-after-discount="${product.price_after_discount}"
                    data-stock="${product.quantity}"
                    data-quantity="1"
                  >
                    <i class="bi bi-cart-plus"></i> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        `;
    }

    lessQualitySlider.innerHTML = html;

    document.querySelectorAll(".add-to-cart-btn-2").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const name = btn.getAttribute("data-name");
        const price = parseFloat(btn.getAttribute("data-price"));
        const priceAfterDiscount = parseFloat(
          btn.getAttribute("data-price-after-discount")
        );
        const quantity = parseInt(btn.getAttribute("data-quantity"));
        const stock = parseInt(btn.getAttribute("data-stock"));

        addToCart(id, name, price, priceAfterDiscount, quantity, stock);
      });
    });
  })();

  let currentPositionLess = 0;
  const prevBtnLess = document.getElementById("prev-btn-less");
  const nextBtnLess = document.getElementById("next-btn-less");

  prevBtnLess.addEventListener("click", () => {
    if (currentPositionLess < 0) {
      currentPositionLess += cardWidth;
      lessQualitySlider.style.transform = `translateX(${currentPositionLess}px)`;
      lessQualitySlider.style.transition = "transform 0.5s ease";
    }
  });

  nextBtnLess.addEventListener("click", () => {
    const maxScroll = -(
      cardWidth *
      (lessQuality.length - Math.floor(window.innerWidth / cardWidth))
    );
    if (currentPositionLess > maxScroll) {
      currentPositionLess -= cardWidth;
      lessQualitySlider.style.transform = `translateX(${currentPositionLess}px)`;
      lessQualitySlider.style.transition = "transform 0.5s ease";
    }
  });

  const newArrivalSlider = document.getElementById("slider-track-new");
  newArrivalSlider.innerHTML = "";

  const newArrival = (products || [])
    .filter((item) => item.quantity > 0)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 20);

  (async () => {
    let html = "";

    for (const product of newArrival) {
      const categoryObj = await getCategory(product.category);

      html += `
          <div class="row align-items-center g-3">
          <div class="col-md-6">
            <div class="card product-card shadow-lg p-1">
              <div class="card-body position-relative">
                <a 
                  href="./product-details/index.html?id=${product.id}" 
                  class="eye-icon position-absolute top-1 end-1 m-3 bg-white rounded-circle shadow align-items-center justify-content-center"
                  style="width: 40px; height: 40px;z-index: 10;"
                >
                  <i class="bi bi-eye fs-4 text-primary"></i>
                </a>
  
                <img
                  src="${product.image}"
                  alt="Product Image"
                  class="img-fluid product-image"
                />
                <div class="">
                  <h2 class="card-title fw-bold mb-1">${product.name.slice(0, 19)}</h2>
                  <p class="text-muted">${product.description.slice(
                    0,
                    70
                  )}...</p>
                  <ul class="list-unstyled mt-1 mb-1">
                    <li class="fs-4">
                      <strong>Price:</strong>
                      ${
                        product.discount > 0
                          ? `<span class="text-danger text-decoration-line-through">${product.price}$</span>`
                          : ""
                      }
                      <span class="text-success fw-bold ms-2">${
                        product.price_after_discount
                      }$</span>
                    </li>
                    ${
                      product.discount > 0
                        ? `<li><strong>Discount:</strong> <span class="text-danger">${product.discount}%</span></li>`
                        : ""
                    }
                    <li><strong>Quantity:</strong> ${product.quantity}</li>
                    <li><strong>Rating:</strong> ${product.rating} ⭐</li>
                    <li><strong>Category:</strong> (${categoryObj.name})</li>
                  </ul>
                  <button
                    class="btn add-to-cart-btn-3 px-4 py-2 rounded-pill text-white"
                    data-id="${product.id}"
                    data-name="${product.name}"
                    data-price="${product.price}"
                    data-price-after-discount="${product.price_after_discount}"
                    data-stock="${product.quantity}"
                    data-quantity="1"
                  >
                    <i class="bi bi-cart-plus"></i> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        `;
    }

    newArrivalSlider.innerHTML = html;

    document.querySelectorAll(".add-to-cart-btn-3").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const name = btn.getAttribute("data-name");
        const price = parseFloat(btn.getAttribute("data-price"));
        const priceAfterDiscount = parseFloat(
          btn.getAttribute("data-price-after-discount")
        );
        const quantity = parseInt(btn.getAttribute("data-quantity"));
        const stock = parseInt(btn.getAttribute("data-stock"));

        addToCart(id, name, price, priceAfterDiscount, quantity, stock);
      });
    });
  })();

  let currentPositionNew = 0;
  const prevBtnLNew = document.getElementById("prev-btn-new");
  const nextBtnNew = document.getElementById("next-btn-new");

  prevBtnLNew.addEventListener("click", () => {
    if (currentPositionNew < 0) {
      currentPositionNew += cardWidth;
      newArrivalSlider.style.transform = `translateX(${currentPositionNew}px)`;
      newArrivalSlider.style.transition = "transform 0.5s ease";
    }
  });

  nextBtnNew.addEventListener("click", () => {
    const maxScroll = -(
      cardWidth *
      (lessQuality.length - Math.floor(window.innerWidth / cardWidth))
    );
    if (currentPositionNew > maxScroll) {
      currentPositionNew -= cardWidth;
      newArrivalSlider.style.transform = `translateX(${currentPositionNew}px)`;
      newArrivalSlider.style.transition = "transform 0.5s ease";
    }
  });


  const siteReviews = await getSiteReviews();
  const track = document.querySelector(".review-track");

  siteReviews.forEach((review) => {
    const card = document.createElement("div");
    card.className = "review-card";
  
    let stars = "";
    for (let i = 1; i <= 5; i++) {
      stars += i <= review.stars
        ? `<i class="bi bi-star-fill text-warning"></i>`
        : `<i class="bi bi-star text-muted"></i>`;
    }
  
    card.innerHTML = `
      <div class="mb-2">${stars}</div>
      <p class="text-muted mb-2">${review.comment}</p>
    `;
    track.appendChild(card);
  });
});