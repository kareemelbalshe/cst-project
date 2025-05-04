import {
  getCustomer,
  loginCustomer,
  registerCustomer,
} from "../../shared/Api.js";
import createId from "../js/createId.js";
import getCurrentTimestamp from "../js/setTime.js";

const form = document.querySelector("form");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const id = createId();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("Address").value;
  const createdAt = getCurrentTimestamp();

  const toastLive = document.getElementById("liveToast");
  const toastBootstrap = new bootstrap.Toast(toastLive);
  const toastTitle = document.getElementById("toastTitle");
  const toastBody = document.getElementById("toastBody");

  if (!name || !email || !password || !confirmPassword || !phone || !address) {
    toastTitle.innerHTML = "Error";
    toastBody.innerHTML = "All fields must be filled.";
    toastBootstrap.show();
    return;
  }

  if (!email.includes("@") || !email.endsWith(".com")) {
    toastTitle.innerHTML = "Error";
    toastBody.innerHTML = "Email must contain '@' and end with '.com'";
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
    const validPrefixes = ["010", "011", "012", "015"];
    let isValid = false;

    if (phoneNumber.length === 1) {
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
    toastBody.innerHTML =
      "Please enter a valid Egyptian phone number starting with 2010, 2011, 2012, or 2015 and having a total length of 12 digits.";
    toastBootstrap.show();
    return;
  }

  const newCustomer = {
    id,
    name,
    email,
    password,
    phone,
    address,
    numBuys: 0,
    totalSpent: 0,
    createdAt,
  };

  await registerCustomer(newCustomer);
  try {
    const result = await loginCustomer({ email, password });

    if (result) {
      const customer = await getCustomer(localStorage.getItem("Id"));

      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: customer.id,
          name: customer.name,
          email: customer.email,
        })
      );

      toastTitle.innerHTML = "Success";
      toastBody.innerHTML = "Login successful!";
      toastBootstrap.show();

      setTimeout(() => {
        window.location.href = "../index.html";
      }, 1500);
    } else {
      toastTitle.innerHTML = "Error";
      toastBody.innerHTML = "Invalid email or password. Please try again.";
      toastBootstrap.show();
    }
  } catch (err) {
    console.error("Login failed:", err);
    toastTitle.innerHTML = "Error";
    toastBody.innerHTML = "Login failed. Please try again later.";
    toastBootstrap.show();
  }
});

window.addEventListener("load", () => {
  if (
    localStorage.getItem("isLoggedIn") === "true" &&
    localStorage.getItem("isCustomer") === "true"
  ) {
    window.location.href = "../index.html";
  }
});
setTimeout(() => {
  if (
    localStorage.getItem("isLoggedIn") === "true" &&
    localStorage.getItem("isCustomer") === "true"
  ) {
    window.location.href = "../index.html";
  }
}, 1000);
