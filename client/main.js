import { logout } from "../shared/Api.js";
import createId from "./js/createId.js";
import getCurrentTimestamp from "./js/setTime.js"

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

export function addToCart(
  productId,
  name,
  price,
  price_after_discount,
  quantity,
  stock
) {
  if (stock <= 0) {
    alert("Out of stock");
    return;
  }
  if (quantity > stock) {
    alert("Quantity exceeds available stock");
    return;
  }
  if (quantity <= 0) {
    alert("Quantity must be greater than 0");
    return;
  }
  if(localStorage.getItem("isLoggedIn") !== "true"){
    alert("Please login to add items to cart");
    return;
  }
  let carts = JSON.parse(localStorage.getItem("cart")) || [];

  const productIndex = carts.findIndex((cart) => cart.product === productId);

  if (productIndex !== -1) {
    carts[productIndex].quantity += quantity;
    carts[productIndex].total =
      carts[productIndex].quantity * price_after_discount;
  } else {
    const newCart = {
      id: createId(),
      customer: localStorage.getItem("Id"),
      product: productId,
      quantity: quantity,
      name: name,
      price: price,
      stock: stock,
      total: price_after_discount * quantity,
      createdAt: getCurrentTimestamp(),
    };
    carts.push(newCart);
  }

  localStorage.setItem("cart", JSON.stringify(carts));
}

const newArrivalsCarousel = document.getElementById('newArrivalsCarousel');
const productCarousel = document.getElementById('productCarousel');
const featuredProductsCarousel = productCarousel?.querySelector('.carousel-inner');
const featuredIndicators = productCarousel?.querySelector('.carousel-indicators');
import { getProducts } from "../shared/Api.js";
// Get products
const products = await getProducts();

// ===================
// New Arrivals Section
// ===================
products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by newest

const chunkSize = 4;

// Create New Arrivals Carousel
for (let i = 0; i < products.length; i += chunkSize) {
  const chunk = products.slice(i, i + chunkSize);
  const isActive = i === 0 ? "active" : "";

  newArrivalsCarousel.innerHTML += `
    <div class="carousel-item ${isActive}">
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3">
        ${chunk.map(product => `
          <div class="col">
            <div class="card position-relative">
              ${product.discount > 0 ? `<span class="sale-badge">SALE</span>` : `<span class="sale-badge">NEW</span>`}
              <img src="${product.image}" onerror="this.onerror=null;this.src='assets/default-product.jpg';" class="card-img-top" alt="${product.name}">
              <div class="view-icon">
                <a href="product.html?id=${product.id}" class="btn btn-light rounded-circle shadow-sm" title="View Details">
                  <i class="fas fa-eye"></i>
                </a>
              </div>
              <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <p class="card-text">${product.description}</p>
                <a href="#" class="btn btn-primary">Add to Cart</a>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// =========================
// Featured Products Section
// =========================

// Clear previous content
if (featuredProductsCarousel) featuredProductsCarousel.innerHTML = "";
if (featuredIndicators) featuredIndicators.innerHTML = "";

// Featured: no shuffle, keep order
for (let i = 0; i < products.length; i += chunkSize) {
  const chunk = products.slice(i, i + chunkSize);
  const isActive = i === 0 ? "active" : "";

  if (featuredProductsCarousel) {
    featuredProductsCarousel.innerHTML += `
      <div class="carousel-item ${isActive}">
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3">
          ${chunk.map(product => `
            <div class="col">
              <div class="card position-relative">
                ${product.discount > 0 ? `<span class="sale-badge">SALE</span>` : `<span class="sale-badge">NEW</span>`}
                <img src="${product.image}" onerror="this.onerror=null;this.src='assets/default-product.jpg';" class="card-img-top" alt="${product.name}">
                <div class="view-icon">
                  <a href="product.html?id=${product.id}" class="btn btn-light rounded-circle shadow-sm" title="View Details">
                    <i class="fas fa-eye"></i>
                  </a>
                </div>
                <div class="card-body">
                  <h5 class="card-title">${product.name}</h5>
                  <p class="product-price">$${product.price.toFixed(2)}</p>
                  <p class="card-text">${product.description}</p>
                  <a href="#" class="btn btn-primary">Add to Cart</a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Create indicators
  if (featuredIndicators) {
    featuredIndicators.innerHTML += `
      <button type="button" data-bs-target="#productCarousel" data-bs-slide-to="${i / chunkSize}" class="${isActive}" aria-current="${isActive ? "true" : "false"}" aria-label="Slide ${i / chunkSize + 1}"></button>
    `;
  }
}
