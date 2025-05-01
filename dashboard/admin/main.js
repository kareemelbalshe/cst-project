import {
  getAdmin,
  logout,
  getCustomers,
  getSellers,
  getProducts,
  getCategories, 
} from "../../shared/Api.js";

window.addEventListener("load", async () => {
  if (

    localStorage.getItem("isLoggedIn") !== "true" ||
    localStorage.getItem("isAdmin") !== "true"
  ) {
    window.location.href = "../index.html";
    return;
  }

  const admin = await getAdmin();
  console.log("Admin Info:", admin);

  await loadDashboardData();
});

setTimeout(() => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
    localStorage.getItem("isAdmin") !== "true"
  ) {
    window.location.href = "../index.html";
  }
}, 100);

const logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener("click", () => {
  logout();
  window.location.href = "../index.html";
});

async function loadDashboardData() {
  try {
    const customers = await getCustomers();
    const sellers = await getSellers();
    const products = await getProducts();
    const categories = await getCategories(); // 👈 fetch categories too

    // Display Counts
    document.getElementById("customers-count").textContent = customers.length;
    document.getElementById("sellers-count").textContent = sellers.length;
    document.getElementById("products-count").textContent = products.length;
    document.getElementById("categories-count").textContent = categories.length; // 👈 new line

    // New Customers This Month
    const currentMonth = new Date().getMonth();
    const newCustomers = customers.filter((c) => {
      return new Date(c.createdAt).getMonth() === currentMonth;
    });
    document.getElementById("new-customers-count").textContent = newCustomers.length;

    // Top 5 Best Selling Products
    const topProducts = products
      .sort((a, b) => (b.sales || 0) - (a.sales || 0))
      .slice(0, 5);
    const topProductsList = document.getElementById("top-products");
    topProducts.forEach((product) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.textContent = product.name;
      const badge = document.createElement("span");
      badge.className = "badge bg-primary rounded-pill";
      badge.textContent = `${product.sales || 0} sales`;
      li.appendChild(badge);
      topProductsList.appendChild(li);
    });

    // Low Stock Products
    const lowStockProducts = products.filter((p) => p.quantity < 5);
    const lowStockList = document.getElementById("low-stock-products");
    lowStockProducts.forEach((product) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.textContent = product.name;
      const badge = document.createElement("span");
      badge.className = "badge bg-danger rounded-pill";
      badge.textContent = `${product.quantity} left`;
      li.appendChild(badge);
      lowStockList.appendChild(li);
    });

    // Recently Added Products
    const recentProducts = products
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
    const recentList = document.getElementById("recent-products");
    recentProducts.forEach((product) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.textContent = product.name;
      const dateBadge = document.createElement("span");
      dateBadge.className = "badge bg-secondary rounded-pill";
      dateBadge.textContent = new Date(product.createdAt).toLocaleDateString();
      li.appendChild(dateBadge);
      recentList.appendChild(li);
    });

  } catch (error) {
    console.error("Failed to load dashboard data:", error);
  }
}