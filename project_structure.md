# Bookstore Microservices System

## Architecture Overview
- **Book Service**: Port 8001 - Manages book inventory
- **Order Service**: Port 8002 - Handles orders and stock management
- **Notification Service**: Port 8003 - Sends notifications for orders
- **Frontend**: Port 3000 - React-based web interface

## Project Structure
```
bookstore-microservices/
├── book-service/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   └── requirements.txt
├── order-service/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   └── requirements.txt
├── notification-service/
│   ├── main.py
│   ├── models.py
│   └── requirements.txt
├── frontend/
│   ├── package.json
│   ├── src/
│   │   ├── App.js
│   │   ├── components/
│   │   └── services/
│   └── public/
├── docker-compose.yml
└── README.md
