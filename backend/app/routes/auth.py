from fastapi import APIRouter, HTTPException
from app.models.user import UserLogin, UserCreate, LoginResponse
from app.services.auth_service import AuthService
from app.services.user_service import UserService

router = APIRouter()

@router.post("/login", response_model=LoginResponse)
def login(credentials: UserLogin):
    """Login endpoint"""
    user = AuthService.authenticate_user(credentials.email, credentials.password)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create access token
    access_token = AuthService.create_user_token(user)
    
    # Remove password from response
    user_data = {k: v for k, v in user.items() if k != "password"}
    
    return {
        "success": True,
        "message": "Login successful",
        "user": user_data,
        "token": access_token
    }

@router.post("/register", response_model=LoginResponse)
def register(user_data: UserCreate):
    """Register new user endpoint"""
    # Check if user already exists
    if UserService.user_exists(user_data.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    new_user = AuthService.register_user(user_data)
    
    # Create access token
    access_token = AuthService.create_user_token(new_user)
    
    # Remove password from response
    user_response = {k: v for k, v in new_user.items() if k != "password"}
    
    return {
        "success": True,
        "message": "Registration successful",
        "user": user_response,
        "token": access_token
    }
