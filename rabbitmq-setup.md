#!/usr/bin/env python3
"""
Test script to verify RabbitMQ connection
"""
import pika
import sys

def test_rabbitmq_connection(url="amqp://guest:guest@localhost:5672/"):
    """Test RabbitMQ connection"""
    try:
        connection = pika.BlockingConnection(pika.URLParameters(url))
        channel = connection.channel()
        
        # Test basic operations
        channel.queue_declare(queue='test_queue', durable=True)
        channel.basic_publish(
            exchange='',
            routing_key='test_queue',
            body='Hello RabbitMQ!',
            properties=pika.BasicProperties(delivery_mode=2)
        )
        
        print("✅ RabbitMQ connection successful!")
        print(f"✅ Connected to: {url}")
        
        connection.close()
        return True
        
    except Exception as e:
        print(f"❌ RabbitMQ connection failed: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) > 1:
        url = sys.argv[1]
    else:
        url = "amqp://guest:guest@localhost:5672/"
    
    print(f"Testing RabbitMQ connection to: {url}")
    test_rabbitmq_connection(url)
