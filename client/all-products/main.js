import {
  getCategories,
  getCategory,
  getProducts,
  logout,
} from "../../shared/Api.js";
import { addToCart } from "../main.js";

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
});

const productsContainer = document.getElementById("products-container");
const searchInput = document.querySelector('input[type="search"]');
const searchForm = document.querySelector("form[role='search']");
const categoryDropdown = document.querySelector(".dropdown-menu");
const paginationContainer = document.getElementById("pagination-container");
paginationContainer.className = "d-flex justify-content-center my-4";

let allProducts = await getProducts();
let currentPage = 1;
const pageSize = 6;

const categories = await getCategories();
categories.forEach((cat) => {
  const li = document.createElement("li");
  li.innerHTML = `<a class="dropdown-item" href="#" data-id="${cat.id}">${cat.name}</a>`;
  categoryDropdown.appendChild(li);
});

function filterProducts(keyword = "", category = "") {
  return allProducts.filter((product) => {
    const matchName = product.name
      .toLowerCase()
      .includes(keyword.toLowerCase());
    const matchCategory = category ? product.category == category : true;
    return matchName && matchCategory;
  });
}

function paginate(products, page = 1) {
  const start = (page - 1) * pageSize;
  return products.slice(start, start + pageSize);
}

function renderPagination(products) {
  const pageCount = Math.ceil(products.length / pageSize);
  let buttons = "";
  for (let i = 1; i <= pageCount; i++) {
    buttons += `<button class="btn btn-sm btn-${i === currentPage ? "dark" : "outline-dark"
      } mx-1">${i}</button>`;
  }
  paginationContainer.innerHTML = buttons;
  [...paginationContainer.querySelectorAll("button")].forEach((btn) =>
    btn.addEventListener("click", () => {
      currentPage = parseInt(btn.textContent);
      displayProducts();
    })
  );
}

async function displayProducts(keyword = "", category = "") {
  const filtered = filterProducts(keyword, category);
  const paginated = paginate(filtered, currentPage);
  productsContainer.innerHTML = "";

  for (const product of paginated) {
    const categoryObj = await getCategory(product.category);
    productsContainer.innerHTML +=
      `
    <div class="row align-items-center g-5">
      <div class="col-md-6">
        <div class="card product-card shadow-lg p-4">
    <div class="card-body">
      <a 
        href="../product-details/index.html?id=${product.id}" 
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
            ${product.discount > 0
        ? `<span class="text-danger text-decoration-line-through" id="product-price">${product.price}</span>`
        : ""
      }
            <span
              class="text-success fw-bold ms-2"
              id="product-price-after"
            >${product.price_after_discount}</span>
          </li>
          ${product.discount > 0
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
  }

  renderPagination(filtered);

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
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  currentPage = 1;
  const keyword = searchInput.value.trim();
  displayProducts(keyword);
});

categoryDropdown.addEventListener("click", (e) => {
  if (e.target.matches("a")) {
    e.preventDefault();
    const catId = e.target.dataset.id;
    currentPage = 1;
    displayProducts(searchInput.value.trim(), catId);

    const params = new URLSearchParams(window.location.search);
    params.set("category", catId);
    window.history.replaceState({}, "", `${location.pathname}?${params}`);
  }
});

const params = new URLSearchParams(window.location.search);
const categoryId = params.get("category");

if (categoryId) {
  currentPage = 1;
  displayProducts(searchInput.value.trim(), categoryId);
} else {
  currentPage = 1;
  displayProducts(searchInput.value.trim());
}