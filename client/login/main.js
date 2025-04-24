import { loginCustomer } from "../../shared/Api.js";

const form = document.querySelector("form");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const result = await loginCustomer({ email, password });

  window.location.href = "../index.html";
});
