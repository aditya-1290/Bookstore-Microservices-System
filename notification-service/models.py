from pydantic import BaseModel

class NotificationRequest(BaseModel):
    order_id: int

class NotificationResponse(BaseModel):
    message: str
    order_id: int
    customer_email: str
    status: str
