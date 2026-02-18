from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.db import db
import json
import asyncio
from datetime import datetime

router = APIRouter()

class SubmitRequest(BaseModel):
    jobId: str
    reviewText: str

@router.get("/stream")
async def stream_review(jobId: str, request: Request):
    if not jobId:
        raise HTTPException(status_code=400, detail="jobId is required")

    async def event_generator():
        # Initial connection
        yield f": connected\n\n"
        
        timeout = 30 # seconds
        start_time = datetime.now()
        
        while True:
            # Check for timeout
            if (datetime.now() - start_time).seconds > timeout:
                yield f"data: {json.dumps({'type': 'timeout'})}\n\n"
                break
                
            # Check for disconnect
            if await request.is_disconnected():
                break

            try:
                review = await db.tempreview.find_unique(where={"jobId": jobId})
                
                if review:
                    data = json.dumps({
                        "type": "review_ready",
                        "jobId": review.jobId,
                        "reviewText": review.reviewText,
                        "language": review.language,
                        "rating": review.rating,
                    })
                    yield f"data: {data}\n\n"
                    break
            except Exception as e:
                print(f"Error polling: {e}")
                
            await asyncio.sleep(1)

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.post("/submit")
async def submit_review(body: SubmitRequest):
    job_id = body.jobId
    review_text = body.reviewText
    
    if not job_id or not review_text:
        raise HTTPException(status_code=400, detail="jobId and reviewText are required")

    temp_review = await db.tempreview.find_unique(where={"jobId": job_id})
    if not temp_review:
        raise HTTPException(status_code=404, detail="Review not found or expired")

    # Create permanent review
    review = await db.review.create(data={
        "qrCodeId": temp_review.qrCodeId,
        "reviewText": review_text,
        "language": temp_review.language,
        "rating": temp_review.rating,
        "source": "auto-gemini",
    })

    # Delete temp review
    await db.tempreview.delete(where={"jobId": job_id})

    # Log submission
    await db.scanlog.create(data={
        "qrCodeId": temp_review.qrCodeId,
        "jobId": job_id,
        "action": "review_submitted",
        "timestamp": datetime.now()
    })

    return {"success": True, "reviewId": review.id}
