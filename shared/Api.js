// import createId from "./createId.js";
// import getCurrentTimestamp from "./setTime.js";

export async function addProduct(body) {
  //   const body = {
  //     id: createId(),
  //     name: "kareem",
  //     price: 100,
  //     description: "kareem",
  //     category: "1",
  //     discount: 10,
  //     image: "https://i.ibb.co/4j3m5kH/kareem.jpg",
  //     seller: "1",
  //     createdAt: getCurrentTimestamp(),
  //   };

  console.log("Sending:", body);

  const res = await fetch("http://localhost:5000/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  console.log("Status:", res.status);

  const data = await res.json();
  console.log("Response:", data);
}

export async function getProducts() {
  const res = await fetch("http://localhost:5000/products");
  const data = await res.json();
  return data;
}

export async function getProduct(id) {
  const res = await fetch(`http://localhost:5000/products/${id}`);
  const data = await res.json();
  return data;
}

export async function updateProduct(id, body) {
  const res = await fetch(`http://localhost:5000/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  const category = getCategory(data.category);
  const reviews = data.reviewIds.map((item) => {
    getReview(item);
  });
  return { data, category, reviews };
}

export async function deleteProduct(id) {
  const res = await fetch(`http://localhost:5000/products/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();
  await data.reviewIds.map((id) => deleteReview(id));
}

export async function getCarts() {
  const res = await fetch("http://localhost:5000/carts");
  const data = await res.json();
  return data;
}

export async function getCart(id) {
  const res = await fetch(`http://localhost:5000/carts/${id}`);
  const data = await res.json();
  return data;
}

export async function addCart(body) {
  const res = await fetch("http://localhost:5000/carts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return data;
}

export async function deleteCart(id) {
  const res = await fetch(`http://localhost:5000/carts/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();
  return data;
}

export async function getCategories() {
  const res = await fetch("http://localhost:5000/categories");
  const data = await res.json();
  return data;
}

export async function getCategory(id) {
  const res = await fetch(`http://localhost:5000/categories/${id}`);
  const data = await res.json();
  return data;
}

export async function addCategory(body) {
  const res = await fetch("http://localhost:5000/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return data;
}

export async function updateCategory(id, body) {
  const res = await fetch(`http://localhost:5000/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return data;
}

export async function deleteCategory(id) {
  const res = await fetch(`http://localhost:5000/categories/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();
  return data;
}

export async function getReviews() {
  const res = await fetch("http://localhost:5000/reviews");
  const data = await res.json();
  return data;
}

export async function getReview(id) {
  const res = await fetch(`http://localhost:5000/reviews/${id}`);
  const data = await res.json();
  return data;
}

export async function addReview(body) {
  const res = await fetch("http://localhost:5000/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return data;
}

export async function updateReview(id, body) {
  const res = await fetch(`http://localhost:5000/reviews/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return data;
}

export async function deleteReview(id) {
  const res = await fetch(`http://localhost:5000/reviews/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();
  return data;
}

export async function getSiteReviews() {
  const res = await fetch("http://localhost:5000/site-reviews");
  const data = await res.json();
  return data;
}

export async function getSiteReview(id) {
  const res = await fetch(`http://localhost:5000/site-reviews/${id}`);
  const data = await res.json();
  return data;
}

export async function addSiteReview(body) {
  const res = await fetch("http://localhost:5000/site-reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return data;
}

export async function updateSiteReview(id, body) {
  const res = await fetch(`http://localhost:5000/site-reviews/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return data;
}

export async function deleteSiteReview(id) {
  const res = await fetch(`http://localhost:5000/site-reviews/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();
  return data;
}

export async function getCustomers() {
  const res = await fetch("http://localhost:5000/customers");
  const data = await res.json();
  return data;
}

export async function getCustomer(id) {
  const res = await fetch(`http://localhost:5000/customers/${id}`);
  const data = await res.json();
  return data;
}

export async function registerCustomer(body) {
  const res = await fetch("http://localhost:5000/customers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return data;
}

export async function updateCustomer(id, body) {
  const res = await fetch(`http://localhost:5000/customers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return data;
}

export async function deleteCustomer(id) {
  const res = await fetch(`http://localhost:5000/customers/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();
  return data;
}

export async function getSellers() {
  const res = await fetch("http://localhost:5000/sellers");
  const data = await res.json();
  return data;
}

export async function getSeller(id) {
  const res = await fetch(`http://localhost:5000/sellers/${id}`);
  const data = await res.json();
  return data;
}

export async function addSeller(body) {
  const res = await fetch("http://localhost:5000/sellers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return data;
}

export async function updateSeller(id, body) {
  const res = await fetch(`http://localhost:5000/sellers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return data;
}

export async function deleteSeller(id) {
  const res = await fetch(`http://localhost:5000/sellers/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();
  return data;
}
