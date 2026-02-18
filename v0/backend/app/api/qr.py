from fastapi import APIRouter, HTTPException, BackgroundTasks, Response
from pydantic import BaseModel
from app.db import db
from app.services.gemini import generate_review, generate_hash, calculate_similarity, GeneratedReview
from app.services.qrcode_generator import generate_qr_code_image
from nanoid import generate as nanoid
from datetime import datetime
import datetime as dt

router = APIRouter()

class ScanRequest(BaseModel):
    qrId: str
    deviceId: str
    sessionId: str

@router.get("/image/{qr_id}")
async def get_qr_image(qr_id: str):
    # Fetch QR to ensure it exists and get visit URL
    qr_code = await db.qrcode.find_unique(where={"id": qr_id})
    if not qr_code:
         raise HTTPException(status_code=404, detail="QR code not found")
         
    # Should be the visit URL
    visit_url = f"http://localhost:3000/visit/{qr_code.id}"
    
    # Generate image
    img_bytes = generate_qr_code_image(visit_url)
    
    return Response(content=img_bytes, media_type="image/png")

@router.post("/scan")
async def scan_qr(request: ScanRequest, background_tasks: BackgroundTasks):
    print(f"DEBUG: scan_qr called for {request.qrId}")
    qr_id = request.qrId
    device_id = request.deviceId
    session_id = request.sessionId

    if not qr_id:
        raise HTTPException(status_code=400, detail="qrId is required")

    # Fetch QR code
    print("DEBUG: fetching QR from DB")
    qr_code = await db.qrcode.find_unique(where={"id": qr_id})
    if not qr_code:
        print("DEBUG: QR not found")
        raise HTTPException(status_code=404, detail="QR code not found")
    print(f"DEBUG: stored QR found: {qr_code.id}")

    # Log scan
    print("DEBUG: creating scan log")
    await db.scanlog.create(data={
        "qrCodeId": qr_id,
        "deviceType": device_id,
        "action": "scan",
        "timestamp": datetime.now(),
    })
    print("DEBUG: scan log created")

    job_id = nanoid()

    # Generate review in background
    print("DEBUG: adding background task")
    background_tasks.add_task(process_review_generation, qr_code, job_id, session_id)

    return {
        "status": "accepted",
        "jobId": job_id,
        "googleMapsLink": qr_code.googleMapsLink,
    }

async def process_review_generation(qr_code, job_id, session_id):
    max_attempts = 3
    attempt = 0
    review = None

    while attempt < max_attempts and not review:
        attempt += 1
        
        try:
            generated: GeneratedReview = await generate_review(
                business_name=qr_code.businessName,
                product_summary=qr_code.productSummary or qr_code.businessName
            )
            
            review_hash = generate_hash(generated.reviewText)

            # Check for exact duplicates
            existing = await db.tempreview.find_first(where={"hash": review_hash})
            if existing:
                print(f"Duplicate review detected (attempt {attempt}), regenerating...")
                continue
            
            # Check for similar reviews (last 90 days)
            cutoff = datetime.now() - dt.timedelta(days=90)
            recent_reviews = await db.tempreview.find_many(
                where={
                    "qrCodeId": qr_code.id,
                    "createdAt": {"gte": cutoff}
                }
            )
            
            is_similar = False
            for r in recent_reviews:
                if calculate_similarity(r.reviewText, generated.reviewText) > 0.85:
                    is_similar = True
                    break
            
            if is_similar:
                print(f"Similar review detected (attempt {attempt}), regenerating...")
                continue
                
            # Store temp review
            expires_at = datetime.now() + dt.timedelta(minutes=30)
            review = await db.tempreview.create(data={
                "jobId": job_id,
                "qrCodeId": qr_code.id,
                "reviewText": generated.reviewText,
                "language": generated.language,
                "rating": generated.rating,
                "hash": review_hash,
                "sessionId": session_id,
                "expiresAt": expires_at
            })
            
            # Log generation
            await db.scanlog.create(data={
                "qrCodeId": qr_code.id,
                "jobId": job_id,
                "action": "review_generated",
                "timestamp": datetime.now()
            })
            
        except Exception as e:
            print(f"Error in review generation task: {e}")
            break
