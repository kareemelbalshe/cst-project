import { loginCustomer } from "../../shared/Api.js";

const form = document.querySelector("form");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

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
