from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel
import base64
from io import BytesIO
from PIL import Image

router = APIRouter()

class ImageConversionRequest(BaseModel):
    image: str  # Base64 encoded image

@router.post("/image-to-eps")
async def convert_image_to_eps(request: ImageConversionRequest):
    try:
        # Decode base64 image
        if "," in request.image:
            header, encoded = request.image.split(",", 1)
        else:
            encoded = request.image
            
        image_data = base64.b64decode(encoded)
        
        # Open image with Pillow
        img = Image.open(BytesIO(image_data))
        
        # Convert to RGB if RGBA (EPS doesn't support alpha channel well in some contexts, white bg is safer)
        if img.mode == 'RGBA':
            background = Image.new("RGB", img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[3]) # 3 is the alpha channel
            img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')
            
        # Save as EPS to buffer
        eps_buffer = BytesIO()
        img.save(eps_buffer, format='EPS')
        eps_buffer.seek(0)
        
        return Response(content=eps_buffer.getvalue(), media_type="application/postscript")
        
    except Exception as e:
        print(f"Error converting image to EPS: {e}")
        raise HTTPException(status_code=500, detail=str(e))
