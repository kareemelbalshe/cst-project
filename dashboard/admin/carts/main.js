import { getCarts, getCart, deleteCart, logout } from "../../../shared/Api.js";
import { renderDataTable } from "../../js/tableCart.js";

window.addEventListener("load", () => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
    localStorage.getItem("isAdmin") !== "true"
  ) {
    window.location.href = "../index.html";
  }
});
setTimeout(() => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
    localStorage.getItem("isAdmin") !== "true"
  ) {
    window.location.href = "../index.html";
  }
}, 1000);

const logoutBtn = document.getElementById("logout");

logoutBtn.addEventListener("click", () => {
  logout();
  window.location.href = "../../index.html";
});
const page = document.getElementById("page");

async function loadCarts() {
  page.innerHTML = "";

  const carts = await getCarts();

  const enrichedCarts = await Promise.all(
    carts.map(async (cart) => {
      const { data, product, customer } = await getCart(cart.id);
      return {
        id: data.id,
        total: parseFloat(data.total).toFixed(2),
        createdAt: data.createdAt,
        product: product?.name,
        customer: customer?.name,
      };
    })
  );

  renderDataTable({
    containerId: "page",
    data: enrichedCarts,
    onDelete: async (id) => {
      await deleteCart(id);
    },
    viewUrl: "./view-cart/index.html",
  });
}

loadCarts();
