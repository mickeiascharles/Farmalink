import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const searchProducts = (query) => {
  return apiClient.get(`/search?q=${query}`);
};

export const getFeaturedPharmacies = () => {
  return apiClient.get("/pharmacies/destaque");
};

export const getOfferProducts = () => {
  return apiClient.get("/products/ofertas");
};

export const getProductById = (id) => {
  return apiClient.get(`/products/${id}`);
};

export const getPharmacyById = (id) => {
  return apiClient.get(`/pharmacies/${id}`);
};

export const getUserOrders = (userId) => {
  return apiClient.get(`/orders/user/${userId}`);
};

export const createOrder = (cartItems, totalPrice, userId) => {
  return apiClient.post("/orders", {
    items: cartItems,
    totalPrice: totalPrice,
    userId: userId,
  });
};

export const loginUser = (email, password) => {
  return apiClient.post("/login", { email, password });
};

export const registerUser = (email, password) => {
  return apiClient.post("/register", { email, password });
};

export const getAdminOrders = () => {
  return apiClient.get("/admin/orders");
};

export const updateOrderStatus = (orderId, status) => {
  return apiClient.put(`/admin/orders/${orderId}`, { status });
};

export const getAdminProducts = () => {
  return apiClient.get("/admin/products");
};

export const createProduct = (productData) => {
  return apiClient.post("/admin/products", productData);
};

export const updateProduct = (productId, productData) => {
  return apiClient.put(`/admin/products/${productId}`, productData);
};

export const deleteProduct = (productId) => {
  return apiClient.delete(`/admin/products/${productId}`);
};

export const getAdminUsers = () => {
  return apiClient.get("/admin/users");
};

export const deleteUser = (userId) => {
  return apiClient.delete(`/admin/users/${userId}`);
};
