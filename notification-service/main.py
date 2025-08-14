from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import logging
from dotenv import load_dotenv
import asyncio
from event_consumer import EventConsumer

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Notification Service", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.on_event("startup")
async def startup_event():
    """Start the event consumer on startup"""
    try:
        consumer = EventConsumer()
        # Start the event consumer in the background
        asyncio.create_task(consumer.setup_consumers())
        logger.info("Event consumer started successfully")
    except Exception as e:
        logger.error(f"Failed to start event consumer: {e}")

@app.get("/")
async def root():
    return {"message": "Notification Service is running (Event-Driven Mode)"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "mode": "event-driven"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8003)
