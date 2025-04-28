customer ={
"id": "string",
"name": "string",
"email": "string",
"password": "string",
"image": "url-or-path",
"address": "string",
"phone": "string",
"numBuys": 0,
"totalSpent": 0,
"createdAt": "2025-04-17T20:00:00Z"
}

seller ={
"id": "string",
"name": "string",
"email": "string",
"password": "string",
"phone": "string",
"products": ["product-id-1", "product-id-2"],
"numSells": 0,
"totalRevenue": 0,
"createdAt": "2025-04-17T20:00:00Z"
}

product = {
"id": "string",
"name": "string",
"description": "string",
"price": 100,
"image": "url-or-path",
"category": "category-id",  
"discount": 10,
"price_after_discount": 90,
"quantity": 1,
"seller": "seller-id",  
"sales": 0,
"rating": 4.5,
"totalStars": 13,
"totalRatings": 20,
"reviewIds": ["rev-id-1", "rev-id-2"],
"createdAt": "2025-04-17T20:00:00Z"
}

review = {
"id": "string",
"product": "product-id",  
"stars": 4,
"comment": "string",
"customer": "customer-id",
"createdAt": "2025-04-17T20:00:00Z"
}

cart = {
"id": "string",
"customer": "customer-id",
"product": "product-id",
seller: "seller-id",
"quantity": 2,
"total": 200
}

category ={
"id": "string",
"name": "string"
"image": "url-or-path"
}

site_review={
"id": "rev-1",
"stars": 5,
"comment": "موقع ممتاز جدًا",
"customer": "customer-id"
}

json-server --watch shared/data.json --port=5000