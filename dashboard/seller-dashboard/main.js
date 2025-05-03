import { logout, getProductsToSeller, getSeller, updateSeller, deleteProduct } from "../../shared/Api.js";

window.addEventListener("load", () => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
    localStorage.getItem("isSeller") !== "true"
  ) {
    window.location.href = "../index.html";
  } else {
    initializeDashboard();
    setupAccountManagement();
  }
});

setTimeout(() => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
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

function setupAccountManagement() {
  const resetPasswordForm = document.getElementById("resetPasswordForm");
  resetPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newPassword = document.getElementById("newPassword").value;
    const confirmNewPassword = document.getElementById("confirmNewPassword").value;

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const sellerId = localStorage.getItem("Id");
      const seller = await getSeller(sellerId);

      await updateSeller(sellerId, { ...seller, password: newPassword });

      const modal = bootstrap.Modal.getInstance(document.getElementById('resetPasswordModal'));
      modal.hide();
    } catch (err) {
      console.error("Error updating password:", err);
      alert("Failed to update password");
    }
  });

  const deleteAccountBtn = document.getElementById("confirmDeleteAccount");
  deleteAccountBtn.addEventListener("click", async () => {
    try {
      const sellerId = localStorage.getItem("Id");

      // ✅ Get products to delete
      const products = await getProductsToSeller(sellerId);
      const productArray = Array.isArray(products)
        ? products
        : (products.products || []);

      // ✅ Delete all products first
      await Promise.all(
        productArray.map((product) => deleteProduct(product.id))
      );

      // ✅ Then delete seller account via direct API call
      const res = await fetch(`http://localhost:5000/sellers/${sellerId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete seller account");
      }

      // ✅ Blur focused element to fix ARIA warning
      if (document.activeElement) document.activeElement.blur();

      logout();
      window.location.href = "../index.html";
    } catch (err) {
      console.error("Error deleting account:", err);
      alert("Failed to delete account");
    }
  });
}

async function initializeDashboard() {
  try {
    const sellerId = localStorage.getItem("Id");
    const products = await getProductsToSeller(sellerId);
    const productArray = Array.isArray(products)
      ? products
      : (products.products || []);

    updateElementCount("products-count", productArray.length);
    displayProductList("top-products", getSorted(productArray, "sales", true), "sales", "primary");
    displayProductList("low-stock-products", productArray.filter(p => (p.quantity || 0) < 10), "quantity", "danger");
    displayRecentProducts(productArray);
  } catch (err) {
    console.error("Error initializing dashboard:", err);
  }
}

function updateElementCount(id, count) {
  document.getElementById(id).textContent = count;
}

function getSorted(products, key, desc = false, limit = 5) {
  return [...products]
    .sort((a, b) => (desc ? (b[key] || 0) - (a[key] || 0) : (a[key] || 0) - (b[key] || 0)))
    .slice(0, limit);
}

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
