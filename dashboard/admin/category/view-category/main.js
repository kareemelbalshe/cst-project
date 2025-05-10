import {
  logout,
  getCategory,
  getProducts,
  deleteProduct,
  deleteCategory,
} from "../../../../shared/Api.js";

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
}, 100);

const logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener("click", () => {
  logout();
  window.location.href = "../../index.html";
});

const params = new URLSearchParams(window.location.search);
const categoryId = params.get("id");

const categoryResponse = await getCategory(categoryId);
let allProducts = await getProducts();

function filterProducts(category = "") {
  return allProducts.filter((product) => {
    const matchCategory = category ? product.category == category : true;
    return matchCategory;
  });
}
const categoryProducts = filterProducts(categoryId);
renderProducts(categoryProducts, categoryResponse);

function renderProducts(products, categoryresponse) {
  const productContainer = document.getElementById("product-container");
  productContainer.innerHTML = "";

  products.forEach((product) => {
    const productHTML = `
        <div class="card mb-4 shadow-sm rounded-4 overflow-hidden">
          <div class="row g-0 align-items-center">
            <div class="col-md-4 text-center bg-light p-3">
              <img src="${product.image || "https://via.placeholder.com/150"}"
                class="img-fluid rounded shadow-sm border" alt="Product Image" style="max-height: 200px; object-fit: contain;">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title fw-bold text-primary mb-3">${
                  product.name
                }</h5>
                <div class="row">
                  <div class="col-sm-6 mb-2"><strong>ID:</strong> ${
                    product.id
                  }</div>
                  <div class="col-sm-6 mb-2"><strong>Category Name:</strong> ${
                    categoryresponse?.name || "N/A"
                  }</div>
                  <div class="col-sm-6 mb-2"><strong>Price:</strong> <span class="text-success">\$${
                    product.price
                  }</span></div>
                  <div class="col-sm-6 mb-2"><strong>Discount:</strong> <span class="text-danger">${
                    product.discount
                  }%</span></div>
                  <div class="col-sm-6 mb-2"><strong>Quantity:</strong> ${
                    product.quantity
                  }</div>
                  <div class="col-12 mb-2"><strong>Description:</strong><br><span class="text-muted">${
                    product.description
                  }</span></div>
                  <div class="col-12"><strong>Created At:</strong> ${new Date(
                    product.createdAt
                  ).toLocaleString()}</div>
                </div>
                <button class="btn btn-danger mt-3" data-id="${product.id}"
                  onclick="handleDeleteProduct(event)">
                  <i class="bi bi-trash"></i> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    productContainer.insertAdjacentHTML("beforeend", productHTML);
  });
}
async function loadCategory() {
  const categoryImage = document.getElementById("categoryImage");
  const categoryName = document.getElementById("categoryName");
  const categoryCreatedAt = document.getElementById("categoryCreatedAt");

  categoryImage.src = categoryResponse.image;
  categoryName.textContent = categoryResponse.name;
  categoryCreatedAt.textContent = `Created At: ${new Date(
    categoryResponse.createdAt
  ).toLocaleDateString()}`;
}

loadCategory();

window.handleDeleteProduct = async function (event) {
   Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const productId = event.target.getAttribute("data-id");

      console.log(productId);
      await deleteProduct(productId);
      Swal.fire("Deleted!", "The product has been deleted.", "success").then(
        () => {
          location.reload();
        }
      );
    }
  });
};

const deleteThis = document.getElementById("deleteThis");
deleteThis.addEventListener("click", async () => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This will delete the category and all its products!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    for (const product of categoryProducts) {
      await deleteProduct(product.id);
    }
    await deleteCategory(categoryId);
    window.location.href = "../index.html";

  }
});
