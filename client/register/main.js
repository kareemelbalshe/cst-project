import { registerCustomer } from "../../shared/Api.js";
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
  window.location.href = "../index.html";
});
