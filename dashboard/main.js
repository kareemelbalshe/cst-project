import { loginAdmin, loginSeller } from "../shared/Api.js";

const loginFormDashboard = document.getElementById("loginFormDashboard");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const roleInput = document.getElementById("role");

const toastLiveExample = document.getElementById("liveToast");
const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
const toastTitle = document.getElementById("toastTitle");
const toastBody = document.getElementById("toastBody");

window.addEventListener("load", () => {
  if (
    localStorage.getItem("isLoggedIn") === "true" &&
    localStorage.getItem("isAdmin") === "true"
  ) {
    window.location.href = "./admin/index.html";
  }
  if (
    localStorage.getItem("isLoggedIn") === "true" &&
    localStorage.getItem("isSeller") === "true"
  ) {
    window.location.href = "./seller-dashboard/index.html";
  }
});

loginFormDashboard.addEventListener("submit", (e) => {
  e.preventDefault();

  // Check for empty fields
  if (
    emailInput.value.trim() === "" ||
    passwordInput.value.trim() === "" ||
    roleInput.value === ""
  ) {
    toastTitle.innerHTML = "Error";
    toastBody.innerHTML = "Please fill in all fields.";
    toastBootstrap.show();
    return;
  }

  if (roleInput.value === "admin") {
    loginAdmin({
      email: emailInput.value,
      password: passwordInput.value,
    }).then((res) => {
      if (res) {
        window.location.href = "./admin/index.html";
      } else {
        toastTitle.innerHTML = "Error";
        toastBody.innerHTML = "Email or password is incorrect.";
        toastBootstrap.show();
      }
    });
  } else if (roleInput.value === "seller") {
    loginSeller({
      email: emailInput.value,
      password: passwordInput.value,
    }).then((res) => {
      if (res) {
        window.location.href = "./seller-dashboard/index.html";
      } else {
        toastTitle.innerHTML = "Error";
        toastBody.innerHTML = "Email or password is incorrect.";
        toastBootstrap.show();
      }
    });
  } else {
    toastTitle.innerHTML = "Error";
    toastBody.innerHTML = "Please select a valid role.";
    toastBootstrap.show();
  }
});
