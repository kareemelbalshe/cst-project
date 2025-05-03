import {
  deleteCart,
  getCart,
  getSeller,
  logout,
} from "../../../../shared/Api.js";

window.addEventListener("load", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!isLoggedIn || !isAdmin) {
    window.location.href = "../../../index.html";
    return;
  }
});

setTimeout(() => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
    localStorage.getItem("isAdmin") !== "true"
  ) {
    window.location.href = "../../../index.html";
  }
}, 1000);

const logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener("click", () => {
  logout();
  window.location.href = "../../../index.html";
});

const urlParams = new URLSearchParams(window.location.search);
const cartId = urlParams.get("id");

if (cartId) {
  getCart(cartId).then(async ({ data, product, customer }) => {
    const seller = await getSeller(product.seller);
    document.getElementById("cartId").textContent = data.id;
    document.getElementById("customerName").textContent = customer.name;
    document.getElementById("customerEmail").textContent = customer.email;
    document.getElementById("sellerName").textContent = seller.name;
    document.getElementById("sellerEmail").textContent = seller.email;
    document.getElementById("createdAt").textContent = new Date(
      customer.createdAt
    ).toLocaleString();

    const container = document.getElementById("cartItemsContainer");
    container.innerHTML = "";

    const card = document.createElement("div");
    card.className = "col";
    card.innerHTML = `
      <div class="card h-100 shadow-sm p-3">
        <img src="${product.image}" class="card-img-top" alt="${product.name}" />
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">Price: $${product.price}</p>
          <p class="card-text">Quantity: ${data.quantity}</p>
          <p class="card-text">Total: $${data.total}</p>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

const deleteThis = document.getElementById("deleteThis");
deleteThis.addEventListener("click", async () => {
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
      if (cartId) {
        try {
          await deleteCart(cartId);
          window.location.href = "../index.html";
        } catch (err) {
          console.error("Failed to delete cart:", err);
        }
      } else {
      }
    }
  });
});
