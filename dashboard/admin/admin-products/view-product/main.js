import {
  logout,
  getProduct,
  getSeller,
  getCategory,
  deleteProduct,
} from "../../../../shared/Api.js";

window.addEventListener("load", async () => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
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
        document.querySelector(".productName").innerText =
          product.name || "N/A";
        document.querySelector(".price").innerText = `$${
          product.price?.toFixed(2) || "0.00"
        }`;
        document.querySelector(".discount").innerText = `${
          product.discount || "0"
        }%`;
        document.querySelector(".quantity").innerText = product.quantity || "0";
        document.querySelector(".description").innerText =
          product.description || "N/A";
        document.querySelector(".createdAt").innerText =
          new Date(product.createdAt).toLocaleString() || "N/A";

        const productImage = document.getElementById("productImage");
        if (product.image) {
          productImage.src = product.image;
        } else {
          productImage.src = "../../../../assets/placeholder.png";
          productImage.alt = "No image available";
        }

        try {
          const seller = await getSeller(product.seller);
          document.querySelector(".seller").innerText =
            seller.name || product.seller;
        } catch (sellerErr) {
          console.error("Failed to fetch seller:", sellerErr);
          document.querySelector(".seller").innerText = product.seller || "N/A";
        }

        try {
          const category = await getCategory(product.category);
          document.querySelector(".category").innerText =
            category.name || product.category;
        } catch (categoryErr) {
          console.error("Failed to fetch category:", categoryErr);
          document.querySelector(".category").innerText =
            product.category || "N/A";
        }
      } else {
        alert("Product not found!");
      }
    } catch (err) {
      console.error("Failed to fetch product:", err);
    }
  }
});

setTimeout(() => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
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
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      await deleteProduct(id);
      window.location.href = "../index.html";
    }
  });
});
