from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.api import qr, reviews, admin, conversion
from app.db import db
import os
from dotenv import load_dotenv

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Connect to database on startup
    await db.connect()
    yield
    # Disconnect from database on shutdown
    await db.disconnect()

app = FastAPI(title="QR Generator Backend", lifespan=lifespan)

# Allow CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(qr.router, prefix="/api/qr", tags=["QR"])
app.include_router(reviews.router, prefix="/api/reviews", tags=["Reviews"])
app.include_router(conversion.router, prefix="/api/convert", tags=["Conversion"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])

@app.get("/")
def read_root():
    return {"status": "ok", "message": "QR Generator Backend Running"}
