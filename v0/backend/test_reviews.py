import asyncio
import httpx
import time

async def main():
    # Loop to generate multiple reviews and check variance
    for i in range(5):
        print(f"\n--- Review Request {i+1} ---")
        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                # 1. Ensure QR exists (Creating a new one or using consistent ID)
                # For simplicity, let's reuse a known ID if possible or just rely on scan logic
                # Actually, scan requires valid QR ID. Ideally we create one.
                # But creating is complex without admin setup.
                # Let's list QRs first to pick one.
                
                # List QRs
                list_resp = await client.get("http://127.0.0.1:8001/api/admin/qr-codes/list")
                if list_resp.status_code == 200:
                    qrs = list_resp.json().get("qrCodes", [])
                    if qrs:
                        qr_id = qrs[0]['id']
                        print(f"Using QR ID: {qr_id}")
                        
                        # Scan
                        scan_payload = {
                            "qrId": qr_id,
                            "deviceId": f"test-device-{i}",
                            "sessionId": f"test-session-{i}"
                        }
                        scan_resp = await client.post("http://127.0.0.1:8001/api/qr/scan", json=scan_payload)
                        print(f"Scan Status: {scan_resp.status_code}")
                        
                        # Since we can't easily capture the background task output here without checking DB or logs
                        # I will rely on reading uvicorn.log later to see the generated text.
                    else:
                        print("No QR codes found to scan.")
                else:
                    print("Failed to list QR codes.")

            except Exception as e:
                print(f"Error: {e}")
            
        # Wait a bit between requests to avoid overwhelming
        await asyncio.sleep(2)

if __name__ == "__main__":
    asyncio.run(main())
