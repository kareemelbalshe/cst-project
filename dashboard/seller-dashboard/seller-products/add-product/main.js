import { addProduct, getCategories, logout } from "../../../../shared/Api.js";
import createId from "../../../../shared/createId.js";
import { resizeImage } from "../../../../shared/resizeImage.js";
import getCurrentTimestamp from "../../../../shared/setTime.js";

window.addEventListener("load", async () => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
    localStorage.getItem("isSeller") !== "true"
  ) {
    window.location.href = "../../../index.html";
  }

  const logoutBtn = document.getElementById("logout");
  logoutBtn.addEventListener("click", () => {
    logout();
    window.location.href = "../../../index.html";
  });

  const categories = await getCategories();
  const categorySelect = document.getElementById("category");
  categorySelect.innerHTML = `<option value="">Select a category</option>`;
  categories.forEach((category) => {
    categorySelect.innerHTML += `<option value="${category.id}">${category.name}</option>`;
  });
});

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const price = parseFloat(document.getElementById("price").value);
  const description = document.getElementById("description").value.trim();
  const category = document.getElementById("category").value;
  const discount = parseFloat(document.getElementById("discount").value) || 0;
  const imageInput = document.getElementById("image");
  const imageFile = imageInput.files[0];

  if (name && price && description && category && imageFile) {
    const base64String = await resizeImage(imageFile);


      const productData = {
        id: createId(),
        name,
        price,
        description,
        category,
        discount,
        seller: localStorage.getItem("Id"),
        price_after_discount: price - (price * discount) / 100,
        image: base64String,
        createdAt: getCurrentTimestamp(),
      };

      const res = await addProduct(productData);
      if (res) {
        alert("Product added successfully");
        window.location.href = "../index.html";
      }
    };

});
