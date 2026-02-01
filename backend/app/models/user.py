from pydantic import BaseModel, EmailStr
from typing import Optional

class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str

class UserCreate(BaseModel):
    """Schema for user registration"""
    name: str
    email: EmailStr
    password: str
    phone: str
    address: str
    role: str = "buyer"
    storeName: Optional[str] = None

class UserResponse(BaseModel):
    """Schema for user response (no password)"""
    id: int
    email: str
    role: str
    name: str
    phone: str
    address: Optional[str] = None
    storeName: Optional[str] = None
    verified: Optional[bool] = None
    active: bool

class UserInDB(UserResponse):
    """Schema for user in database (with password hash)"""
    password: str

class LoginResponse(BaseModel):
    """Schema for login response"""
    success: bool
    message: str
    user: Optional[UserResponse] = None
    token: Optional[str] = None
