import { getCarts, getCart, deleteCart } from "../../../shared/Api.js";
import {renderDataTable} from "../../js/tableCart.js"

const page = document.getElementById("page");
const tableContainerId = "categoriesTable"; 

async function loadCarts() {
  page.innerHTML = ""; 

    const carts = await getCarts();

    const enrichedCarts = await Promise.all(
      carts.map(async (cart) => {
        const { data, product, customer } = await getCart(cart.id);
        return {
          id: data.id,
          total: data.total,
          createdAt: data.createdAt,
          productName: product?.name,
          customerName: customer?.name,
        };
      })
    );

    renderDataTable({
      containerId: tableContainerId,
      data: enrichedCarts,
      onDelete: async (id) => {
        await deleteCart(id);
        loadCarts(); 
      },
      viewUrl: "./view-cart/index.html",
      itemsPerPage: 7,
    });
}

loadCarts();
