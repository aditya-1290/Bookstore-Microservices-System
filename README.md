# Bookstore Microservices System

A comprehensive microservices-based bookstore system built with FastAPI backend and React frontend.

## Architecture Overview

This system consists of three independent microservices:

- **Book Service** (Port 8001): Manages book inventory
- **Order Service** (Port 8002): Handles customer orders
- **Notification Service** (Port 8003): Sends order notifications
- **Frontend** (Port 3000): React-based web interface

## Features

- ✅ Independent microservices architecture
- ✅ REST API communication between services
- ✅ Event-driven notifications
- ✅ React frontend with Material-UI
- ✅ CRUD operations for books and orders
- ✅ Stock management and validation
- ✅ Real-time notifications
- ✅ Health check endpoints

## Quick Start

### Prerequisites
- Python 3.13+
- Node.js 16+
- pip
- npm

### 1. Install Backend Services

#### Book Service
```bash
cd book-service
pip install -r requirements.txt
python main.py
```

#### Order Service
```bash
cd order-service
pip install -r requirements.txt
python main.py
```

#### Notification Service
```bash
cd notification-service
pip install -r requirements.txt
python main.py
```

### 2. Install Frontend

```bash
cd frontend
npm install
npm start
```

## API Endpoints

### Book Service (Port 8001)
- `GET /` - Service status
- `GET /books` - Get all books
- `POST /books` - Add new book
- `GET /books/{id}` - Get book by ID
- `PUT /books/{id}` - Update book
- `DELETE /books/{id}` - Delete book
- `GET /health` - Health check

### Order Service (Port 8002)
- `GET /` - Service status
- `GET /orders` - Get all orders
- `POST /orders` - Create new order
- `GET /orders/{id}` - Get order by ID
- `PUT /orders/{id}` - Update order
- `DELETE /orders/{id}` - Delete order
- `GET /health` - Health check

### Notification Service (Port 8003)
- `GET /` - Service status
- `POST /notify` - Send notification
- `POST /notify/bulk` - Send bulk notifications
- `GET /health` - Health check

## Service Communication

1. **Order Creation Flow**:
   - Frontend → Order Service (POST /orders)
   - Order Service → Book Service (GET /books/{id})
   - Order Service → Book Service (PUT /books/{id})
   - Order Service → Notification Service (POST /notify)

2. **Notification Flow**:
   - Notification Service → Order Service (GET /orders/{id})
   - Console logging of order details

## Testing the System

1. **Start all services** on their respective ports
2. **Open frontend** at http://localhost:3000
3. **Add books** via the Books page
4. **Create orders** via the Orders page
5. **Watch notifications** in the console output of Notification Service

## Database

Each service uses SQLite for simplicity:
- Book Service: `books.db`
- Order Service: `orders.db`

## Development

### Adding Sample Data

You can add sample books via the frontend or using curl:

```bash
# Add a book
curl -X POST http://localhost:8001/books \
  -H "Content-Type: application/json" \
  -d '{"title":"The Great Gatsby","author":"F. Scott Fitzgerald","price":12.99,"stock":50}'

# Create an order
curl -X POST http://localhost:8002/orders \
  -H "Content-Type: application/json" \
  -d '{"book_id":1,"quantity":2,"customer_name":"John Doe","customer_email":"john@example.com"}'
```

## Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Book Service  │    │  Order Service  │    │Notification     │
│    Port 8001    │◄───┤   Port 8002     │◄───┤Service Port 8003│
│                 │    │                 │    │                 │
│ - CRUD Books    │    │ - Create Orders │    │ - Send Notifs   │
│ - Stock Mgmt    │    │ - Stock Check   │    │ - Log Orders    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                       ▲                       ▲
         │                       │                       │
         └───────────────────────┴───────────────────────┘
                              │
                    ┌─────────────────┐
                    │   Frontend      │
                    │   Port 3000     │
                    │                 │
                    │ - React App     │
                    │ - Material-UI   │
                    └─────────────────┘
```

## Troubleshooting

### Port Already in Use
If ports are already in use, you can modify the port in each service's `main.py` file.

### CORS Issues
The services are configured to allow CORS. If you face issues, check the CORS settings in each FastAPI app.

### Database Issues
If you encounter database issues, you can safely delete the `.db` files to reset the databases.

## Future Enhancements

- Add authentication and authorization
- Implement message queue (RabbitMQ/Kafka) for async communication
- Add Docker containers for easy deployment
- Implement API gateway
- Add monitoring and logging
- Implement circuit breakers for resilience
- Add comprehensive testing suite
