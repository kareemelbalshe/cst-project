import { logout, getProduct } from "../../../../shared/Api.js";

window.addEventListener("load", async () => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" &&
    localStorage.getItem("isAdmin") !== "true"
  ) {
    window.location.href = "../../../index.html";
  } else {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    
    try {
      const product = await getProduct(productId);
      console.log(product);
      
      if (product) {
        document.querySelector(".productId").innerText = product.id || "N/A";
        document.querySelector(".productName").innerText = product.name || "N/A";
        document.querySelector(".price").innerText = `$${product.price?.toFixed(2) || "0.00"}`;
        document.querySelector(".discount").innerText = `${product.discount || "0"}%`;
        document.querySelector(".category").innerText = product.category || "N/A";
        document.querySelector(".quantity").innerText = product.quantity || "0";
        document.querySelector(".seller").innerText = product.seller || "N/A";
        document.querySelector(".description").innerText = product.description || "N/A";
        document.querySelector(".createdAt").innerText = 
          new Date(product.createdAt).toLocaleString() || "N/A";
        
        const productImage = document.getElementById("productImage");
        if (product.image) {
          productImage.src = product.image;
        } else {
          productImage.src = "../../../../assets/placeholder.png";
          productImage.alt = "No image available";
        }
      } else {
        alert("Product not found!");
      }
    } catch (err) {
      console.error("Failed to fetch product:", err);
      alert("An error occurred while fetching product data.");
    }
  }
});

setTimeout(() => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" &&
    localStorage.getItem("isAdmin") !== "true"
  ) {
    window.location.href = "../../../index.html";
  }
}, 100);

const logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener("click", () => {
  logout();
  window.location.href = "../../../index.html";
});