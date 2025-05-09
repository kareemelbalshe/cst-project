import { logout, addCart, getProduct } from "../../shared/Api.js";
import getCurrentTimestamp from "../js/setTime.js";

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const headerActions = document.getElementById("header-actions");

  if (!headerActions) return;

  if (currentUser) {
    const logoutBtn = document.createElement("button");
    logoutBtn.className = "btn btn-outline-dark";
    logoutBtn.innerHTML = 'Logout <i class="bi bi-box-arrow-left"></i>';
    logoutBtn.addEventListener("click", async () => {
      await logout();
      window.location.href = "../index.html";
    });

    headerActions.innerHTML = "";

    const profileLink = document.createElement("a");
    profileLink.className = "btn btn-outline-dark me-2";
    profileLink.href = "../profile/index.html";
    profileLink.innerHTML = `<i class="bi bi-person-circle me-1"></i> ${currentUser.name}`;

    const cartLink = document.createElement("a");
    cartLink.className = "btn btn-outline-dark me-2";
    cartLink.href = "../cart/index.html";
    cartLink.innerHTML = '<i class="bi bi-cart4"></i>';

    headerActions.appendChild(profileLink);
    headerActions.appendChild(logoutBtn);
    headerActions.appendChild(cartLink);
  }
  // if (!localStorage.getItem("cart")) {
  //   window.location.href = "../all-products/index.html";
  // }
});

let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
let totalPrice = 0;
let totalQuantity = 0;
let totaltext = document.querySelector(".total");
let quantitytext = document.querySelector(".quantity");
let itemtext = document.querySelector(".item");
let paymentbtn = document.querySelector(".payment");

cartItems.forEach(async (item) => {
  totalPrice += parseFloat(item.total);
  totalQuantity += item.quantity;
  quantitytext.innerHTML = `Quantity: ${totalQuantity}`;
  itemtext.innerHTML = `Items: ${cartItems.length}`;
  let product = item.product;

  const response = await getProduct(product);

  const cartTable = document.querySelector(".productdetails");
  const productRow = document.createElement("div");
  productRow.classList.add(
    "row",
    "cart-item",
    "d-flex",
    "mb-3",
    "justify-content-between",
    "align-content-between"
  );

  productRow.innerHTML = `
  <div class="col-md-4 cart-item-image">
    <img src="${response.image}" alt="${response.name}" class="img-fluid" />
  </div>
  <div class="col-md-8 cart-item-details">
    <h5>${response.name}</h5>
    <p>Price: $${item.price}</p>
    <p>Quantity: ${item.quantity}</p>
    <p>Total: $${item.total}</p>
  </div>
`;

  cartTable.appendChild(productRow);
});

totaltext.innerHTML = `${totalPrice}`;
paymentbtn.innerHTML = `Pay $ ${totalPrice}`;

paymentbtn.addEventListener("click", async (e) => {

  e.preventDefault();
  for (const item of cartItems) {
    const data = {
      id: item.id,
      customer: item.customer,
      product: item.product,
      quantity: item.quantity,
      seller: item.seller,
      total: item.total,
      createdAt: getCurrentTimestamp(),
    };
    await addCart(data);
  }

  localStorage.setItem("cart", JSON.stringify([]));
  await Swal.fire({
    title: "Success",
    text: "Your cart has been Sent",
    icon: "success",
    timer: 3000,
  });
    window.location.href = "../index.html";
});
