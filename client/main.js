import {
  getCategories,
  getCategory,
  getProducts,
  logout,
} from "../shared/Api.js";
import { addToCart } from "./js/addToCart.js";

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const headerActions = document.getElementById("header-actions");

  if (!headerActions) return;

  if (currentUser) {
    const logoutBtn = document.createElement("button");
    logoutBtn.className = "btn btn-outline-dark";
    logoutBtn.innerHTML = 'Logout <i class="bi bi-box-arrow-left"></i>';
    logoutBtn.addEventListener("click", () => {
      logout();
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
});

const CategorySection = document.getElementById("categories");
const categories = await getCategories();

categories.map((item) => {
  CategorySection.innerHTML += `
        <a href="./all-products/index.html?category=${item.id}" class="d-flex flex-column align-items-center text-decoration-none text-dark border border-3 border-dark rounded-lg shadow-sm">
          <img style="width: 150px; height: 150px;object-fit: cover;" src="${item.image}" alt="${item.name}" class="border-3 border-bottom border-dark mb-2" />
          <p>${item.name}</p>
        </a>`;
});

const bestSalesSection = document.getElementById("slider-track");

const products = await getProducts();
products.sort((a, b) => b.sales - a.sales);

const bestSales = products.filter((item) => item.quantity > 0).slice(0, 20);

const cardWidth = 440;

bestSales.forEach(async (product) => {
  const categoryObj = await getCategory(product.category);
  bestSalesSection.innerHTML += `
     <div class="row align-items-center g-5">
      <div class="col-md-6">
        <div class="card product-card shadow-lg p-4">
    <div class="card-body">
      <a 
        href="./product-details/index.html?id=${product.id}" 
        class="eye-icon position-fixed top-0 end-0 m-3 bg-white rounded-circle shadow d-flex align-items-center justify-content-center"
        style="width: 40px; height: 40px;z-index: 1000;"
      >
        <i class="bi bi-eye fs-4 text-primary"></i>
      </a>

      <img
        id="product-image"
        src="${product.image}"
        alt="Product Image"
        class="img-fluid product-image"
      />
      <div class="m-2">
        <h2 class="card-title fw-bold mb-3" id="product-name">
          ${product.name}
        </h2>
        <p class="text-muted" id="product-description">
          ${product.description.slice(0, 100)}...
        </p>
        <ul class="list-unstyled mt-3 mb-4">
          <li>
            <strong>Price:</strong>
            ${
              product.discount > 0
                ? `<span class="text-danger text-decoration-line-through" id="product-price">${product.price}</span>`
                : ""
            }
            <span
              class="text-success fw-bold ms-2"
              id="product-price-after"
            >${product.price_after_discount}</span>
          </li>
          ${
            product.discount > 0
              ? `<li><strong>Discount:</strong> <span class="text-danger">${product.discount}%</span></li>`
              : ""
          }
          <li>
            <strong>Quantity:</strong>
            <span id="product-quantity">${product.quantity}</span>
          </li>
          <li>
            <strong>Rating:</strong>
            <span id="product-rating">${product.rating}</span> ⭐
          </li>
          <li>
            <strong>Category:</strong>
            <span id="product-category">(${categoryObj.name})</span>
          </li>
        </ul>
        <button
  class="btn add-to-cart-btn px-4 py-2 rounded-pill text-white"
  data-id="${product.id}"
  data-name="${product.name}"
  data-price="${product.price}"
  data-price-after-discount="${product.price_after_discount}"
  data-stock="${product.quantity}"
  data-quantity="1"
  id="add-to-cart-btn"
>
  <i class="bi bi-cart-plus"></i> Add to Cart
</button>
      </div>
    </div>
  </div>
</div>
  `;
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
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
});

let currentPosition = 0;
const bestSalesSlider = document.getElementById("slider-track");
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
