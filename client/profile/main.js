import { logout, getCustomer, updateCustomer } from "../../shared/Api.js";
import { resizeImage } from "../js/resizeImage.js"

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const headerActions = document.getElementById("header-actions");

  if (!headerActions) return;

  if (currentUser) {
    const logoutBtn = document.createElement("button");
    logoutBtn.className = "btn btn-outline-dark";
    logoutBtn.innerHTML = 'Logout <i class="bi bi-box-arrow-left"></i>';
    logoutBtn.addEventListener("click", () => {
      logout();
      window.location.href = "../index.html";
    });

    headerActions.innerHTML = "";

    const profileLink = document.createElement("a");
    profileLink.className = "btn btn-outline-dark me-2";
    profileLink.href = "index.html";
    profileLink.innerHTML = `<i class="bi bi-person-circle me-1"></i> ${currentUser.name}`;
    headerActions.appendChild(profileLink);

    const cartLink = document.createElement("a");
    cartLink.className = "btn btn-outline-dark me-2";
    cartLink.href = "../cart/index.html";
    cartLink.innerHTML = '<i class="bi bi-cart4"></i>';

    headerActions.appendChild(logoutBtn);
    headerActions.appendChild(cartLink);
  }
});

const profileForm = document.querySelector("form");
const nameInput = document.getElementById("profilename");
const emailInput = document.getElementById("profileemail");
const addressInput = document.getElementById("profileaddress");
const phoneInput = document.getElementById("profilephone");
const totalAmountSpent = document.getElementById("totalAmountSpent");
const totalProductsBought = document.getElementById("totalProductsBought");
const profileImageInput = document.getElementById("profileImage");
const profileImagePreview = document.getElementById("profileImagePreview");

// Load customer data
async function loadCustomerData() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    alert("You must be logged in to view your profile.");
    window.location.href = "../login/index.html";
    return;
  }

  try {
    const customer = await getCustomer(currentUser.id);

    if (customer) {
      nameInput.value = customer.name || "";
      emailInput.value = customer.email || "";
      addressInput.value = customer.address || "";
      phoneInput.value = customer.phone || "";
      totalAmountSpent.innerText = `$${(customer.totalSpent || 0).toFixed(2)}`;
      totalProductsBought.innerText = customer.numBuys || 0;

      // Optionally display the current image (base64 or URL)
      if (customer.image) {
        profileImagePreview.src = customer.image; // Show the current profile image
      }
    }
  } catch (error) {
    console.error("Error loading customer data:", error);
    alert("Failed to load profile data. Please try again.");
  }
}

profileForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    alert("You must be logged in to update your profile.");
    window.location.href = "../login/index.html";
    return;
  }

  try {
    // If an image is selected, resize it and convert to base64
    let imageBase64 = null;
    if (profileImageInput.files && profileImageInput.files[0]) {
      const file = profileImageInput.files[0];
      imageBase64 = await resizeImage(file); 
    }

    const updatedCustomerData = {
      name: nameInput.value,
      email: emailInput.value,
      address: addressInput.value,
      phone: phoneInput.value,
      image: imageBase64, 
    };

    const updatedCustomer = await updateCustomer(currentUser.id, updatedCustomerData);

    if (updatedCustomer) {
      alert("Profile updated successfully!");
    } else {
      alert("Something went wrong. Please try again.");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Failed to update profile. Please try again.");
  }
});

// Event listener for profile image preview
profileImageInput.addEventListener("change", function () {
  if (this.files && this.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      profileImagePreview.src = e.target.result; // Preview the selected image
    };

    reader.readAsDataURL(this.files[0]);
  }
});

document.addEventListener("DOMContentLoaded", loadCustomerData);
