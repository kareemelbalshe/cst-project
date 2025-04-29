import { logout, getProductsToSeller, getSeller } from "../../shared/Api.js";

window.addEventListener("load", () => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" &&
    localStorage.getItem("isSeller") !== "true"
  ) {
    window.location.href = "../index.html";
  } else {
    initializeDashboard();
  }
});

setTimeout(() => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" &&
    localStorage.getItem("isSeller") !== "true"
  ) {
    window.location.href = "../index.html";
  }
}, 100);

const logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener("click", () => {
  logout();
  window.location.href = "../index.html";
});

// Initialize dashboard data
async function initializeDashboard() {
  try {
    const sellerId = localStorage.getItem("Id");
    const products = await getProductsToSeller(sellerId);

    updateElementCount("products-count", products.length);
    displayProductList("top-products", getSorted(products, "sales", true), "sales", "primary");
    displayProductList("low-stock-products", products.filter(p => (p.quantity || 0) < 10), "quantity", "danger");
    displayRecentProducts(products);
  } catch (err) {
    console.error("Error initializing dashboard:", err);
  }
}

// Update element count text content
function updateElementCount(id, count) {
  document.getElementById(id).textContent = count;
}

// Sort products by given key
function getSorted(products, key, desc = false, limit = 5) {
  return [...products]
    .sort((a, b) => (desc ? (b[key] || 0) - (a[key] || 0) : (a[key] || 0) - (b[key] || 0)))
    .slice(0, limit);
}

// Display product list in a container (for top-selling, low stock, etc.)
function displayProductList(containerId, products, valueKey, badgeClass) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  if (!products.length) {
    container.innerHTML = `<li class="list-group-item">No products found</li>`;
    return;
  }

  products.forEach(({ name, [valueKey]: value = 0 }) => {
    container.innerHTML += `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span>${name}</span>
        <span class="badge bg-${badgeClass} rounded-pill">${value} ${valueKey}</span>
      </li>`;
  });
}

// Display recent products by creation date
function displayRecentProducts(products) {
  const container = document.getElementById("recent-products");
  container.innerHTML = "";

  const recent = getSorted(products, "createdAt", true);

  if (!recent.length) {
    container.innerHTML = `<li class="list-group-item">No products found</li>`;
    return;
  }

  recent.forEach(({ name, createdAt, price }) => {
    const date = new Date(createdAt).toLocaleDateString();
    container.innerHTML += `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <div class="fw-bold">${name}</div>
          <small class="text-muted">${date}</small>
        </div>
        <span class="badge bg-success">$${price}</span>
      </li>`;
  });
}
