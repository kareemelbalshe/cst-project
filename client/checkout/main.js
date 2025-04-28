import { logout } from "../../shared/Api.js";
import { addCart } from "../../shared/Api.js";
import { getProduct } from "../../shared/Api.js";
import getCurrentTimestamp from "../js/setTime.js"

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
  let id = item.id;
  let customer = item.customer;
  let quantity = item.quantity;
  let product = item.product;
  let total = item.total;
  let createdAt = getCurrentTimestamp();
  let data = {
    id,
    customer,
    product,
    quantity,
    total,
    createdAt
  };
  const response = await getProduct(product);
  const image = document.getElementById("imagepath");
  const productName = document.getElementById("Productname");
  const productqty = document.getElementById("productqty");
  // image.src=`${response.image}`;
  // productName.innerText=`Name: ${response.name}`;
  // productqty.innerText=`Qty ${item.quantity}`;

  const cartTable = document.querySelector(".productdetails");
  const productRow = document.createElement('div');
  productRow.classList.add('row', 'cart-item','d-flex', 'mb-3','justify-content-between','align-content-between');

  productRow.innerHTML = `
    <div class="col-6 cart-item-image d-flex justify-content-between align-content-between">  
      <img src="${response.image}" alt="${response.name}" class="img-fluid"/>
    </div>
    <div class="col-6 cart-item-details">
      <h5>${response.name}</h5>
      <p>Price: $${item.price}</p>
      <p>Quantity: ${item.quantity}</p>
      <p>Total: $${item.total}</p>
    </div>

  `;

  cartTable.appendChild(productRow);




  console.log(response);
  console.log(data);

});
totaltext.innerHTML = `${totalPrice}`;
paymentbtn.innerHTML = `Pay $ ${totalPrice}`;

paymentbtn.addEventListener("click", () => {
  cartItems.forEach(async (item) => {
    let id = item.id;
    let customer = item.customer;
    let quantity = item.quantity;
    let product = item.product;
    let total = item.total;
    let createdAt = getCurrentTimestamp();
    let data = {
      id,
      customer,
      product,
      quantity,
      total,
      createdAt
    };
    console.log(data);
    await addCart(data);
  });
  localStorage.removeItem("cart");
  window.location.href = "../index.html";
})


