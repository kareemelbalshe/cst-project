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
