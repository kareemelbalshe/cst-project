import { logout } from "../../shared/Api.js";

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const headerActions = document.getElementById("header-actions");

  if (headerActions && currentUser) {
    const profileLink = document.createElement("a");
    profileLink.className = "btn btn-outline-dark me-2";
    profileLink.href = "../profile/index.html";
    profileLink.innerHTML = `<i class="bi bi-person-circle me-1"></i> ${currentUser.name}`;

    const cartLink = document.createElement("a");
    cartLink.className = "btn btn-outline-dark me-2";
    cartLink.href = "../cart/index.html";
    cartLink.innerHTML = '<i class="bi bi-cart4"></i>';

    const logoutBtn = document.createElement("button");
    logoutBtn.className = "btn btn-outline-dark";
    logoutBtn.innerHTML = 'Logout <i class="bi bi-box-arrow-left"></i>';
    logoutBtn.addEventListener("click", () => {
      logout();
      window.location.href = "../index.html";
    });

    headerActions.innerHTML = "";
    headerActions.append(profileLink, logoutBtn, cartLink);
  }

  // Animate table and card
  document.querySelector("table")?.classList.add("animate-cart");
  document.querySelector(".card")?.classList.add("animate-cart");

  renderCartTable();
  document.querySelector(".checkout")?.addEventListener("click", handleCheckout);
});


function renderCartTable() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const tableBody = document.querySelector("tbody");
  tableBody.innerHTML = "";

  cartItems.forEach((item) => {
    const tr = document.createElement("tr");
    tr.dataset.id = item.id;

    tr.innerHTML = `
      <th scope="row">${item.name.slice(0, 30)}</th>
      <td>${item.price}</td>
      <td>
        <input
          type="number"
          class="form-control quantity-input"
          value="${item.quantity}"
          min="1"
          max="${item.stock}"
          step="1"
          data-id="${item.id}"
          style="width: 60px; margin: 0 auto"
        />
      </td>
      <td class="item-total">EGP${parseFloat(item.total).toFixed(2)}</td>
      <td>
        <button type="button" class="btn btn-danger delete" data-id="${item.id}">Delete</button>
      </td>
    `;

    tableBody.appendChild(tr);
  });

  attachQuantityListeners();
  attachDeleteListeners();
  updateCartTotals();
}

function attachDeleteListeners() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  document.querySelectorAll(".delete").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      const updatedCart = cartItems.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      renderCartTable();
    });
  });
}

function attachQuantityListeners() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("change", (e) => {
      const newQty = parseInt(e.target.value);
      const id = e.target.dataset.id;
      const itemIndex = cartItems.findIndex((item) => item.id === id);

      if (itemIndex !== -1 && newQty >= 1) {
        cartItems[itemIndex].quantity = newQty;
        cartItems[itemIndex].total = (
          cartItems[itemIndex].price_after_discount * newQty
        ).toFixed(2);

        localStorage.setItem("cart", JSON.stringify(cartItems));
        renderCartTable();
      }
    });
  });
}

function updateCartTotals() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = cartItems.reduce((acc, item) => acc + parseFloat(item.total), 0);

  document.querySelector(".subtotal").textContent = `EGP${subtotal.toFixed(2)}`;
  document.querySelector(".total").textContent = `EGP${total.toFixed(2)}`;
}
function showToast(message, type = 'danger') {
  const toastEl = document.getElementById('customToast');
  const toastBody = document.getElementById('toastMessage');

  toastBody.textContent = message;
  toastEl.className = `toast align-items-center text-bg-${type} border-0`;

  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}

function handleCheckout() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  if (cartItems.length === 0) {
    // alert("Your cart is empty. Please add items to your cart before checking out.");
    showToast("Your cart is empty. Please add items to your cart before checking out.");
    return;
  }

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    // alert("Please log in to proceed with checkout.");
    showToast("Please log in to proceed with checkout.");
    window.location.href = "../login/index.html";
    return;
  }

  const updatedCart = cartItems.map((item) => ({
    ...item,
    customer: currentUser.id,
    total: (item.price_after_discount * item.quantity).toFixed(2),
  }));

  localStorage.setItem("cart", JSON.stringify(updatedCart));
  window.location.href = "../checkout/index.html";
}