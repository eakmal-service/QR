# Smart Auto-Review Configuration

⚠️ **IMPORTANT**: You need to add your Google Gemini API key to the `.env` file.

## Setup Steps

1. Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

2. Open the `.env` file in `qr-app` directory and replace `your_api_key_here` with your actual API key:
   ```
   GEMINI_API_KEY=your_actual_key_here
   ```

3. The database is already set up with sample QR codes:
   - `test-qr-1` - The Coffee House
   - `test-qr-2` - Tech Repair Shop
   - `test-qr-3` - Yoga Studio

## Testing the Feature

1. Start the development server from the `qr-app` directory:
   ```bash
   npm run dev
   ```

2. Visit one of the test URLs in your browser:
   - http://localhost:3001/visit/test-qr-1
   - http://localhost:3001/visit/test-qr-2
   - http://localhost:3001/visit/test-qr-3

3. The page should:
   - Show a loading spinner while generating the review
   - Display the AI-generated review with language and rating
   - Allow you to copy the review to clipboard
   - Let you edit the review before submitting
   - Submit the review to the database

## What Happens Behind the Scenes

1. **QR Scan**: When you visit `/visit/[qrId]`, the page POSTs to `/api/qr/scan`
2. **Review Generation**: Backend calls Gemini AI to generate a unique review
3. **Deduplication**: System checks for exact duplicates (hash) and similar reviews (Jaccard similarity)
4. **Real-time Delivery**: SSE stream pushes the review to the client when ready
5. **Submission**: User can edit and submit, which persists to the `Review` table

## Features Implemented

✅ Instant backend trigger on QR scan  
✅ Gemini AI review generation with randomized style & language  
✅ Deduplication + similarity check  
✅ Real-time delivery via Server-Sent Events  
✅ Copy to clipboard functionality  
✅ Review submission and persistence  
✅ Analytics logging (ScanLog table)  

## Database Schema

- **QRCode**: Business QR codes
- **TempReview**: Temporary reviews (30-minute expiry)
- **Review**: Permanent submitted reviews
- **ScanLog**: Analytics and event tracking
