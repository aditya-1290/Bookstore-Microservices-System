import json
import asyncio
import logging
from typing import Dict, Any
import aio_pika
from aio_pika import ExchangeType
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib
import os
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

class EventConsumer:
    def __init__(self, rabbitmq_url: str = "amqp://guest:guest@localhost:5672/"):
        self.rabbitmq_url = rabbitmq_url
        self.connection = None
        self.channel = None
        
    async def connect(self):
        """Establish connection to RabbitMQ"""
        try:
            self.connection = await aio_pika.connect_robust(self.rabbitmq_url)
            self.channel = await self.connection.channel()
            # Set QoS to 1 message at a time
            await self.channel.set_qos(prefetch_count=1)
            logger.info("Connected to RabbitMQ for event consumption")
        except Exception as e:
            logger.error(f"Failed to connect to RabbitMQ: {e}")
            raise
            
    async def setup_consumers(self):
        """Setup RabbitMQ consumers"""
        await self.connect()
        
        # Declare exchange
        exchange = await self.channel.declare_exchange(
            "order_events",
            ExchangeType.TOPIC,
            durable=True
        )
        
        # Declare queue
        queue = await self.channel.declare_queue(
            "notification_queue",
            durable=True
        )
        
        # Bind queue to exchange
        await queue.bind(exchange, routing_key="order.created")
        
        # Start consuming messages
        async with queue.iterator() as queue_iter:
            async for message in queue_iter:
                async with message.process():
                    try:
                        body = json.loads(message.body.decode())
                        await self.handle_order_created(body)
                    except Exception as e:
                        logger.error(f"Error processing message: {e}")
                        
    async def handle_order_created(self, event_data: Dict[str, Any]):
        """Handle order created event"""
        order_details = event_data.get("order_details", {})
        order_id = order_details.get("id")
        customer_email = order_details.get("customer_email")
        customer_name = order_details.get("customer_name")
        
        logger.info(f"Processing order created event for order {order_id}")
        
        # Send email notification
        await self.send_order_confirmation_email(
            order_id=order_id,
            customer_email=customer_email,
            customer_name=customer_name,
            order_data=order_details
        )
        
    async def send_order_confirmation_email(
        self, 
        order_id: int, 
        customer_email: str, 
        customer_name: str, 
        order_data: Dict[str, Any]
    ):
        """Send order confirmation email"""
        try:
            # Email configuration
            smtp_server = os.getenv("SMTP_SERVER", "smtp.sendgrid.net")
            smtp_port = int(os.getenv("SMTP_PORT", "587"))
            smtp_username = os.getenv("SMTP_USERNAME", "apikey")
            smtp_password = os.getenv("SMTP_PASSWORD")
            from_email = os.getenv("FROM_EMAIL", "noreply@bookstore.com")
            from_name = os.getenv("FROM_NAME", "Book Store Notifications")
            
            # Email content
            subject = f"Order Confirmation - Order #{order_id}"
            
            # Plain text body
            body = f"""
Dear {customer_name},

Thank you for your order! Here are the details:

Order ID: {order_id}
Book ID: {order_data.get('book_id')}
Quantity: {order_data.get('quantity')}
Total Price: ${order_data.get('total_price')}
Status: {order_data.get('status', 'pending')}

Your order has been received and is being processed. You will receive another email when your order is ready.

Best regards,
Book Store Team
            """
            
            # HTML body
            html_body = f"""
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2c3e50;">Order Confirmation</h2>
        <p>Dear <strong>{customer_name}</strong>,</p>
        <p>Thank you for your order! Here are the details:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order #{order_id}</h3>
            <p><strong>Book ID:</strong> {order_data.get('book_id')}</p>
            <p><strong>Quantity:</strong> {order_data.get('quantity')}</p>
            <p><strong>Total Price:</strong> ${order_data.get('total_price')}</p>
            <p><strong>Status:</strong> <span style="color: #28a745;">{order_data.get('status', 'pending')}</span></p>
        </div>
        
        <p>Your order has been received and is being processed. You will receive another email when your order is ready.</p>
        
        <p>Best regards,<br>
        <strong>Book Store Team</strong></p>
    </div>
</body>
</html>
            """
            
            # Create message
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"{from_name} <{from_email}>"
            msg["To"] = customer_email

            # Add plain text part
            text_part = MIMEText(body, "plain")
            msg.attach(text_part)

            # Add HTML part
            html_part = MIMEText(html_body, "html")
            msg.attach(html_part)

            # Connect to SMTP server and send email
            with smtplib.SMTP(smtp_server, smtp_port) as server:
                server.starttls()
                server.login(smtp_username, smtp_password)
                server.send_message(msg)
            
            logger.info(f"✅ Email sent successfully to {customer_email} for order {order_id}")
            
        except Exception as e:
            logger.error(f"Error sending email: {e}")
            raise

async def start_event_consumer():
    """Start the event consumer"""
    consumer = EventConsumer()
    await consumer.setup_consumers()

if __name__ == "__main__":
    asyncio.run(start_event_consumer())
