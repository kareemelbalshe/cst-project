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

const toastLive = document.getElementById("liveToast");
const toastBootstrap = new bootstrap.Toast(toastLive);
const toastTitle = document.getElementById("toastTitle");
const toastBody = document.getElementById("toastBody");

async function loadCustomerData() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    toastTitle.innerHTML = "Error";
    toastBody.innerHTML = "You must be logged in to view your profile.";
    toastBootstrap.show();
    setTimeout(() => {
      window.location.href = "../login/index.html";
    }, 1500);
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

      if (customer.image) {
        profileImagePreview.src = customer.image;
      }
    }
  } catch (error) {
    console.error("Error loading customer data:", error);
    toastTitle.innerHTML = "Error";
    toastBody.innerHTML = "Failed to load profile data. Please try again.";
    toastBootstrap.show();
  }
}

profileForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    toastTitle.innerHTML = "Error";
    toastBody.innerHTML = "You must be logged in to update your profile.";
    toastBootstrap.show();
    setTimeout(() => {
      window.location.href = "../login/index.html";
    }, 1500);
    return;
  }

  try {
    if (
      !nameInput.value.trim() ||
      !emailInput.value.trim() ||
      !addressInput.value.trim() ||
      !phoneInput.value.trim()
    ) {
      toastTitle.innerHTML = "Validation Error";
      toastBody.innerHTML = "All fields are required.";
      toastBootstrap.show();
      return;
    }

    const emailValue = emailInput.value.trim();
    if (!emailValue.includes("@") || !emailValue.endsWith(".com")) {
      toastTitle.innerHTML = "Validation Error";
      toastBody.innerHTML = "Please enter a valid email (must contain @ and end with .com).";
      toastBootstrap.show();
      return;
    }

    const phoneValue = phoneInput.value.trim();
    const validPrefixes = ["2010", "2011", "2012", "2015"];
    const isValidPhone = phoneValue.length === 12 && 
                          validPrefixes.some(prefix => phoneValue.startsWith(prefix));
    
    if (!isValidPhone) {
      toastTitle.innerHTML = "Validation Error";
      toastBody.innerHTML = "Phone number must start with 2010, 2011, 2012, or 2015 and be 11 digits long.";
      toastBootstrap.show();
      return;
    }

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
      toastTitle.innerHTML = "Success";
      toastBody.innerHTML = "Profile updated successfully!";
      toastBootstrap.show();
    } else {
      toastTitle.innerHTML = "Error";
      toastBody.innerHTML = "Something went wrong. Please try again.";
      toastBootstrap.show();
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    toastTitle.innerHTML = "Error";
    toastBody.innerHTML = "Failed to update profile. Please try again.";
    toastBootstrap.show();
  }
});

profileImageInput.addEventListener("change", function () {
  if (this.files && this.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      profileImagePreview.src = e.target.result;
    };

    reader.readAsDataURL(this.files[0]);
  }
});

const resetPasswordForm = document.getElementById("resetPasswordForm");
resetPasswordForm.addEventListener("submit", async function(event) {
  event.preventDefault();
  
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    toastTitle.innerHTML = "Error";
    toastBody.innerHTML = "You must be logged in to reset your password.";
    toastBootstrap.show();
    return;
  }
  
  const newPassword = document.getElementById("newPassword").value;
  const confirmNewPassword = document.getElementById("confirmNewPassword").value;
  
  if (newPassword.length < 6) {
    toastTitle.innerHTML = "Validation Error";
    toastBody.innerHTML = "Password must be at least 6 characters long.";
    toastBootstrap.show();
    return;
  }
  
  if (newPassword !== confirmNewPassword) {
    toastTitle.innerHTML = "Validation Error";
    toastBody.innerHTML = "Passwords do not match.";
    toastBootstrap.show();
    return;
  }
  
  try {
    const updatedPasswordData = {
      password: newPassword
    };
    
    const updatedCustomer = await updateCustomer(currentUser.id, updatedPasswordData);
    
    if (updatedCustomer) {
      toastTitle.innerHTML = "Success";
      toastBody.innerHTML = "Password updated successfully!";
      toastBootstrap.show();
      
      const resetPasswordModal = bootstrap.Modal.getInstance(document.getElementById('resetPasswordModal'));
      resetPasswordModal.hide();
      
      resetPasswordForm.reset();
    } else {
      toastTitle.innerHTML = "Error";
      toastBody.innerHTML = "Failed to update password. Please try again.";
      toastBootstrap.show();
    }
  } catch (error) {
    console.error("Error updating password:", error);
    toastTitle.innerHTML = "Error";
    toastBody.innerHTML = "Failed to update password. Please try again.";
    toastBootstrap.show();
  }
});

document.addEventListener("DOMContentLoaded", loadCustomerData);



