import {
  logout,
  addCart,
  getProduct,
  getCustomer,
  updateCustomer,
} from "../../shared/Api.js";
import getCurrentTimestamp from "../js/setTime.js";

document.addEventListener("DOMContentLoaded", async () => {
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

  await loadCartUI(); // ✅ load cart on page load only
});

let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

let totalPrice = 0;
let totalQuantity = 0;
let totaltext = document.querySelector(".total");
let quantitytext = document.querySelector(".quantity");
let itemtext = document.querySelector(".item");
const paymentbtn = document.getElementById("payment");

// ✅ Refactored function to render cart
async function loadCartUI() {
  const cartTable = document.querySelector(".productdetails");
  cartTable.innerHTML = ""; // clear old content

  totalPrice = 0;
  totalQuantity = 0;

  for (let item of cartItems) {
    totalPrice += parseFloat(item.total);
    totalQuantity += item.quantity;
    let product = item.product;

    const response = await getProduct(product);

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
  }

  quantitytext.innerHTML = `Quantity: ${totalQuantity}`;
  itemtext.innerHTML = `Items: ${cartItems.length}`;
  totaltext.innerHTML = `${totalPrice.toFixed(2)}`;
  paymentbtn.innerHTML = `Pay $ ${totalPrice.toFixed(2)}`;
}

paymentbtn.addEventListener("click", async () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    Swal.fire("Error", "User not logged in.");
    return;
  }

  let totalCustomerQuantity = 0;
  let totalCustomerSpent = 0;
  const customer = await getCustomer(currentUser.id);

  await Promise.all(
    cartItems.map((item) => {
      totalCustomerQuantity += item.quantity;
      totalCustomerSpent += parseFloat(item.total);

      const data = {
        id: item.id,
        customer: currentUser.id,
        product: item.product,
        quantity: item.quantity,
        seller: item.seller,
        total: Number(item.total),
        createdAt: getCurrentTimestamp(),
      };
      return addCart(data);
    }),
    await updateCustomer(currentUser.id, {
      numBuys: (customer.numBuys || 0) + totalCustomerQuantity,
      totalSpent: (customer.totalSpent || 0) + totalCustomerSpent,
    }),
    localStorage.setItem("cart", JSON.stringify([])),
    Swal.fire("Success", "Payment complete!", "success").then(() => {
      window.location.href = "../index.html";
    })
  );

  // const failed = results.some((r) => r.status === "rejected");
  // if (failed) {
  //   Swal.fire("Error", "Some items failed to be processed.");
  //   return;
  // }
});
