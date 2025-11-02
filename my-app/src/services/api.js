const API_BASE_URL = 'http://localhost:4000/api';

const getAuthToken = () => localStorage.getItem('token');

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API Error');
  }
  return data;
};

const apiCall = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return handleResponse(response);
};

export const authAPI = {
  login: (email, password) =>
    apiCall('/login', {
      method: 'POST',
      body: JSON.stringify({ Email: email, Password: password }),
    }),

  register: (userName, email, password, role) =>
    apiCall('/register', {
      method: 'POST',
      body: JSON.stringify({
        UserName: userName,
        Email: email,
        Password: password,
        Role: role,
      }),
    }),

  getUsers: () => apiCall('/users'),
  getUserById: (id) => apiCall(`/users/${id}`),
  updateUser: (id, data) =>
    apiCall(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteUser: (id) =>
    apiCall(`/users/${id}`, { method: 'DELETE' }),
};

export const productAPI = {
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/products${query ? '?' + query : ''}`);
  },

  getProductById: (id) => apiCall(`/products/${id}`),

  searchProducts: (query) => apiCall(`/products/search?q=${query}`),

  createProduct: (formData) =>
    fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    }).then(handleResponse),

  updateProduct: (id, formData) =>
    fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    }).then(handleResponse),

  deleteProduct: (id) =>
    apiCall(`/products/${id}`, { method: 'DELETE' }),
};

export const cartAPI = {
  addToCart: (productId, quantity) =>
    apiCall('/cart', {
      method: 'POST',
      body: JSON.stringify({ ProductID: productId, Quantity: quantity }),
    }),

  getCart: () => apiCall('/cart'),

  removeFromCart: (cartItemId) =>
    apiCall(`/cart/${cartItemId}`, { method: 'DELETE' }),
};

export const orderAPI = {
  createOrder: (cartItems) =>
    apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify({ Items: cartItems }),
    }),

  getOrders: () => apiCall('/orders'),
};

export const reviewAPI = {
  createReview: (productId, rating, comment) =>
    apiCall('/reviews', {
      method: 'POST',
      body: JSON.stringify({
        ProductID: productId,
        Rating: rating,
        Comment: comment,
      }),
    }),

  getReviews: (productId) => apiCall(`/reviews/${productId}`),
};

export const categoryAPI = {
  getCategories: () => apiCall('/categories'),

  createCategory: (categoryName) =>
    apiCall('/categories', {
      method: 'POST',
      body: JSON.stringify({ Name: categoryName }),
    }),
};
