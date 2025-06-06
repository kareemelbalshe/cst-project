import { logout, getCustomer, deleteCustomer } from "../../../../shared/Api.js";

window.addEventListener("load", () => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
    localStorage.getItem("isAdmin") !== "true"
  ) {
    window.location.href = "../../../index.html";
  }
});
setTimeout(() => {
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
    localStorage.getItem("isAdmin") !== "true"
  ) {
    window.location.href = "../../../index.html";
  }
}, 100);

const logoutBtn = document.getElementById("logout");

logoutBtn.addEventListener("click", () => {
  logout();
  window.location.href = "../../../index.html";
});

const params = new URLSearchParams(window.location.search);
const customerid = params.get("id");

const response = await getCustomer(customerid);

try {
  const response = await getCustomer(customerid);
  console.log(response);

  if (response) {
    document.querySelector(".idcustomer").innerText = response.id || "N/A";
    document.querySelector(".name").innerText = response.name || "N/A";
    document.querySelector(".email").innerText = response.email || "N/A";
    document.querySelector(".phone").innerText = response.phone || "N/A";
    document.querySelector(".address").innerText = response.address || "N/A";
    document.querySelector(".numBuys").innerText = response.numBuys ?? "0";
    document.querySelector(".total").innerText = `$${
      response.totalSpent?.toFixed(2) || "0.00"
    }`;
    document.querySelector(".createdat").innerText =
      new Date(response.createdAt).toLocaleString() || "N/A";
  } else {
    alert("Customer not found!");
  }
} catch (err) {
  console.error("Failed to fetch customer:", err);
  alert("An error occurred while fetching customer data.");
}

const deleteThis = document.getElementById("deleteThis");
deleteThis.addEventListener("click", async () => {
  Swal.fire({
    title: "Are you sure?",
    text: "This item will be deleted permanently.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      await deleteCustomer(customerid);
      window.location.href = "../index.html";
    }
  });
});
