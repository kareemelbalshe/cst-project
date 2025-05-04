import { getProduct, getSeller } from "../../shared/Api.js";
import createId from "./createId.js";
import getCurrentTimestamp from "./setTime.js";

export async function addToCart(
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
    let carts = JSON.parse(localStorage.getItem("cart")) || [];
  
    const productIndex = carts.findIndex((cart) => cart.product === productId);
  
    if (productIndex !== -1) {
      carts[productIndex].quantity += quantity;
      carts[productIndex].total =
        carts[productIndex].quantity * price_after_discount;
    } else {
      const product = await getProduct(productId);
      const newCart = {
        id: createId(),
        customer: localStorage.getItem("Id"),
        product: productId,
        quantity: quantity,
        name: name,
        price: price,
        stock: stock,
        seller: product.seller,
        price_after_discount: price_after_discount,
        total: price_after_discount * quantity,
        createdAt: getCurrentTimestamp(),
      };
      carts.push(newCart);
    }
  
    localStorage.setItem("cart", JSON.stringify(carts));
  }