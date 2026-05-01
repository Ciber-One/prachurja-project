from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, UploadFile, File, Response, Depends
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import bcrypt
import jwt
import os
import logging
import requests
import uuid
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional

# DB
# mongo_url = os.environ['MONGO_URL']
# client = AsyncIOMotorClient(mongo_url)
# db = client[os.environ['DB_NAME']]

# JWT Config
JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = "HS256"

# Object Storage
STORAGE_URL = "https://integrations.emergentagent.com/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
APP_NAME = "prachurja"
storage_key = None

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ─── Helpers ───

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))

def create_access_token(user_id: str, email: str) -> str:
    return jwt.encode({"sub": user_id, "email": email, "exp": datetime.now(timezone.utc) + timedelta(hours=24), "type": "access"}, JWT_SECRET, algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    return jwt.encode({"sub": user_id, "exp": datetime.now(timezone.utc) + timedelta(days=7), "type": "refresh"}, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# def init_storage():
    global storage_key
    if storage_key:
        return storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
    resp.raise_for_status()
    storage_key = resp.json()["storage_key"]
    return storage_key

def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = requests.put(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key, "Content-Type": content_type}, data=data, timeout=120)
    resp.raise_for_status()
    return resp.json()

def get_object(path: str):
    key = init_storage()
    resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")

# ─── Models ───

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    tagline: str
    description: str
    benefits: List[str]
    origin: str
    price: int
    price_label: str
    category: str
    image_url: str
    usage: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    subject: str
    message: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ContactMessageCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    email: str = Field(..., min_length=3, max_length=200, pattern=r'^[^@\s]+@[^@\s]+\.[^@\s]+$')
    subject: str = Field(..., min_length=1, max_length=500)
    message: str = Field(..., min_length=1, max_length=5000)

class OrderItem(BaseModel):
    product_slug: str
    product_name: str
    price: int
    quantity: int
    image_url: str = ""

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    customer_phone: str
    customer_email: str = ""
    shipping_address: str
    shipping_city: str
    shipping_pincode: str
    notes: str = ""
    items: List[OrderItem]
    total_amount: int
    status: str = "pending"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class OrderCreate(BaseModel):
    customer_name: str = Field(..., min_length=1)
    customer_phone: str = Field(..., min_length=1)
    customer_email: str = ""
    shipping_address: str = Field(..., min_length=1)
    shipping_city: str = Field(..., min_length=1)
    shipping_pincode: str = Field(..., min_length=1)
    notes: str = ""
    items: List[OrderItem] = Field(..., min_length=1)
    total_amount: int

class LoginInput(BaseModel):
    email: str
    password: str

class ProductCreate(BaseModel):
    name: str = Field(..., min_length=1)
    slug: str = Field(..., min_length=1)
    tagline: str = ""
    description: str = ""
    benefits: List[str] = []
    origin: str = ""
    price: int = 0
    price_label: str = ""
    category: str = ""
    image_url: str = ""
    usage: str = ""

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    benefits: Optional[List[str]] = None
    origin: Optional[str] = None
    price: Optional[int] = None
    price_label: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    usage: Optional[str] = None

# ─── Seed Data ───

PRODUCTS_SEED = [
    {"name":"Assam Tea","slug":"assam-tea","tagline":"The finest leaves from the world's largest tea-growing region","description":"Our Assam Tea is hand-picked from the lush gardens of Upper Assam, known worldwide for its rich, malty flavor and deep amber color. Each leaf is carefully selected during the second flush season when the tea reaches its peak character.","benefits":["Rich in antioxidants and polyphenols","Boosts energy naturally with balanced caffeine","Supports heart health and digestion","Hand-picked from certified organic gardens","Second flush harvest for peak flavor"],"origin":"Sourced directly from family-owned tea estates in the Dibrugarh district of Upper Assam.","price":499,"price_label":"250g Pack","category":"tea","image_url":"https://images.pexels.com/photos/9025660/pexels-photo-9025660.jpeg","usage":"Brew 1 teaspoon per cup in freshly boiled water for 3-5 minutes."},
    {"name":"Organic Honey","slug":"organic-honey","tagline":"Pure, raw honey from the forests of Assam","description":"Harvested from wild bee colonies in the dense forests of Karbi Anglong and Kaziranga, our organic honey is 100% raw and unprocessed.","benefits":["100% raw and unprocessed","Natural immunity booster","Rich in enzymes, vitamins, and antioxidants","No added sugar or artificial preservatives","Supports local beekeeping communities"],"origin":"Ethically harvested from wild bee colonies in the forests surrounding Kaziranga National Park.","price":599,"price_label":"500g Jar","category":"honey","image_url":"https://images.pexels.com/photos/8500508/pexels-photo-8500508.jpeg","usage":"Take a spoonful daily, drizzle over toast, or stir into lukewarm water with lemon."},
    {"name":"Bamboo Craft Collection","slug":"bamboo-craft-collection","tagline":"Handwoven artistry from Assam's master craftspeople","description":"Each piece in our bamboo collection is handcrafted by skilled artisans from the Bodo and Mishing communities of Assam.","benefits":["Handcrafted by indigenous artisans","100% natural and eco-friendly","Durable and lightweight","Supports traditional craft communities","Each piece is unique"],"origin":"Crafted in the villages of Baksa and Udalguri districts by Bodo community artisans.","price":799,"price_label":"Starting Price","category":"bamboo","image_url":"https://static.prod-images.emergentagent.com/jobs/0d90bd11-046c-44de-8266-6ee207c08c0e/images/b619ad1bdb76544f5b9006bcd6ace7e6de697e8280ed5b1b341d78db8b2e933c.png","usage":"Use as home decor, functional kitchenware, or gift items."},
    {"name":"Traditional Assamese Dress","slug":"traditional-assamese-dress","tagline":"The timeless elegance of Assamese silk weaving","description":"Our Mekhela Sador collection features authentic handloom pieces woven by master weavers of Sualkuchi.","benefits":["Authentic handloom weave from Sualkuchi","Premium Muga, Pat, or Eri silk","Traditional Assamese motifs","Perfect for festive occasions","Supports master weaver communities"],"origin":"Woven in Sualkuchi, Kamrup district, where over 10,000 families are engaged in silk weaving.","price":2999,"price_label":"Per Set","category":"handloom","image_url":"https://static.prod-images.emergentagent.com/jobs/0d90bd11-046c-44de-8266-6ee207c08c0e/images/e8b55c1fd0d1bd81e5964c7f5b8b0cfe5b24344d76b89b0efdb8bc02bdb66ced.png","usage":"Drape as a traditional two-piece garment. Dry clean recommended."},
    {"name":"Joha Rice","slug":"joha-rice","tagline":"Assam's aromatic heritage grain with a natural fragrance","description":"Joha Rice is a prized aromatic short-grain rice variety indigenous to Assam, cultivated organically in the fertile Brahmaputra valley.","benefits":["Naturally aromatic without additives","Organically grown in Assam","Rich in essential minerals and fiber","Low glycemic index","Heritage grain preserved by local farmers"],"origin":"Cultivated in the alluvial plains of Nagaon and Morigaon districts along the Brahmaputra river.","price":349,"price_label":"1kg Pack","category":"rice","image_url":"https://static.prod-images.emergentagent.com/jobs/0d90bd11-046c-44de-8266-6ee207c08c0e/images/99382bb257a48193c1b8910228654ebacb33a54545cb2fdc34358d321a1984e3.png","usage":"Wash and soak for 30 minutes. Use 1:1.5 rice-to-water ratio."}
]

async def seed_products():
    count = await db.products.count_documents({})
    if count == 0:
        for p in PRODUCTS_SEED:
            product = Product(**p)
            await db.products.insert_one(product.model_dump())
        logger.info("Seeded 5 products")

async def seed_admin():
    email = os.environ.get("ADMIN_EMAIL", "admin@prachurja.in")
    password = os.environ.get("ADMIN_PASSWORD", "Prachurja@2026")
    existing = await db.users.find_one({"email": email})
    if not existing:
        hashed = hash_password(password)
        await db.users.insert_one({"email": email, "password_hash": hashed, "name": "Admin", "role": "admin", "created_at": datetime.now(timezone.utc).isoformat()})
        logger.info(f"Admin user created: {email}")
    elif not verify_password(password, existing["password_hash"]):
        await db.users.update_one({"email": email}, {"$set": {"password_hash": hash_password(password)}})
        logger.info("Admin password updated")

@app.on_event("startup")
async def startup():
    await seed_products()
    await seed_admin()
    await db.users.create_index("email", unique=True)
    try:
        init_storage()
        logger.info("Object storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")
    # Write test credentials
    try:
        os.makedirs("/app/memory", exist_ok=True)
        with open("/app/memory/test_credentials.md", "w") as f:
            f.write(f"# Test Credentials\n\n## Admin\n- Email: {os.environ.get('ADMIN_EMAIL')}\n- Password: {os.environ.get('ADMIN_PASSWORD')}\n- Role: admin\n\n## Auth Endpoints\n- POST /api/auth/login\n- POST /api/auth/logout\n- GET /api/auth/me\n")
    except Exception:
        pass

# ─── Public Routes ───

@api_router.get("/")
async def root():
    return {"message": "Prachurja API"}

@api_router.get("/products")
async def get_products():
    return PRODUCTS_SEED

@api_router.get("/products/{slug}")
async def get_product(slug: str):
    for p in PRODUCTS_SEED:
        if p["slug"] == slug:
            return p
    raise HTTPException(status_code=404, detail="Product not found")

@api_router.get("/products/category/{category}", response_model=List[Product])
async def get_products_by_category(category: str):
    return await db.products.find({"category": category}, {"_id": 0}).to_list(100)

@api_router.post("/contact")
async def create_contact(input: ContactMessageCreate):
    msg = ContactMessage(**input.model_dump())
    await db.contact_messages.insert_one(msg.model_dump())
    return {"message": "Thank you for reaching out!", "id": msg.id}

@api_router.post("/orders")
async def create_order(input: OrderCreate):
    order = Order(**input.model_dump())
    await db.orders.insert_one(order.model_dump())
    return {"message": "Order placed successfully!", "id": order.id, "status": order.status}

@api_router.get("/orders/{order_id}")
async def get_order(order_id: str):
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

# ─── Auth Routes ───

@api_router.post("/auth/login")
async def login(input: LoginInput):
    email = input.email.strip().lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(input.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    user_id = str(user["_id"])
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    response = JSONResponse(content={"id": user_id, "email": user["email"], "name": user.get("name", ""), "role": user.get("role", "user")})
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=86400, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    return response

@api_router.post("/auth/logout")
async def logout():
    response = JSONResponse(content={"message": "Logged out"})
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return response

@api_router.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user

@api_router.post("/auth/refresh")
async def refresh(request: Request):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        new_access = create_access_token(str(user["_id"]), user["email"])
        response = JSONResponse(content={"message": "Token refreshed"})
        response.set_cookie(key="access_token", value=new_access, httponly=True, secure=False, samesite="lax", max_age=86400, path="/")
        return response
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

# ─── Admin Routes ───

@api_router.get("/admin/dashboard")
async def admin_dashboard(user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    total_products = await db.products.count_documents({})
    total_orders = await db.orders.count_documents({})
    pending_orders = await db.orders.count_documents({"status": "pending"})
    total_contacts = await db.contact_messages.count_documents({})
    # Revenue
    pipeline = [{"$group": {"_id": None, "total": {"$sum": "$total_amount"}}}]
    revenue_result = await db.orders.aggregate(pipeline).to_list(1)
    total_revenue = revenue_result[0]["total"] if revenue_result else 0
    # Recent orders
    recent_orders = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(5)
    return {
        "total_products": total_products,
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "total_contacts": total_contacts,
        "total_revenue": total_revenue,
        "recent_orders": recent_orders,
    }

@api_router.get("/admin/orders")
async def admin_list_orders(user: dict = Depends(get_current_user), status: str = None, page: int = 1, limit: int = 20):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    query = {}
    if status and status != "all":
        query["status"] = status
    skip = (page - 1) * limit
    total = await db.orders.count_documents(query)
    orders = await db.orders.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    return {"orders": orders, "total": total, "page": page, "pages": (total + limit - 1) // limit}

@api_router.put("/admin/orders/{order_id}/status")
async def admin_update_order_status(order_id: str, body: dict, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    new_status = body.get("status")
    if new_status not in ["pending", "confirmed", "shipped", "delivered", "cancelled"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    result = await db.orders.update_one({"id": order_id}, {"$set": {"status": new_status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order status updated", "status": new_status}

@api_router.get("/admin/products")
async def admin_list_products(user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return await db.products.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)

@api_router.post("/admin/products")
async def admin_create_product(input: ProductCreate, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    existing = await db.products.find_one({"slug": input.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Product with this slug already exists")
    product = Product(**input.model_dump())
    await db.products.insert_one(product.model_dump())
    return {"message": "Product created", "id": product.id}

@api_router.put("/admin/products/{product_id}")
async def admin_update_product(product_id: str, input: ProductUpdate, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.products.update_one({"id": product_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product updated"}

@api_router.delete("/admin/products/{product_id}")
async def admin_delete_product(product_id: str, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted"}

@api_router.get("/admin/contacts")
async def admin_list_contacts(user: dict = Depends(get_current_user), page: int = 1, limit: int = 20):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    skip = (page - 1) * limit
    total = await db.contact_messages.count_documents({})
    contacts = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    return {"contacts": contacts, "total": total, "page": page, "pages": (total + limit - 1) // limit}

@api_router.post("/admin/upload")
async def admin_upload(file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    allowed = {"image/jpeg", "image/png", "image/webp", "image/gif"}
    if file.content_type not in allowed:
        raise HTTPException(status_code=400, detail="Only image files (JPEG, PNG, WebP, GIF) allowed")
    data = await file.read()
    if len(data) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size must be under 5MB")
    ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    path = f"{APP_NAME}/products/{uuid.uuid4()}.{ext}"
    result = put_object(path, data, file.content_type)
    return {"path": result["path"], "url": f"/api/files/{result['path']}"}

@api_router.get("/files/{path:path}")
async def serve_file(path: str):
    try:
        data, content_type = get_object(path)
        return Response(content=data, media_type=content_type)
    except Exception:
        raise HTTPException(status_code=404, detail="File not found")

# ─── App Setup ───

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
