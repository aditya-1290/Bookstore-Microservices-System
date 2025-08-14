from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db, engine
from models import Order, OrderCreate, OrderResponse, OrderUpdate
from typing import List
import httpx
import uvicorn
import os
from events import EventPublisher
import logging

# Create database tables
from database import Base
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Order Service", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

BOOK_SERVICE_URL = "http://localhost:8001"

@app.get("/")
async def root():
    return {"message": "Order Service is running"}

@app.get("/orders", response_model=List[OrderResponse])
async def get_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).all()
    return orders

@app.post("/orders", response_model=OrderResponse)
async def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    # Check book availability and price from Book Service
    async with httpx.AsyncClient() as client:
        try:
            book_response = await client.get(f"{BOOK_SERVICE_URL}/books/{order.book_id}")
            if book_response.status_code != 200:
                raise HTTPException(status_code=404, detail="Book not found")
            
            book_data = book_response.json()
            
            if book_data["stock"] < order.quantity:
                raise HTTPException(status_code=400, detail="Insufficient stock")
            
            total_price = book_data["price"] * order.quantity
            
            # Create order
            db_order = Order(
                book_id=order.book_id,
                quantity=order.quantity,
                total_price=total_price,
                customer_name=order.customer_name,
                customer_email=order.customer_email
            )
            db.add(db_order)
            db.commit()
            db.refresh(db_order)
            
            # Update book stock
            update_response = await client.put(
                f"{BOOK_SERVICE_URL}/books/{order.book_id}",
                json={"stock": book_data["stock"] - order.quantity}
            )
            
            if update_response.status_code != 200:
                # Rollback order if stock update fails
                db.delete(db_order)
                db.commit()
                raise HTTPException(status_code=500, detail="Failed to update book stock")
            
            # Publish order created event to RabbitMQ
            try:
                event_publisher = EventPublisher("amqp://guest:guest@localhost:5672/")
                order_data = {
                    "id": db_order.id,
                    "book_id": db_order.book_id,
                    "quantity": db_order.quantity,
                    "total_price": db_order.total_price,
                    "customer_name": db_order.customer_name,
                    "customer_email": db_order.customer_email,
                    "status": db_order.status,
                    "created_at": str(db_order.created_at)
                }
                await event_publisher.publish_order_created(order_data)
                logging.info(f"Order created event published for order {db_order.id}")
            except Exception as e:
                logging.error(f"Failed to publish order event: {e}")
                # Don't fail the order creation if event publishing fails
                pass
            
            return db_order
            
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail="Book service unavailable")

@app.get("/orders/{order_id}", response_model=OrderResponse)
async def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@app.put("/orders/{order_id}", response_model=OrderResponse)
async def update_order(order_id: int, order_update: OrderUpdate, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    update_data = order_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(order, field, value)
    
    db.commit()
    db.refresh(order)
    return order

@app.delete("/orders/{order_id}")
async def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    db.delete(order)
    db.commit()
    return {"message": "Order deleted successfully"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)
