from typing import Optional, Dict, Any
from app.models.user import UserLogin, UserCreate, UserInDB
from app.utils.security import verify_password, get_password_hash, create_access_token
from app.database import users_db

class AuthService:
    """Service for authentication logic"""
    
    @staticmethod
    def authenticate_user(email: str, password: str) -> Optional[Dict[str, Any]]:
        """Authenticate user and return user data"""
        user = next((u for u in users_db if u["email"] == email), None)
        
        if not user:
            return None
        
        if not verify_password(password, user["password"]):
            return None
        
        if not user.get("active", True):
            return None
        
        return user
    
    @staticmethod
    def register_user(user_data: UserCreate) -> Dict[str, Any]:
        """Register a new user"""
        # Create new user
        new_user = {
            "id": len(users_db) + 1,
            "email": user_data.email,
            "password": get_password_hash(user_data.password),
            "role": user_data.role,
            "name": user_data.name,
            "phone": user_data.phone,
            "address": user_data.address,
            "active": True,
        }
        
        if user_data.role == "seller":
            new_user["storeName"] = user_data.storeName
            new_user["verified"] = False
        
        users_db.append(new_user)
        return new_user
    
    @staticmethod
    def create_user_token(user: Dict[str, Any]) -> str:
        """Create JWT token for user"""
        return create_access_token(
            data={
                "sub": user["email"],
                "role": user["role"],
                "id": user["id"]
            }
        )
