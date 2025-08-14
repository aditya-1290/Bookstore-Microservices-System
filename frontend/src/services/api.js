import axios from 'axios';

// API endpoints
const BOOK_SERVICE_URL = 'http://localhost:8001';
const ORDER_SERVICE_URL = 'http://localhost:8002';
const NOTIFICATION_SERVICE_URL = 'http://localhost:8003';

// Book Service API
export const bookService = {
  getBooks: () => axios.get(`${BOOK_SERVICE_URL}/books`),
  getBook: (id) => axios.get(`${BOOK_SERVICE_URL}/books/${id}`),
  createBook: (book) => axios.post(`${BOOK_SERVICE_URL}/books`, book),
  updateBook: (id, book) => axios.put(`${BOOK_SERVICE_URL}/books/${id}`, book),
  deleteBook: (id) => axios.delete(`${BOOK_SERVICE_URL}/books/${id}`)
};

// Order Service API
export const orderService = {
  getOrders: () => axios.get(`${ORDER_SERVICE_URL}/orders`),
  getOrder: (id) => axios.get(`${ORDER_SERVICE_URL}/orders/${id}`),
  createOrder: (order) => axios.post(`${ORDER_SERVICE_URL}/orders`, order)
};

// Notification Service API
export const notificationService = {
  sendNotification: (orderId) => axios.post(`${NOTIFICATION_SERVICE_URL}/notify`, { order_id: orderId })
};

// Helper function to handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    return error.response.data.detail || error.response.data.message || 'An error occurred';
  } else if (error.request) {
    // Request made but no response
    return 'No response from server';
  } else {
    // Something else happened
    return 'An error occurred';
  };
};
