import { logout } from "../../shared/Api.js";

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

let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
console.log(cartItems);

const tableBody = document.querySelector("tbody");
tableBody.innerHTML = "";

cartItems.forEach((item, index) => {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <th scope="row">${item.name}</th>
    <td>${item.price}</td>
    <td>
      <input
        type="number"
        class="form-control quantity-input"
        value="${item.quantity}"
        min="1"
        max="${item.stock}"
        step="1"
        data-index="${index}"
        style="width: 60px; margin: 0 auto"
      />
    </td>
    <td class="item-total">${item.total}</td>
    <td>
      <button type="button" class="btn btn-danger delete">Delete</button>
    </td>
  `;

  tableBody.appendChild(tr);
});

updateCartTotals();

const deleteButtons = document.querySelectorAll(".delete");
deleteButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    cartItems.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cartItems));

    button.closest("tr").remove();

    attachQuantityEventListeners();

    updateCartTotals();
  });
});

function attachQuantityEventListeners() {
  const quantityInputs = document.querySelectorAll(".quantity-input");

  quantityInputs.forEach((input, index) => {
    input.setAttribute("data-index", index); 
    input.addEventListener("change", (e) => {
      const newQuantity = parseInt(e.target.value);
      const itemIndex = e.target.getAttribute("data-index");
      if (newQuantity >= 1) {
        cartItems[itemIndex].quantity = newQuantity;
        cartItems[itemIndex].total = (cartItems[itemIndex].price * newQuantity).toFixed(2);

        localStorage.setItem("cart", JSON.stringify(cartItems));

        const totalCell = e.target.closest("tr").querySelector(".item-total");
        totalCell.textContent = cartItems[itemIndex].total;

        updateCartTotals();
      }
    });
  });
}


attachQuantityEventListeners();

function updateCartTotals() {
  const subtotal = document.querySelector(".subtotal");
  const total = document.querySelector(".total");

  const subtotalValue = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalValue = cartItems.reduce((acc, item) => acc + parseFloat(item.total), 0);

  subtotal.innerHTML = `EGP${subtotalValue.toFixed(2)}`;
  total.innerHTML = `EGP${totalValue.toFixed(2)}`;
}

let checkoutBtn = document.querySelector(".checkout");
checkoutBtn.addEventListener("click", () => {
  if (cartItems.length === 0) {
    alert("Your cart is empty. Please add items to your cart before checking out.");
    return;
  }

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    alert("Please log in to proceed with checkout.");
    window.location.href = "../login/index.html";
    return;
  }

  localStorage.setItem("cart", JSON.stringify(cartItems));
  window.location.href = "../checkout/index.html";
});

