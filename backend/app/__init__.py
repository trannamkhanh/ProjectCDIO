from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, users
from app.config import settings

def create_app():
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.VERSION,
        description="Backend API for FoodRescue Application"
    )

    # CORS configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
    app.include_router(users.router, prefix="/api/users", tags=["Users"])

    @app.get("/")
    def root():
        return {"message": f"{settings.APP_NAME} is running"}

    return app
