from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all (for now)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PRODUCTS = [
    {
        "id": 1,
        "name": "Assam Tea",
        "slug": "assam-tea",
        "price": 250,
        "description": "Premium Assam tea"
    },
    {
        "id": 2,
        "name": "Organic Honey",
        "slug": "organic-honey",
        "price": 300,
        "description": "Pure natural honey"
    }
]

@app.get("/")
def home():
    return {"message": "Backend running"}

@app.get("/api/products")
def get_products():
    return PRODUCTS

@app.get("/api/products/{slug}")
def get_product(slug: str):
    for p in PRODUCTS:
        if p["slug"] == slug:
            return p
    return {"error": "Product not found"}