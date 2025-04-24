import { resizeImage } from "../../../../shared/resizeImage.js";

import { getCategory, updateCategory } from "../../../../shared/Api.js";

const params = new URLSearchParams(window.location.search);
const categoryId = params.get('id');
async function populateForm() {
    if (!categoryId) return;

    try {
        const category = await getCategory(categoryId);

        document.getElementById("categoryName").value = category.name;

        const imagePreview = document.getElementById("imagePreview");
        imagePreview.src = category.image;
        imagePreview.style.display = "block";
    } catch (error) {
        console.error("Failed to load category:", error);
    }
}

populateForm();

const form = document.getElementById("addCategoryForm");
form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("categoryName").value.trim();
    const imageInput = document.getElementById("categoryImage");
    const file = imageInput.files[0];

    let imageUrl = document.getElementById("imagePreview").src;

    if (file) {
        imageUrl = await resizeImage(file);
    }

    const updatedCategory = {
        name,
        image: imageUrl,
    };

    await updateCategory(categoryId, updatedCategory);
    // alert("Category updated successfully!");
    window.location.href = "../index.html";

});

