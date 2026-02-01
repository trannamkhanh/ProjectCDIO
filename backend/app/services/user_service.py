from typing import Optional, List, Dict, Any
from app.database import users_db

class UserService:
    """Service for user management"""
    
    @staticmethod
    def get_all_users() -> List[Dict[str, Any]]:
        """Get all users without passwords"""
        return [
            {k: v for k, v in user.items() if k != "password"} 
            for user in users_db
        ]
    
    @staticmethod
    def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
        """Get user by email"""
        return next((u for u in users_db if u["email"] == email), None)
    
    @staticmethod
    def get_user_by_id(user_id: int) -> Optional[Dict[str, Any]]:
        """Get user by ID"""
        return next((u for u in users_db if u["id"] == user_id), None)
    
    @staticmethod
    def user_exists(email: str) -> bool:
        """Check if user exists"""
        return any(u["email"] == email for u in users_db)
