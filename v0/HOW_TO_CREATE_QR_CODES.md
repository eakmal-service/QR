# Creating & Using QR Codes for Smart Auto-Review

## 🎯 Overview

There are **3 ways** to create QR codes for the Smart Auto-Review feature:

1. **Admin Interface** (Easiest - Coming below)
2. **API Endpoint** (Programmatic)
3. **Direct Database** (For testing)

---

## Method 1: Admin Interface (Recommended)

### I'll create an admin page at `/admin/qr-codes` where you can:
- ✅ Create new QR codes for businesses
- ✅ Generate actual QR code images
- ✅ Download QR codes as PNG/SVG
- ✅ View all existing QR codes
- ✅ See analytics for each QR

---

## Method 2: API Endpoint

### Create QR Code via API

**Endpoint**: `POST /api/admin/qr-codes/create`

**Request Body**:
```json
{
  "businessName": "My Coffee Shop",
  "productSummary": "Premium artisan coffee and fresh pastries",
  "businessId": "business-123",
  "metadata": {
    "location": "Downtown",
    "contact": "+1234567890"
  }
}
```

**Response**:
```json
{
  "success": true,
  "qrCode": {
    "id": "clx9876xyz",
    "businessName": "My Coffee Shop",
    "qrUrl": "http://localhost:3000/visit/clx9876xyz",
    "createdAt": "2025-11-25T..."
  }
}
```

---

## Method 3: Direct Database

### Using Prisma Studio

1. Open Prisma Studio:
```bash
cd v0
npx prisma studio
```

2. Navigate to the `QRCode` table

3. Click "Add Record"

4. Fill in:
   - `id`: Any unique ID (e.g., "coffee-shop-1")
   - `businessId`: Your business identifier
   - `businessName`: "My Coffee Shop"
   - `productSummary`: "Great coffee and snacks"
   - `metadata`: `{"location": "Main St"}`

5. Click Save

---

## 📱 How to Use the Feature

### Step-by-Step User Flow

#### 1. **Create a QR Code** (Business Owner)
- Use the admin interface (see below)
- Enter business details
- Generate & download QR code image

#### 2. **Display QR Code** (Business Owner)
- Print the QR code
- Place it on:
  - Table tents in restaurant
  - Store counter
  - Product packaging
  - Business cards
  - Storefront window

#### 3. **Customer Scans QR** (Customer)
- Customer uses phone camera to scan
- Opens link: `https://yourdomain.com/visit/[qrId]`

#### 4. **AI Generates Review** (Automatic)
- Backend calls Gemini API
- Generates unique review in random language
- Shows loading spinner to customer

#### 5. **Customer Sees Review** (Customer)
- Review appears in 2-5 seconds
- Language tag shown (English/Hindi/Gujarati/Hinglish)
- Rating displayed (1-5 stars)

#### 6. **Customer Edits & Submits** (Customer)
- Can edit the review text
- Click "Copy to Clipboard" to copy
- Click "Submit Review" to save
- See success confirmation

---

## 🖼️ Generating Actual QR Code Images

### Using the QR Code Component

The v0 project already has a QR code generator! We can integrate it:

```typescript
import { QRCodeSVG } from 'qrcode.react';

// Generate QR code for visit URL
<QRCodeSVG 
  value="https://yourdomain.com/visit/coffee-shop-1"
  size={256}
  level="H"
  includeMargin={true}
/>
```

---

## 🎨 QR Code URL Format

### The URL Structure

```
https://yourdomain.com/visit/[qrId]
                              ^^^^^^
                              This is the QR code ID from database
```

### Examples:
- Test QR 1: `http://localhost:3000/visit/test-qr-1`
- Test QR 2: `http://localhost:3000/visit/test-qr-2`
- Your QR: `http://localhost:3000/visit/your-business-id`

---

## 📊 Complete Flow Diagram

```
Business Owner                    Customer                    System
     |                               |                          |
     |------ Create QR Code -------->|                          |
     |       (Admin Interface)       |                          |
     |                               |                          |
     |<----- QR Image Generated -----|                          |
     |                               |                          |
     |------ Print & Display ------->|                          |
     |                               |                          |
     |                               |------ Scan QR ---------->|
     |                               |                          |
     |                               |                   Generate Review
     |                               |                    (Gemini AI)
     |                               |                          |
     |                               |<----- Review Ready ------|
     |                               |      (via SSE)           |
     |                               |                          |
     |                               |------ Edit Review ------>|
     |                               |                          |
     |                               |------ Submit ----------->|
     |                               |                          |
     |                               |<----- Success ----------|
     |                               |                          |
     |<----- View Analytics ---------|                          |
     |       (Admin Dashboard)       |                          |
```

---

## 🔧 Next Steps

I'll now create:
1. **Admin Interface** at `/admin/qr-codes`
2. **API Endpoint** for programmatic creation
3. **QR Code Generator Component** integrated with your existing QR generator

Would you like me to build these now?
