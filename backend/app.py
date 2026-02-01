"""
FoodRescue Backend API - Main Entry Point
"""
import uvicorn
from app import create_app
from app.database import init_database

init_database()

app = create_app()

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=True  
    )
