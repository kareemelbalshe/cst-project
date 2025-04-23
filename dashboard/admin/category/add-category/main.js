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

    const addCategoryForm = document.querySelector("form");
    const logoutBtn = document.getElementById("logout");

    addCategoryForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const categoryName = document.getElementById("categoryName").value;
        const imageInput = document.getElementById("categoryImage");
        const imageFile = imageInput.files[0];

        if (!imageFile) {
            alert("Please select an image!");
            return;
        }

        try {
            const baseimage = await resizeImage(imageFile);
            const data = {
                id: createId(),
                name: categoryName,
                image: baseimage,
                createdAt: getCurrentTimestamp(),
            };

            const result = await addCategory(data);
            // alert(JSON.stringify(result, null, 2));
            const goToCategoryBtn = document.getElementById("goToCategory");

            if (result) {
                alert("Category added successfully!");
                goToCategoryBtn.classList.remove("d-none");
            
                goToCategoryBtn.addEventListener("click", () => {
                    window.location.href = "../../category/index.html";
                })}
            // if (result.success || result.message?.includes("successfully")) {
            //     alert("Category added successfully!");
            //     window.location.href = "../index.html"; 
            // } else {
            //     alert("Failed to add category: " + (result.message || "Unknown error"));
            // }

            addCategoryForm.reset();
        } catch (error) {
            console.error("Error:", error);
            alert("Error: " + error.message);
        }
    });

    logoutBtn.addEventListener("click", () => {
        logout();
        window.location.href = "../../index.html";
    });
});
