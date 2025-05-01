import { deleteCart, getCart, getCartsToSeller, logout } from "../../../shared/Api.js";
import { renderDataTable } from "../../js/tableCart.js";

window.addEventListener("load", () => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
    localStorage.getItem("isSeller") !== "true"
  ) {
    window.location.href = "../../index.html";
  }
});

setTimeout(() => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
    localStorage.getItem("isSeller") !== "true"
  ) {
    window.location.href = "../../index.html";
  }
}, 100);

const logoutBtn = document.getElementById("logout");

logoutBtn.addEventListener("click", () => {
  logout();
  window.location.href = "../../index.html";
});

const ordersToSeller = await getCartsToSeller(localStorage.getItem("Id"));

const enrichedOrder = await Promise.all(
    ordersToSeller.map(async (cart) => {
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
  data: enrichedOrder,
  onDelete: async (id) => {
    await deleteCart(id);
  },
  viewUrl: "./view-order/index.html",
});