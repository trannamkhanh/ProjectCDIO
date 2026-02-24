from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Backend OK"}

@app.get("/api/products")
def get_products():
    return [
        {
            "id": 1,
            "name": "Bánh mì cứu trợ",
            "price": 10000,
            "expiry": "2026-02-02"
        }
    ]
