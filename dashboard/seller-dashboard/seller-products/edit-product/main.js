import {
  getCategories,
  getProduct,
  logout,
  updateProduct,
} from "../../../../shared/Api.js";
import { resizeImage } from "../../../js/resizeImage.js";

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const product = await getProduct(productId);

window.addEventListener("load", async () => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
    localStorage.getItem("isSeller") !== "true"
  ) {
    window.location.href = "../../../index.html";
    return;
  }
});

async function populateForm() {
  if (!productId) return;

  try {
    document.getElementById("name").value = product.name;
    document.getElementById("price").value = product.price;
    document.getElementById("description").value = product.description;
    document.getElementById("quantity").value = product.quantity;
    document.getElementById("discount").value = product.discount;
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

const toastLiveExample = document.getElementById("liveToast");
const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
const toastTitle = document.getElementById("toastTitle");
const toastBody = document.getElementById("toastBody");

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const price = parseFloat(document.getElementById("price").value);
  const description = document.getElementById("description").value.trim();
  const quantity = parseFloat(document.getElementById("quantity").value);
  const category = document.getElementById("category").value;
  const discount = parseFloat(document.getElementById("discount").value) || 0;
  const imageInput = document.getElementById("image");
  const file = imageInput.files[0];

  let imageUrl = document.getElementById("imagePreview").src;

  if (!name) {
    toastTitle.innerHTML = "Error";
    toastBody.innerHTML = "Please enter a product name.";
    toastBootstrap.show();
    return;
  }
  if (!price || isNaN(price) || price <= 0) {
    toastTitle.innerHTML = "Error";
    toastBody.innerHTML = "Please enter a valid price.";
    toastBootstrap.show();
    return;
  }
  if (!description) {
    toastTitle.innerHTML = "Error";
    toastBody.innerHTML = "Please enter a product description.";
    toastBootstrap.show();
    return;
  }
  if (isNaN(quantity) || quantity < 0) {
    toastTitle.innerHTML = "Error";
    toastBody.innerHTML = "Please enter a valid quantity.";
    toastBootstrap.show();
    return;
  }
  if (!category) {
    toastTitle.innerHTML = "Error";
    toastBody.innerHTML = "Please select a category.";
    toastBootstrap.show();
    return;
  }
  if (isNaN(discount) || discount < 0) {
    toastTitle.innerHTML = "Error";
    toastBody.innerHTML = "Please enter a valid discount.";
    toastBootstrap.show();
    return;
  }
  if (file) {
    imageUrl = await resizeImage(file);
  }

  const productData = {
    name,
    price,
    description,
    category,
    discount,
    quantity,
    price_after_discount: price - (price * discount) / 100,
    image: imageUrl,
  };

  await updateProduct(productId, productData);

  window.location.href = "../index.html";
});
