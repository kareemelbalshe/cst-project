// import createId from "./createId.js";
// import getCurrentTimestamp from "./setTime.js";

export async function getAdmin() {
  const res = await fetch("http://localhost:5000/admin");
  const data = await res.json();
  return data;
}

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

  const res = await fetch("http://localhost:5000/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  const seller = await getSeller(body.seller);
  const updatedSeller = {
    ...seller,
    products: [...seller.products, data.id],
  };
  await updateSeller(seller.id, updatedSeller);
  return data;
}

export async function getProducts() {
  const res = await fetch("http://localhost:5000/products");
  const data = await res.json();
  return data;
}

export async function getProduct(id) {
  try {
    const res = await fetch(`http://localhost:5000/products/${id}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch product:", err);
    return false;
  }
}

export async function getProductsToSeller(sellerId) {
  const products = await getProducts();
  return products.filter((product) => product.seller === sellerId);
}

export async function updateProduct(id, body) {
  const res = await fetch(`http://localhost:5000/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return data;
}

export async function deleteProduct(id) {
  const resProduct = await fetch(`http://localhost:5000/products/${id}`);
  const product = await resProduct.json();
  if (product?.reviewIds && product.reviewIds.length > 0) {
    await Promise.all(product.reviewIds.map((id) => deleteReview(id)));
  }

  const res = await fetch(`http://localhost:5000/products/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();
  return data;
}

export async function getCarts() {
  const res = await fetch("http://localhost:5000/carts");
  const data = await res.json();
  return data;
}

export async function getCart(id) {
  const res = await fetch(`http://localhost:5000/carts/${id}`);
  const data = await res.json();
  const product = await getProduct(data.product);
  const customer = await getCustomer(data.customer);
  return { data, product, customer };
}

export async function getCartsToSeller(sellerId) {
  const carts = await getCarts();
  return carts.filter((cart) => cart.seller === sellerId);
}

export async function addCart(body) {
  const res = await fetch("http://localhost:5000/carts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const cartItem = await res.json();
  const product = await getProduct(body.product);

  const qty = body.quantity || 1;

  const updatedProduct = {
    quantity: (product.quantity || 0) - qty,
    sales: (product.sales || 0) + qty,
  };
  if (updatedProduct.quantity < 0) {
    return {
      success: false,
      message: "Cannot add negative quantity to product",
    };
  }
  await updateProduct(body.product, updatedProduct);

  const customer = await getCustomer(body.customer);
  const updatedCustomer = {
    numBuys: (customer.numBuys || 0) + qty,
    totalSpent: (customer.totalSpent || 0) + parseFloat(body.total),
  };
  await updateCustomer(body.customer, updatedCustomer);

  const seller = await getSeller(product.seller);
  const updatedSeller = {
    numSells: (seller.numSells || 0) + qty,
    totalRevenue: (seller.totalRevenue || 0) + parseFloat(body.total),
  };
  await updateSeller(product.seller, updatedSeller);

  return cartItem;
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
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return data;
}

export async function deleteCategory(id) {
  const products = await getProducts();
  const hasProduct = products.some((product) => product.category === id);

  if (hasProduct) {
    return {
      success: false,
      message: "Cannot delete category because it has products.",
    };
  }

  const res = await fetch(`http://localhost:5000/categories/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();
  return { success: true, data };
}

export async function getReviews() {
  const res = await fetch("http://localhost:5000/reviews");
  const data = await res.json();
  return data;
}

export async function getReview(id) {
  const res = await fetch(`http://localhost:5000/reviews/${id}`);
  const data = await res.json();
  const product = await getProduct(data.product);
  const customer = await getCustomer(data.customer);
  return { data, product, customer };
}

export async function addReview(body) {
  const res = await fetch("http://localhost:5000/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const review = await res.json();

  const product = await getProduct(body.product);

  const totalRatings = (product.totalRatings || 0) + 1;
  const totalStars = (product.totalStars || 0) + body.stars;
  const newRating = totalStars / totalRatings;

  const updatedProduct = {
    reviewIds: [...(product.reviewIds || []), review.id],
    totalRatings,
    totalStars,
    rating: Number(newRating.toFixed(1)),
  };

  await updateProduct(product.id, updatedProduct);

  return review;
}

export async function editReview(id, updatedReview) {
  const oldReview = await getReview(id);
  const product = await getProduct(oldReview.product.id);

  const newTotalStars =
    product.totalStars - oldReview.stars + updatedReview.stars;
  const rating = newTotalStars / product.totalRatings;

  const res = await fetch(`http://localhost:5000/reviews/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedReview),
  });

  const newReview = await res.json();

  const updatedProduct = {
    totalStars: newTotalStars,
    rating: Number(rating.toFixed(1)),
  };

  await updateProduct(product.id, updatedProduct);

  return newReview;
}

export async function deleteReview(id) {
  const review = await getReview(id);
  const product = await getProduct(review.product.id);

  const newReviewIds = (product.reviewIds || []).filter((rid) => rid !== id);
  const newTotalRatings = (product.totalRatings || 1) - 1;
  const newTotalStars = (product.totalStars || 0) - review.data.stars;

  const newRating = newTotalRatings > 0 ? newTotalStars / newTotalRatings : 0;

  const updatedProduct = {
    reviewIds: newReviewIds,
    totalRatings: newTotalRatings,
    totalStars: newTotalStars,
    rating: Number(newRating.toFixed(1)),
  };

  await updateProduct(product.id, updatedProduct);

  const res = await fetch(`http://localhost:5000/reviews/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();
  return data;
}

export async function getSiteReviews() {
  const res = await fetch("http://localhost:5000/site_reviews");
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch site reviews. Server says: ${text}`);
  }
  return await res.json();
}

export async function getSiteReview(id) {
  const res = await fetch(`http://localhost:5000/site_reviews/${id}`);
  const data = await res.json();
  return data;
}

export async function addSiteReview(body) {
  const res = await fetch("http://localhost:5000/site_reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return data;
}

export async function deleteSiteReview(id) {
  const res = await fetch(`http://localhost:5000/site_reviews/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to delete review. Server says: ${text}`);
  }
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
  const customers = await getCustomers();
  if (customers.some((customer) => customer.email === body.email)) {
    return {
      success: false,
      message: "Email already exists",
    };
  }
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
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Failed to update customer:", res.status, errorText);
    throw new Error("Failed to update customer");
  }

  const data = await res.json();
  return data;
}

export async function deleteCustomer(id) {
  const carts = await getCarts();
  await Promise.all(
    carts.map(async (cart) => {
      if (cart.customer === id) {
        await deleteCart(cart.id);
      }
    })
  );
  const reviews = await getReviews();
  await Promise.all(
    reviews.map(async (review) => {
      if (review.customer === id) {
        await deleteReview(review.id);
      }
    })
  );
  const siteReviews = await getSiteReviews();
  siteReviews.forEach(async (siteReview) => {
    if (siteReview.customer === id) {
      await deleteSiteReview(siteReview.id);
    }
  });

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

export async function registerSeller(body) {
  const sellers = await getSellers();
  if (sellers.some((seller) => seller.email === body.email)) {
    return {
      success: false,
      message: "Email already exists",
    };
  }
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
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return data;
}

export async function deleteSeller(id) {
  await Promise.all(
    await getProductsToSeller(id).map(async (product) => {
      await deleteProduct(product.id);
    })
  );

  await Promise.all(
    await getCartsToSeller(id).map(async (cart) => {
      await deleteCart(cart.id);
    })
  );

  const res = await fetch(`http://localhost:5000/sellers/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();
  return data;
}

export async function loginCustomer(body) {
  await logout();
  const customers = await getCustomers();

  const matchedCustomer = customers.find(
    (customer) =>
      customer.email === body.email && customer.password === body.password
  );

  if (matchedCustomer) {
    localStorage.setItem("Id", matchedCustomer.id);

    const customer = await getCustomer(matchedCustomer.id);

    const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];

    if (customer.cart.length > 0) {
      for (const item of customer.cart) {
        const product = await getProduct(item.product);
        if (!product) {
          continue;
        }

        const localItemIndex = updatedCart.findIndex(
          (localItem) => localItem.product === item.product
        );

        if (localItemIndex !== -1) {
          const localItem = updatedCart[localItemIndex];
          const totalQty = localItem.quantity + item.quantity;
          localItem.quantity =
            totalQty > product.quantity ? product.quantity : totalQty;
          localItem.stock = product.quantity;
          localItem.total = localItem.quantity * localItem.price_after_discount;
        } else {
          if (product.quantity > 0) {
            item.stock = product.quantity;
            if (item.quantity > product.quantity) {
              item.quantity = product.quantity;
            }
            updatedCart.push(item);
          }
        }
      }
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    localStorage.setItem("isLoggedIn", true);
    localStorage.setItem("isAdmin", false);
    localStorage.setItem("isSeller", false);
    localStorage.setItem("isCustomer", true);
    localStorage.setItem("currentUser", null);

    return true;
  }

  return false;
}

export async function loginSeller(body) {
  await logout();
  const sellers = await getSellers();
  if (
    sellers.some(
      (seller) =>
        seller.email === body.email && seller.password === body.password
    )
  ) {
    localStorage.setItem(
      "Id",
      sellers.find(
        (seller) =>
          seller.email === body.email && seller.password === body.password
      ).id
    );
    localStorage.setItem("isLoggedIn", true);
    localStorage.setItem("isAdmin", false);
    localStorage.setItem("isSeller", true);
    localStorage.setItem("isCustomer", false);
    localStorage.setItem("currentUser", null);
    return true;
  }

  return false;
}

export async function loginAdmin(body) {
  await logout();
  const res = await fetch("http://localhost:5000/admin");
  const admin = await res.json();
  if (admin.email === body.email && admin.password === body.password) {
    localStorage.setItem("Id", "");
    localStorage.setItem("isLoggedIn", true);
    localStorage.setItem("isAdmin", true);
    localStorage.setItem("isSeller", false);
    localStorage.setItem("isCustomer", false);
    localStorage.setItem("currentUser", null);
    return true;
  }

  return false;
}

export async function logout() {
  if (localStorage.getItem("isCustomer") === "true") {
    const id = localStorage.getItem("Id");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    try {
      await updateCustomer(id, { cart });
    } catch (err) {
      console.error("Error while updating customer cart:", err);
    }

    localStorage.setItem("cart", JSON.stringify([]));
  }

  localStorage.setItem("Id", "");
  localStorage.setItem("isLoggedIn", false);
  localStorage.setItem("isAdmin", false);
  localStorage.setItem("isSeller", false);
  localStorage.setItem("isCustomer", false);
  localStorage.setItem("currentUser", null);
}
