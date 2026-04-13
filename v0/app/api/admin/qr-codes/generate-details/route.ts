import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(s => s.trim()).filter(Boolean) || [];

    if (!session || !session.user?.email || !adminEmails.includes(session.user.email)) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!genAI) {
        return NextResponse.json({ success: false, error: "AI not configured (Missing API Key)" }, { status: 500 });
    }

    try {
        let body;
        try {
            body = await req.json();
        } catch {
            return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
        }
        const { text } = body;

        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return NextResponse.json({ success: false, error: "No valid text provided" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite",
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const prompt = `
        You are an expert data extraction assistant. Extract business QR code information from the provided raw text and map it STRICTLY to this JSON format:
        {
            "businessName": "Extracted business name or string",
            "businessCategory": "One of: Ice Cream Parlor, Restaurant, Cafe, Hotel, Hospital, Car Rental, Retail, Service, B2B Textile Machinery Manufacturing, Other",
            "businessType": "B2B or B2C",
            "productSummary": "Short catchy summary (max 100 chars)",
            "description": "Any additional descriptive details found about target audience or selling points",
            "googleMapsLink": "Any URL that looks like a Google Maps link or review link, otherwise empty string",
            "customId": "A URL-friendly short lowercase string with hyphens (e.g. 'my-business-01') or leave empty string if no clear unique identifier",
            "menuItems": [
                {
                    "category": "Extracted category (e.g. Starter, Dessert, Products, Services)",
                    "name": "Item name",
                    "price": "Extracted price (as string, e.g. '150' or leave empty string if not found)"
                }
            ]
        }

        Important rules:
        - If a value cannot be found, use an empty string "" for strings, and an empty array [] for menuItems.
        - NEVER make up data. If you are entirely unsure, use empty string.
        - Ensure output is valid pure JSON. Do not include markdown \`\`\`json wrappers.

        Raw Text:
        """${text}"""
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();
        
        // Remove markdown wrappers if the model still accidentally adds them
        const jsonStr = textResponse.replace(/^```json/g, '').replace(/```$/g, '').trim();
        const data = JSON.parse(jsonStr);

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error("AI Generation Error:", error);
        return NextResponse.json({ success: false, error: "Failed to generate details" }, { status: 500 });
    }
}
