import { addProduct, getCategories, logout } from "../../../../shared/Api.js";
import createId from "../../../js/createId.js";
import { resizeImage } from "../../../js/resizeImage.js";
import getCurrentTimestamp from "../../../js/setTime.js";

window.addEventListener("load", async () => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
    localStorage.getItem("isSeller") !== "true"
  ) {
    window.location.href = "../../../index.html";
  }

  setTimeout(() => {
    if (
      localStorage.getItem("isLoggedIn") !== "true" ||
      localStorage.getItem("isSeller") !== "true"
    ) {
      window.location.href = "../../../index.html";
    }
  }, 100);

  const categories = await getCategories();
  const categorySelect = document.getElementById("category");
  categorySelect.innerHTML = `<option value="">Select a category</option>`;
  categories.forEach((category) => {
    categorySelect.innerHTML += `<option value="${category.id}">${category.name}</option>`;
  });
});

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
  const imageFile = imageInput.files[0];

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
    toastBody.innerHTML = "Please enter a description.";
    toastBootstrap.show();
    return;
  }
  if (!quantity || isNaN(quantity) || quantity < 0) {
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
  if (!discount || isNaN(discount) || discount < 0) {
    toastTitle.innerHTML = "Error";
    toastBody.innerHTML = "Please enter a valid discount.";
    toastBootstrap.show();
    return;
  }
  if (!imageFile) {
    toastTitle.innerHTML = "Error";
    toastBody.innerHTML = "Please select an image.";
    toastBootstrap.show();
    return;
  }
  const base64String = await resizeImage(imageFile);

  const productData = {
    id: createId(),
    name,
    price,
    description,
    category,
    discount,
    quantity,
    seller: localStorage.getItem("Id"),
    price_after_discount: price - (price * discount) / 100,
    image: base64String,
    sales: 0,
    rating: 0,
    totalStars: 0,
    totalRatings: 0,
    reviewIds: [],
    createdAt: getCurrentTimestamp(),
  };

  await addProduct(productData);

  window.location.href = "../index.html";
});
