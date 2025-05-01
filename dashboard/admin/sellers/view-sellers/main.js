import { logout, getProductsToSeller, getSeller, getCategory } from "../../../../shared/Api.js";

window.addEventListener("load", () => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
    localStorage.getItem("isAdmin") !== "true"
  ) {
    window.location.href = "../../index.html";
  }
});

setTimeout(() => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
    localStorage.getItem("isAdmin") !== "true"
  ) {
    window.location.href = "../../index.html";
  }
}, 100);

document.getElementById("logout").addEventListener("click", () => {
  logout();
  window.location.href = "../../index.html";
});

const params = new URLSearchParams(window.location.search);
const sellerid = params.get("id");


async function loadSellerData() {
  try {
    const response = await getSeller(sellerid);
    console.log(response);

    if (response) {
      document.querySelector("#id").innerText = response.id || "N/A";
      document.querySelector("#name").innerText = response.name || "N/A";
      document.querySelector("#email").innerText = response.email || "N/A";
      document.querySelector("#pass").innerText = response.password || "N/A";
      document.querySelector("#total").innerText = `$${
        response.totalRevenue?.toFixed(2) || "0.00"
      }`;
      document.querySelector("#createdat").innerText =
        new Date(response.createdAt).toLocaleString() || "N/A";
      document.querySelector("#numsells").innerText = response.numSells ?? "N/A";
      document.querySelector("#numofproduct").innerText =
        response.products?.length ?? "N/A";

      // Get all products once
      const allProducts = await getProductsToSeller(response.id);
      const productContainer = document.getElementById("product-container");
      const productCount = document.getElementById("product-count");

      for (let product of allProducts) {
        const categoryresponse = await getCategory(product.category);

        const card = document.createElement("div");
        card.className = "card mb-3 shadow-sm border-0 rounded-3";

        card.innerHTML = `
          <div class="row g-0 align-items-center">
            <div class="col-md-4 text-center bg-light p-3 rounded-start">
              <img src="${
                product.image || "https://via.placeholder.com/150"
              }"
                class="img-fluid rounded shadow-sm border" alt="Product Image" style="max-height: 200px; object-fit: contain;">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title fw-bold text-primary mb-3">${
                  product.name
                }</h5>
                <div class="row">
                  <div class="col-sm-6 mb-2"><strong>ID:</strong> ${product.id}</div>
                  <div class="col-sm-6 mb-2"><strong>Category Name:</strong> ${categoryresponse?.name || "N/A"}</div>
                  <div class="col-sm-6 mb-2"><strong>Price:</strong> <span class="text-success">$${
                    product.price
                  }</span></div>
                  <div class="col-sm-6 mb-2"><strong>Discount:</strong> <span class="text-danger">${
                    product.discount
                  }%</span></div>
                  <div class="col-sm-6 mb-2"><strong>Quantity:</strong> ${product.quantity}</div>
                  <div class="col-12 mb-2"><strong>Description:</strong><br><span class="text-muted">${
                    product.description
                  }</span></div>
                  <div class="col-12"><strong>Created At:</strong> ${new Date(
                    product.createdAt
                  ).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        `;

        productContainer.appendChild(card);
      }

      productCount.innerText = allProducts.length;
    } else {
      alert("Seller not found!");
    }
  } catch (err) {
    console.error("Failed to fetch seller:", err);
    alert("An error occurred while fetching Seller data.");
  }
}


loadSellerData();
