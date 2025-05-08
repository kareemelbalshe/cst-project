import { getProduct } from "../../shared/Api.js";
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
  let carts = JSON.parse(localStorage.getItem("cart")) || [];

  const productIndex = carts.findIndex((cart) => cart.product === productId);

  if (stock <= 0) {
    Swal.fire({
      title: "Error",
      text: "Out of stock",
      icon: "error",
    });
    return;
  }

  if (quantity <= 0) {
    Swal.fire({
      title: "Error",
      text: "Quantity must be greater than 0",
      icon: "error",
    });
    return;
  }

  if ((carts[productIndex]?.quantity + quantity) > stock) {
    Swal.fire({
      title: "Error",
      text: "Quantity exceeds available stock",
      icon: "error",
    });
    return;
  }

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
  Swal.fire({
    title: "Success",
    text: "Product added to cart",
    icon: "success",
  });
}
