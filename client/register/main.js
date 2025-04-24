import { loginCustomer, registerCustomer } from "../../shared/Api.js";
import createId from "../../shared/createId.js";
import getCurrentTimestamp from "../../shared/setTime.js";

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

  if (password !== confirmPassword) {
    alert("Passwords don't match!");
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
      const response = await fetch("http://localhost:5000/customers");
      const customers = await response.json();
      const customer = customers.find((c) => c.email === email);

      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: customer.id,
          name: customer.name,
          email: customer.email,
        })
      );

      alert("Login successful!");
      window.location.href = "../index.html";
    } else {
      alert("Invalid email or password. Please try again.");
    }
  } catch (err) {
    console.error("Login failed:", err);
    alert("Login failed. Please try again later.");
  }
  window.location.href = "../index.html";
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
