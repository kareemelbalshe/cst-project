import { logout, getCustomer, updateCustomer , deleteCustomer} from "../../shared/Api.js";
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
  
  const form = document.querySelector("form");
  const deleteAccountBtn = document.createElement("button");
  deleteAccountBtn.type = "button";
  deleteAccountBtn.className = "btn btn-danger mt-3";
  deleteAccountBtn.setAttribute("data-bs-toggle", "modal");
  deleteAccountBtn.setAttribute("data-bs-target", "#deleteAccountModal");
  deleteAccountBtn.textContent = "Delete Account";
  form.appendChild(deleteAccountBtn);
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
    showToast("Validation Error", "Phone number must start with 2010, 2011, 2012, or 2015 and be 12 digits long.");
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
      toastLive.style = "background-color: #198754; color: white;";
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
      toastLive.style = "background-color: #198754; color: white;";
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

async function handleDeleteAccount() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    showToast("Error", "You must be logged in to delete your account.");
    return;
  }

  try {
    await deleteCustomer(currentUser.id);
    
    logout();
    toastLive.style = "background-color: #198754; color: white;";
    showToast("Success", "Your account has been deleted successfully!");
    
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 2000);
    
  } catch (error) {
    console.error("Error deleting account:", error);
    showToast("Error", "Failed to delete account. Please try again.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const modalDiv = document.createElement("div");
  modalDiv.className = "modal fade";
  modalDiv.id = "deleteAccountModal";
  modalDiv.tabIndex = "-1";
  modalDiv.setAttribute("aria-labelledby", "deleteAccountModalLabel");
  modalDiv.setAttribute("aria-hidden", "true");
  
  modalDiv.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="deleteAccountModalLabel">Confirm Account Deletion</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete your account? This action cannot be undone.</p>
          <p class="text-danger"><strong>Warning:</strong> All your account data will be permanently deleted and you will be logged out.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-danger" id="confirmDeleteAccount">Delete Account</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modalDiv);
  
  const confirmDeleteBtn = document.getElementById("confirmDeleteAccount");
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", function() {
      const deleteModal = bootstrap.Modal.getInstance(document.getElementById("deleteAccountModal"));
      if (deleteModal) {
        deleteModal.hide();
      }
      handleDeleteAccount();
    });
  }
});

function showToast(title, message) {
  toastTitle.innerHTML = title;
  toastBody.innerHTML = message;
  toastBootstrap.show();
}