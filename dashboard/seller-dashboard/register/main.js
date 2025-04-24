import { registerSeller} from "../../../shared/Api.js";
import createId from "../../../shared/createId.js";
import getCurrentTimestamp from "../../../shared/setTime.js";

const form = document.querySelector("form");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const id = createId();
  const name = document.getElementById("sellername").value;
  const email = document.getElementById("selleremail").value;
  const password = document.getElementById("sellerpassword").value;
  const confirmPassword = document.getElementById("sellerconfirmPassword").value;
  const phone = document.getElementById("sellerphone").value;
  const address = document.getElementById("sellerAddress").value;
  const createdAt = getCurrentTimestamp();

  if (password !== confirmPassword) {  
    alert("Passwords don't match!");
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

  await registerSeller(newSeller);
  alert("Welcome")
});
