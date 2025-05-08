import { getCustomer, loginCustomer } from "../../shared/Api.js";

const form = document.querySelector("form");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const toastLive = document.getElementById("liveToast");
  const toastBootstrap = new bootstrap.Toast(toastLive);
  const toastTitle = document.getElementById("toastTitle");
  const toastBody = document.getElementById("toastBody");

  if (!email || !password) {
    toastTitle.innerHTML = "Error";
    toastBody.innerHTML = "Both email and password are required.";
    toastBootstrap.show();
    return;
  }

  try {
    const result = await loginCustomer({ email, password });

    console.log(result)
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
