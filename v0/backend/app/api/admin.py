from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.db import db
from nanoid import generate as nanoid
from typing import Optional, Any, Dict, List
import datetime
import json

router = APIRouter()

class CreateQRRequest(BaseModel):
    businessName: str
    productSummary: Optional[str] = None
    businessId: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    googleMapsLink: Optional[str] = None
    businessType: Optional[str] = None
    location: Optional[str] = None

@router.post("/qr-codes/create")
async def create_qr_code(body: CreateQRRequest):
    if not body.businessName:
         raise HTTPException(status_code=400, detail="businessName is required")

    qr_id = body.businessId or f"qr-{nanoid(10)}"
    
    try:
        qr_code = await db.qrcode.create(data={
            "id": qr_id,
            "businessId": body.businessId or qr_id,
            "businessName": body.businessName,
            "productSummary": body.productSummary or body.businessName,
            "googleMapsLink": body.googleMapsLink,
            "businessType": body.businessType,
            "location": body.location,
            "metadata": json.dumps(body.metadata) if body.metadata else None
        })
        
        # In a real scenario URL logic might need adjustment based on environ
        visit_url = f"http://localhost:3000/visit/{qr_code.id}" 
        
        return {
            "success": True,
            "qrCode": {
                "id": qr_code.id,
                "businessName": qr_code.businessName,
                "productSummary": qr_code.productSummary,
                "visitUrl": visit_url,
                "createdAt": qr_code.createdAt
            }
        }
    except Exception as e:
        print(f"Error creating QR: {e}")
        raise HTTPException(status_code=500, detail="Failed to create QR code")

@router.get("/qr-codes/list")
async def list_qr_codes():
    try:
        qr_codes = await db.qrcode.find_many(
            include={
                "reviews": True, # Optimized query would use _count but prisma python might access differently or manually count
                "scanLogs": True
            },
            order={"createdAt": "desc"}
        )
        
        result = []
        for qr in qr_codes:
            scans = len([log for log in qr.scanLogs if log.action == 'scan'])
            submissions = len([log for log in qr.scanLogs if log.action == 'review_submitted'])
            
            ratings = [r.rating for r in qr.reviews]
            avg_rating = sum(ratings) / len(ratings) if ratings else 0
            
            conversion_rate = f"{(submissions / scans * 100):.1f}%" if scans > 0 else "0%"
            
            result.append({
                "id": qr.id,
                "businessName": qr.businessName,
                "productSummary": qr.productSummary,
                "createdAt": qr.createdAt,
                "visitUrl": f"http://localhost:3000/visit/{qr.id}",
                "analytics": {
                    "totalScans": scans,
                    "totalReviews": len(qr.reviews), # Using len of included list for now
                    "totalSubmissions": submissions,
                    "averageRating": round(avg_rating, 1),
                    "conversionRate": conversion_rate
                }
            })
            
        return {"success": True, "qrCodes": result}

    except Exception as e:
        print(f"Error listing QR codes: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch QR codes")
