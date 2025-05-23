import {
  deleteProduct,
  getCategories,
  getProduct,
  getReview,
  logout,
} from "../../../../shared/Api.js";

window.addEventListener("load", async () => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
    localStorage.getItem("isSeller") !== "true"
  ) {
    window.location.href = "../../../index.html";
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  const product = await getProduct(productId);
  async function populateForm() {
    if (!productId) return;

    try {
      document.getElementById("name").value = product.name;
      document.getElementById("price").value = product.price;
      document.getElementById("description").value = product.description;
      document.getElementById("quantity").value = product.quantity;
      document.getElementById("discount").value = product.discount;
      document.getElementById("sales").innerHTML = `Sales: ${product.sales}`;
      document.getElementById("rating").innerHTML = `Rating: ${product.rating}`;
      document.getElementById(
        "totalRatings"
      ).innerHTML = `Reviews: (${product.totalRatings})`;

      product.reviewIds.forEach(async (reviewId) => {
        const review = await getReview(reviewId);
        document.getElementById("reviews").innerHTML += `
          <div class="card shadow-sm border-0 rounded-4 p-3 mb-4 bg-light">
  <div class="card-body">
    <div class="d-flex justify-content-between align-items-center mb-2">
    <p class="card-text text-dark mb-2">${review.data.comment}</p>
      <small class="text-muted">${new Date(
        review.data.createdAt
      ).toLocaleDateString()}</small>
    </div>


    <div class="d-flex align-items-center">
      <div>
        ${"<i class='bi bi-star-fill text-warning'></i>".repeat(
          review.data.stars
        )}
        ${"<i class='bi bi-star text-muted'></i>".repeat(5 - review.data.stars)}
      </div>
      <span class="ms-2 text-muted">(${review.data.stars} / 5)</span>
    </div>
    <div class="text-end">by
      <small class="text-primary mt-2 fw-bold">
         ${review.customer.name}
      </small>
  </div>
</div>
        `;
      });

      const imagePreview = document.getElementById("imagePreview");
      imagePreview.src = product.image;
      imagePreview.style.display = "block";
      const categories = await getCategories();
      const categorySelect = document.getElementById("category");
      categorySelect.innerHTML = `<option value="">Select a category</option>`;
      categories.forEach((category) => {
        const selected = category.id === product.category ? "selected" : "";
        categorySelect.innerHTML += `<option value="${category.id}" ${selected}>${category.name}</option>`;
      });
    } catch (error) {
      console.error("Failed to load product:", error);
    }
  }

  populateForm();
});

setTimeout(() => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
    localStorage.getItem("isSeller") !== "true"
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
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const params = new URLSearchParams(window.location.search);
      const productId = params.get("id");
      await deleteProduct(productId);
      window.location.href = "../index.html";
    }
  });
});
