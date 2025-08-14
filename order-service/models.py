from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base
from typing import Optional
from datetime import datetime

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)
    total_price = Column(Float, nullable=False)
    customer_name = Column(String(255), nullable=False)
    customer_email = Column(String(255), nullable=False)
    status = Column(String(50), default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class OrderCreate(BaseModel):
    book_id: int
    quantity: int
    customer_name: str
    customer_email: str

class OrderResponse(BaseModel):
    id: int
    book_id: int
    quantity: int
    total_price: float
    customer_name: str
    customer_email: str
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class OrderUpdate(BaseModel):
    status: Optional[str] = None
