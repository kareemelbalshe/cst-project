import { loginSeller, registerSeller } from "../../../shared/Api.js";
import createId from "../../js/createId.js";
import getCurrentTimestamp from "../../js/setTime.js";

const form = document.querySelector("form");

const toastLive = document.getElementById("liveToast");
const toastBootstrap = new bootstrap.Toast(toastLive);
const toastTitle = document.getElementById("toastTitle");
const toastBody = document.getElementById("toastBody");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const id = createId();
  const name = document.getElementById("sellername").value.trim();
  const email = document.getElementById("selleremail").value.trim();
  const password = document.getElementById("sellerpassword").value.trim();
  const confirmPassword = document.getElementById("sellerconfirmPassword").value.trim();
  const phone = document.getElementById("sellerphone").value.trim();
  const address = document.getElementById("sellerAddress").value.trim();
  const createdAt = getCurrentTimestamp();

  if (!name || !email || !password || !confirmPassword || !phone || !address) {
    toastTitle.innerHTML = "Error";
    toastBody.innerHTML = "All fields are required.";
    toastBootstrap.show();
    return;
  }

  if (!email.includes("@") || !email.endsWith(".com")) {
    toastTitle.innerHTML = "Error";
    toastBody.innerHTML = "Please enter a valid email address (must contain @ and end with .com).";
    toastBootstrap.show();
    return;
  }

  if (password.length < 6) {
    toastTitle.innerHTML = "Error";
    toastBody.innerHTML = "Password must be at least 6 characters.";
    toastBootstrap.show();
    return;
  }

  if (password !== confirmPassword) {
    toastTitle.innerHTML = "Error";
    toastBody.innerHTML = "Passwords don't match!";
    toastBootstrap.show();
    return;
  }

  function validateEgyptianPhone(phoneNumber) {
    const validPrefixes = ["2010", "2011", "2012", "2015"];
    let isValid = false;
    
    if (phoneNumber.length === 12) {
      for (const prefix of validPrefixes) {
        if (phoneNumber.startsWith(prefix)) {
          isValid = true;
          break;
        }
      }
    }
    
    return isValid;
  }

  if (!validateEgyptianPhone(phone)) {
    toastTitle.innerHTML = "Error";
    toastBody.innerHTML = "Please enter a valid Egyptian phone number starting with 2010, 2011, 2012, or 2015 and having a total length of 12 digits.";
    toastBootstrap.show();
    return;
  }

  const newSeller = {
    id,
    name,
    email,
    password,
    phone,
    address,
    createdAt,
  };

  try {
    await registerSeller(newSeller);
    await loginSeller({ email, password });

    toastTitle.innerHTML = "Success";
    toastBody.innerHTML = "Welcome!";
    toastBootstrap.show();

    setTimeout(() => {
      window.location.href = "../index.html";
    }, 1500);
  } catch (error) {
    console.error("Error registering seller:", error);
    toastTitle.innerHTML = "Error";
    toastBody.innerHTML = "Failed to register. Please try again.";
    toastBootstrap.show();
  }
});

window.addEventListener("load", () => {
  if (
    localStorage.getItem("isLoggedIn") === "true" &&
    localStorage.getItem("isSeller") === "true"
  ) {
    window.location.href = "../index.html";
  }
});

setTimeout(() => {
  if (
    localStorage.getItem("isLoggedIn") === "true" &&
    localStorage.getItem("isSeller") === "true"
  ) {
    window.location.href = "../index.html";
  }
}, 100);

