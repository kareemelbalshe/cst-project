// Import necessary API functions from shared module
import {
  getCart,
  getProduct,
  getCustomer,
  logout,
  deleteCart,
} from "../../../../shared/Api.js";

// Authentication check when page loads
window.addEventListener("load", () => {
  // If user is not logged in or not a seller, redirect to login page
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
    localStorage.getItem("isSeller") !== "true"
  ) {
    window.location.href = "../../../index.html";
  }

  // Load order details if authenticated
  loadOrderDetails();
});

// Re-check authentication status after short delay (for safety)
setTimeout(() => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
    localStorage.getItem("isSeller") !== "true"
  ) {
    window.location.href = "../../../index.html";
  }
}, 100);

// Logout functionality
const logoutBtn = document.getElementById("logout");
// When logout button is clicked, call logout function and redirect to login
logoutBtn.addEventListener("click", () => {
  logout();
  window.location.href = "../../../index.html";
});

// Function to extract order ID from URL query parameters
function getOrderIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

// Function to format date in a readable format
function formatDate(dateString) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Function to format numbers as USD currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

// Main function to load and display order details
async function loadOrderDetails() {
  const orderId = getOrderIdFromUrl(); // Get order ID from URL

  // If no order ID found, redirect to order list page
  if (!orderId) {
    window.location.href = "../index.html";
    return;
  }

  try {
    // Fetch order, product, and customer data using shared API
    const { data, product, customer } = await getCart(orderId);

    // Display order date, ID, and total amount
    document.getElementById("orderDate").textContent = formatDate(
      data.createdAt
    );
    document.getElementById("orderId").textContent = data.id;
    document.getElementById("orderTotal").textContent = formatCurrency(
      data.total
    );

    // Display customer details or "N/A" if not available
    document.getElementById("customerName").textContent =
      customer.name || "N/A";
    document.getElementById("customerEmail").textContent =
      customer.email || "N/A";
    document.getElementById("customerPhone").textContent =
      customer.phone || "N/A";
    document.getElementById("customerAddress").textContent =
      customer.address || "N/A";

    // Populate product details table with product name, description, price, quantity, and subtotal
    const productTableBody = document.getElementById("productTableBody");
    const quantity = data.quantity || 1;
    const pricePerItem = parseFloat(data.total) / quantity;

    productTableBody.innerHTML = `
      <tr>
        <td>${product.name}</td>
        <td>${product.description}</td>
        <td>${formatCurrency(product.price)}</td>
        <td>${quantity}</td>
        <td>${formatCurrency(data.total)}</td>
      </tr>
    `;

    // Hide loading spinner and show the order details section
    document.getElementById("spinner").classList.add("d-none");
    document.getElementById("orderDetails").classList.remove("d-none");
  } catch (error) {
    // Log any errors and alert the user, then redirect back to order list
    console.error("Error loading order details:", error);
    alert("Failed to load order details. Please try again later.");
    window.location.href = "../index.html";
  }
}

document.getElementById("deleteThis").addEventListener("click", async () => {
  Swal.fire({
    title: "Are you sure?",
    text: "This item will be deleted permanently.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      if (orderId) {
        try {
          const orderId = getOrderIdFromUrl();
          await deleteCart(orderId);
          window.location.href = "../index.html";
        } catch (err) {
          console.error("Failed to delete cart:", err);
        }
      }
    }
  });
});
