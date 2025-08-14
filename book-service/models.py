from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, Float
from database import Base

class Book(Base):
    __tablename__ = "books"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    author = Column(String(255))
    price = Column(Float)
    stock = Column(Integer, default=0)

class BookCreate(BaseModel):
    title: str
    author: str
    price: float
    stock: int = 0

class BookResponse(BaseModel):
    id: int
    title: str
    author: str
    price: float
    stock: int
    
    class Config:
        from_attributes = True

class BookUpdate(BaseModel):
    title: str = None
    author: str = None
    price: float = None
    stock: int = None
