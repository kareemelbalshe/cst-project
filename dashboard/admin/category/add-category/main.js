import { logout } from "../../../../shared/Api.js";
import { addCategory } from "../../../../shared/Api.js";
import getCurrentTimestamp from "../../../../shared/setTime.js";
import { resizeImage } from "../../../../shared/resizeImage.js";
import createId from "../../../../shared/createId.js";

window.addEventListener("load", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!isLoggedIn || !isAdmin) {
    window.location.href = "../../index.html";
    return;
  }
});

const logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener("click", () => {
  logout();
  window.location.href = "../../index.html";
});

const addCategoryForm = document.querySelector("form");

addCategoryForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const categoryName = document.getElementById("categoryName").value;
  const imageInput = document.getElementById("categoryImage");
  const imageFile = imageInput.files[0];

  if (!imageFile) {
    alert("Please select an image!");
    return;
  }

  const baseimage = await resizeImage(imageFile);
  const data = {
    id: createId(),
    name: categoryName,
    image: baseimage,
    createdAt: getCurrentTimestamp(),
  };

 await addCategory(data);

  window.location.href = "../index.html";
});
