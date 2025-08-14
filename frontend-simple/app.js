// API URLs
const BOOK_SERVICE_URL = 'http://localhost:8001';
const ORDER_SERVICE_URL = 'http://localhost:8002';
const NOTIFICATION_SERVICE_URL = 'http://localhost:8003';

// Navigation
function showSection(sectionId) {
    const sections = ['home', 'books', 'orders', 'notifications'];
    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            section.style.display = id === sectionId ? 'block' : 'none';
        }
    });
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });
}

// Show alert messages
function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    alertContainer.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Book Service Functions
async function fetchBooks() {
    try {
        const response = await fetch(`${BOOK_SERVICE_URL}/books`);
        const books = await response.json();
        displayBooks(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        showAlert('Error loading books', 'danger');
    }
}

function displayBooks(books) {
    const container = document.getElementById('booksContainer');
    if (books.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-center">No books found. Add some books!</p></div>';
        return;
    }
    
    container.innerHTML = books.map(book => `
        <div class="col-md-4 mb-4">
            <div class="card book-card">
                <div class="card-body">
                    <h5 class="card-title">${book.title}</h5>
                    <p class="card-text"><strong>Author:</strong> ${book.author}</p>
                    <p class="card-text"><strong>Price:</strong> $${book.price}</p>
                    <p class="card-text">
                        <span class="badge ${book.stock > 0 ? 'bg-success' : 'bg-danger'}">
                            Stock: ${book.stock}
                        </span>
                    </p>
                    <button class="btn btn-sm btn-danger" onclick="deleteBook(${book.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

async function addBook() {
    const bookData = {
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        price: parseFloat(document.getElementById('bookPrice').value),
        stock: parseInt(document.getElementById('bookStock').value)
    };
    
    try {
        const response = await fetch(`${BOOK_SERVICE_URL}/books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData)
        });
        
        if (response.ok) {
            showAlert('Book added successfully!');
            document.getElementById('addBookForm').reset();
            bootstrap.Modal.getInstance(document.getElementById('addBookModal')).hide();
            fetchBooks();
        } else {
            const error = await response.json();
            showAlert(error.detail || 'Error adding book', 'danger');
        }
    } catch (error) {
        console.error('Error adding book:', error);
        showAlert('Error adding book', 'danger');
    }
}

async function deleteBook(bookId) {
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    try {
        const response = await fetch(`${BOOK_SERVICE_URL}/books/${bookId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showAlert('Book deleted successfully!');
            fetchBooks();
            fetchBooksForOrders(); // Refresh books in order form
        } else {
            showAlert('Error deleting book', 'danger');
        }
    } catch (error) {
        console.error('Error deleting book:', error);
        showAlert('Error deleting book', 'danger');
    }
}

// Order Service Functions
async function fetchOrders() {
    try {
        const response = await fetch(`${ORDER_SERVICE_URL}/orders`);
        const orders = await response.json();
        displayOrders(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        showAlert('Error loading orders', 'danger');
    }
}

function displayOrders(orders) {
    const container = document.getElementById('ordersContainer');
    if (orders.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-center">No orders found. Create some orders!</p></div>';
        return;
    }
    
    container.innerHTML = orders.map(order => `
        <div class="col-md-6 mb-4">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Order #${order.id}</h5>
                    <p class="card-text"><strong>Book ID:</strong> ${order.book_id}</p>
                    <p class="card-text"><strong>Quantity:</strong> ${order.quantity}</p>
                    <p class="card-text"><strong>Total:</strong> $${order.total_price?.toFixed(2)}</p>
                    <p class="card-text"><strong>Customer:</strong> ${order.customer_name}</p>
                    <p class="card-text"><strong>Email:</strong> ${order.customer_email}</p>
                    <p class="card-text">
                        <span class="badge ${getStatusBadge(order.status)}">${order.status}</span>
                    </p>
                    <small class="text-muted">Created: ${new Date(order.created_at).toLocaleString()}</small>
                </div>
            </div>
        </div>
    `).join('');
}

function getStatusBadge(status) {
    switch(status) {
        case 'pending': return 'bg-warning';
        case 'completed': return 'bg-success';
        case 'cancelled': return 'bg-danger';
        default: return 'bg-secondary';
    }
}

async function createOrder() {
    const orderData = {
        book_id: parseInt(document.getElementById('orderBook').value),
        quantity: parseInt(document.getElementById('orderQuantity').value),
        customer_name: document.getElementById('orderCustomerName').value,
        customer_email: document.getElementById('orderCustomerEmail').value
    };
    
    try {
        const response = await fetch(`${ORDER_SERVICE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        
        if (response.ok) {
            showAlert('Order created successfully!');
            document.getElementById('addOrderForm').reset();
            bootstrap.Modal.getInstance(document.getElementById('addOrderModal')).hide();
            fetchOrders();
        } else {
            const error = await response.json();
            showAlert(error.detail || 'Error creating order', 'danger');
        }
    } catch (error) {
        console.error('Error creating order:', error);
        showAlert('Error creating order', 'danger');
    }
}

async function fetchBooksForOrders() {
    try {
        const response = await fetch(`${BOOK_SERVICE_URL}/books`);
        const books = await response.json();
        const select = document.getElementById('orderBook');
        select.innerHTML = '<option value="">Select a book...</option>';
        books.forEach(book => {
            select.innerHTML += `<option value="${book.id}">${book.title} - $${book.price} (Stock: ${book.stock})</option>`;
        });
    } catch (error) {
        console.error('Error fetching books for orders:', error);
    }
}

// Notification Functions
async function sendManualNotification() {
    const orderId = document.getElementById('orderIdInput').value;
    if (!orderId) {
        showAlert('Please enter an order ID', 'warning');
        return;
    }
    
    try {
        const response = await fetch(`${NOTIFICATION_SERVICE_URL}/notify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ order_id: parseInt(orderId) })
        });
        
        if (response.ok) {
            const result = await response.json();
            showAlert(`Notification sent for order ${result.order_id} to ${result.customer_email}`);
            document.getElementById('orderIdInput').value = '';
        } else {
            const error = await response.json();
            showAlert(error.detail || 'Error sending notification', 'danger');
        }
    } catch (error) {
        console.error('Error sending notification:', error);
        showAlert('Error sending notification', 'danger');
    }
}

// Modal Functions
function showAddBookModal() {
    const modal = new bootstrap.Modal(document.getElementById('addBookModal'));
    modal.show();
}

function showAddOrderModal() {
    fetchBooksForOrders();
    const modal = new bootstrap.Modal(document.getElementById('addOrderModal'));
    modal.show();
}

// Navigation Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
            
            // Load data for each section
            if (section === 'books') {
                fetchBooks();
            } else if (section === 'orders') {
                fetchOrders();
            }
        });
    });
    
    // Show home section by default
    showSection('home');
});

// Service Health Checks
async function checkServiceHealth() {
    const services = [
        { name: 'Book Service', url: BOOK_SERVICE_URL },
        { name: 'Order Service', url: ORDER_SERVICE_URL },
        { name: 'Notification Service', url: NOTIFICATION_SERVICE_URL }
    ];
    
    for (const service of services) {
        try {
            const response = await fetch(`${service.url}/health`);
            if (response.ok) {
                console.log(`${service.name} is running`);
            }
        } catch (error) {
            console.warn(`${service.name} might not be running:`, error);
        }
    }
}

// Check service health on page load
checkServiceHealth();
