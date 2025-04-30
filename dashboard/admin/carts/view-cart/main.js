import { getProduct } from "../../../../shared/Api.js";

export async function getCart(id) {
  const res = await fetch(`http://localhost:5000/carts/${id}`);
  const data = await res.json();

  const product = await getProduct(data.product);  // fetch product by ID

  const customerRes = await fetch(`http://localhost:5000/customers/${data.customer}`);
  const customer = await customerRes.json();

  return { data, product, customer };
}


const urlParams = new URLSearchParams(window.location.search);
const cartId = urlParams.get('id');

if (cartId) {
  getCart(cartId).then(({ data, product, customer }) => {
    document.getElementById('cartId').textContent = data.id;
    document.getElementById('customerName').textContent = customer.name;
    document.getElementById('customerEmail').textContent = customer.email;
    document.getElementById('createdAt').textContent = new Date(customer.createdAt).toLocaleString();

    const container = document.getElementById('cartItemsContainer');
    container.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'col';
    card.innerHTML = `
      <div class="card h-100 shadow-sm p-3">
        <img src="${product.image}" class="card-img-top" alt="${product.name}" />
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">Price: $${product.price}</p>
          <p class="card-text">Quantity: ${data.quantity}</p>
          <p class="card-text">Total: $${data.total}</p>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}
