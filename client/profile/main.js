import { logout, getCustomer, updateCustomer } from "../../shared/Api.js";
import { resizeImage } from "../js/resizeImage.js";

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

    const profileLink = document.createElement("a");
    profileLink.className = "btn btn-outline-dark me-2";
    profileLink.href = "index.html";
    profileLink.innerHTML = `<i class="bi bi-person-circle me-1"></i> ${currentUser.name}`;

    const cartLink = document.createElement("a");
    cartLink.className = "btn btn-outline-dark me-2";
    cartLink.href = "../cart/index.html";
    cartLink.innerHTML = '<i class="bi bi-cart4"></i>';

    headerActions.innerHTML = "";
    headerActions.append(profileLink, logoutBtn, cartLink);
  }

  loadCustomerData();
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

const toastLive = document.getElementById("liveToast");
const toastBootstrap = new bootstrap.Toast(toastLive);
const toastTitle = document.getElementById("toastTitle");
const toastBody = document.getElementById("toastBody");

async function loadCustomerData() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    showToast("Error", "You must be logged in to view your profile.");
    setTimeout(() => (window.location.href = "../login/index.html"), 1500);
    return;
  }

  try {
    const customer = await getCustomer(currentUser.id);

    if (customer) {
      nameInput.value = customer.name ?? "";
      emailInput.value = customer.email ?? "";
      addressInput.value = customer.address ?? "";
      phoneInput.value = customer.phone ?? "";
      totalAmountSpent.innerText = `$${(customer.totalSpent ?? 0).toFixed(2)}`;
      totalProductsBought.innerText = customer.numBuys ?? 0;
      if (customer.image) profileImagePreview.src = customer.image;
    }
  } catch (error) {
    console.error("Error loading customer data:", error);
    showToast("Error", "Failed to load profile data. Please try again.");
  }
}

profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    showToast("Error", "You must be logged in to update your profile.");
    setTimeout(() => (window.location.href = "../login/index.html"), 1500);
    return;
  }

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const address = addressInput.value.trim();
  const phone = phoneInput.value.trim();

  if (!name || !email || !address || !phone) {
    showToast("Validation Error", "All fields are required.");
    return;
  }

  if (!email.includes("@") || !email.endsWith(".com")) {
    showToast("Validation Error", "Please enter a valid email (must contain @ and end with .com).");
    return;
  }

  const validPrefixes = ["010", "011", "012", "015"];
  if (phone.length !== 11 || !validPrefixes.some((p) => phone.startsWith(p))) {
    showToast("Validation Error", "Phone number must start with 010, 011, 012, or 015 and be 11 digits long.");
    return;
  }

  let imageBase64 = null;
  const imageFile = profileImageInput.files?.[0];
  if (imageFile) {
    imageBase64 = await resizeImage(imageFile);
  }

  const updatedCustomerData = {
    name,
    email,
    address,
    phone,
    ...(imageBase64 && { image: imageBase64 }),
  };

  try {
    const updatedCustomer = await updateCustomer(currentUser.id, updatedCustomerData);

    if (updatedCustomer) {
      showToast("Success", "Profile updated successfully!");
    } else {
      showToast("Error", "Something went wrong. Please try again.");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    showToast("Error", "Failed to update profile. Please try again.");
  }
});

profileImageInput.addEventListener("change", function () {
  if (this.files?.[0]) {
    const reader = new FileReader();
    reader.onload = (e) => (profileImagePreview.src = e.target.result);
    reader.readAsDataURL(this.files[0]);
  }
});

const resetPasswordForm = document.getElementById("resetPasswordForm");
resetPasswordForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    showToast("Error", "You must be logged in to reset your password.");
    return;
  }

  const newPassword = document.getElementById("newPassword").value;
  const confirmNewPassword = document.getElementById("confirmNewPassword").value;

  if (newPassword.length < 6) {
    showToast("Validation Error", "Password must be at least 6 characters long.");
    return;
  }

  if (newPassword !== confirmNewPassword) {
    showToast("Validation Error", "Passwords do not match.");
    return;
  }

  try {
    const updatedCustomer = await updateCustomer(currentUser.id, { password: newPassword });

    if (updatedCustomer) {
      showToast("Success", "Password updated successfully!");

      const resetPasswordModal = bootstrap.Modal.getInstance(document.getElementById("resetPasswordModal"));
      resetPasswordModal.hide();
      resetPasswordForm.reset();
    } else {
      showToast("Error", "Failed to update password. Please try again.");
    }
  } catch (error) {
    console.error("Error updating password:", error);
    showToast("Error", "Failed to update password. Please try again.");
  }
});

function showToast(title, message) {
  toastTitle.innerHTML = title;
  toastBody.innerHTML = message;
  toastBootstrap.show();
}
