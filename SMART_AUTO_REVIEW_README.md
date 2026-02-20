# Smart Auto-Review - V0 Project

## ✨ Features Implemented

- 🤖 **AI-Powered Review Generation**: Uses Google Gemini to create unique, human-like reviews
- 🌍 **Multi-Language Support**: Generates reviews in English, Hindi, Gujarati, and Hinglish
- 🔄 **Real-time Delivery**: Server-Sent Events (SSE) push reviews to clients instantly
- 🚫 **Deduplication**: Prevents duplicate and similar reviews using hash + Jaccard similarity
- 📋 **Clipboard Integration**: Easy copy-paste functionality
- 💾 **Database Persistence**: SQLite with Prisma ORM
- 📊 **Analytics**: Tracks scans, generations, and submissions

## 🚀 Quick Start

### 1. Add Your Gemini API Key

Create a `.env.local` file in the `v0` directory:

```bash
GOOGLE_API_KEY=your_api_key_here
```

Get your API key from: https://aistudio.google.com/app/apikey

> ⚠️ **SECURITY WARNING**: Never commit your `.env.local` file to a public repository like GitHub. Ensure `.env.local` is listed in your `.gitignore` file to prevent leaking your API keys.

### 2. Start the Development Server

```bash
npm run dev
```

### 3. Test the Feature

Visit the test page: http://localhost:3000/test-review

Click on any QR code to see the Smart Auto-Review feature in action!

## 📁 File Structure

```
v0/
├── app/
│   ├── api/
│   │   ├── qr/scan/route.ts          # QR scan endpoint
│   │   └── reviews/
│   │       ├── stream/route.ts       # SSE endpoint
│   │       └── submit/route.ts       # Review submission
│   ├── visit/[qrId]/page.tsx         # Landing page
│   └── test-review/page.tsx          # Test page
├── lib/
│   ├── prisma.ts                     # Prisma client
│   └── gemini.ts                     # AI service
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── seed.ts                       # Test data
└── .env.local                        # Environment variables
```

## 🔧 Database Schema

- **QRCode**: Business QR codes
- **TempReview**: Temporary AI-generated reviews (30min expiry)
- **Review**: Permanent submitted reviews
- **ScanLog**: Analytics and event tracking

## 🧪 Testing

1. Navigate to http://localhost:3000/test-review
2. Click on "The Coffee House", "Tech Repair Shop", or "Yoga Studio"
3. Watch the AI generate a unique review in real-time
4. Edit the review if needed
5. Copy to clipboard or submit directly

## 📊 Test QR Codes

- **test-qr-1**: The Coffee House
- **test-qr-2**: Tech Repair Shop
- **test-qr-3**: Yoga Studio

## 🎯 How It Works

1. User scans QR → `/visit/[qrId]` page loads
2. Frontend POSTs to `/api/qr/scan`
3. Backend calls Gemini API to generate review
4. Deduplication checks prevent repeats
5. Review stored in `TempReview` table
6. SSE pushes review to client in real-time
7. User edits (if needed) and submits
8. Review saved to permanent `Review` table

## 🔒 Security Features

- Hash-based exact duplicate detection
- Semantic similarity checking
- 30-minute review expiration
- Analytics logging for fraud detection

## 🎨 AI Variation

- **Tones**: casual, formal, friendly, short, detailed, enthusiastic
- **Languages**: English, Hindi, Gujarati, Hinglish
- **Authenticity**: 20% chance of intentional spelling mistakes
- **Unique Output**: Every review is context-aware and distinct

## 📝 Next Steps

1. Add your Gemini API key to `.env.local`
2. Run `npm run dev`
3. Visit http://localhost:3000/test-review
4. Test the complete flow!

## ⚠️ Important Notes

- Make sure to add `GOOGLE_API_KEY` to `.env.local` before testing
- The `.env.local` file is gitignored for security (do not remove it from `.gitignore`!)
- Test QR codes are already seeded in the database
- Reviews expire after 30 minutes if not submitted

## 🎉 Ready to Test!

Everything is set up and ready to go. Just add your Gemini API key and start the dev server!
