import { logout } from "../../../../shared/Api.js";
import { addCategory } from "../../../../shared/Api.js";
import { getCurrentTimestamp } from "../../../../shared/setTime.js";

window.addEventListener("load", () => {
    if (localStorage.getItem("isLoggedIn") !== "true" && localStorage.getItem("isAdmin") !== "true") {
        window.location.href = "../index.html";
    }
});

const addCategoryForm = document.getElementById("addCategoryForm");

addCategoryForm.addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const categoryName = document.getElementById("categoryName").value;
    const imageInput = document.getElementById("categoryImage");
    const imageFile = imageInput.files[0];
  
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });
  
    try {
      const imageBase64 = await toBase64(imageFile);
  
      const data = {
        name: categoryName,
        image: imageBase64,
        createdAt: getCurrentTimestamp(),
      };
  
      const result = await addCategory(data); 
  
      if (result.success || result.message === "Category added successfully") {
        alert("Category added successfully!");
        // window.location.href = "../index.html";
      } else {
        alert("Failed to add category: " + (result.message || "Please try again."));
        console.error("Failed:", result);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong while adding category.");
    }
  });
  
  



const logoutBtn = document.getElementById("logout");

logoutBtn.addEventListener("click", () => {
    logout();
    window.location.href = "../../index.html";
});