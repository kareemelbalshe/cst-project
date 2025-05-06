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
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      Swal.fire({
        title: "Error",
        text: "Please login first to add items to cart",
        icon: "error"
      });
      window.location.href = "../login/index.html";
      return;
    }

    if (stock <= 0) {
      Swal.fire({
        title: "Error",
        text: "Out of stock",
        icon: "error"
      });
      return;
    }
    if (quantity > stock) {
      Swal.fire({
        title: "Error",
        text: "Quantity exceeds available stock",
        icon: "error"
      });
      return;
    }
    if (quantity <= 0) {
      Swal.fire({
        title: "Error",
        text: "Quantity must be greater than 0",
        icon: "error"
      });
      return;
    }

    const cartKey = `cart_${currentUser.id}`;
    let carts = JSON.parse(localStorage.getItem(cartKey)) || [];
  
    const productIndex = carts.findIndex((cart) => cart.product === productId);
  
    if (productIndex !== -1) {
      carts[productIndex].quantity += quantity;
      carts[productIndex].total =
        carts[productIndex].quantity * price_after_discount;
    } else {
      const product = await getProduct(productId);
      const newCart = {
        id: createId(),
        customer: currentUser.id,
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
  
    localStorage.setItem(cartKey, JSON.stringify(carts));
    Swal.fire({
      title: "Success",
      text: "Product added to cart",
      icon: "success",
    });
  } 