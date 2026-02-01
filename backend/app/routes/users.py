from fastapi import APIRouter
from typing import List
from app.services.user_service import UserService

router = APIRouter()

@router.get("")
def get_users():
    """Get all users (admin only - TODO: add authentication)"""
    return UserService.get_all_users()

@router.get("/{user_id}")
def get_user(user_id: int):
    """Get user by ID"""
    user = UserService.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Remove password
    return {k: v for k, v in user.items() if k != "password"}
