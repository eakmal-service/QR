import { GoogleGenerativeAI } from "@google/generative-ai";
import crypto from "crypto";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const TONES = ["casual", "formal", "friendly", "short", "detailed", "enthusiastic"];
const LANGUAGES = ["english", "hindi", "gujarati", "hinglish"];

interface ReviewGenerationInput {
    businessName: string;
    productSummary: string;
}

interface GeneratedReview {
    reviewText: string;
    language: string;
    rating: number;
}

export async function generateReview(
    input: ReviewGenerationInput
): Promise<GeneratedReview> {
    const tone = TONES[Math.floor(Math.random() * TONES.length)];
    const language = LANGUAGES[Math.floor(Math.random() * LANGUAGES.length)];
    const allowMistakes = Math.random() < 0.2; // 20% chance

    const prompt = `You are an assistant that generates short, human-like product/service reviews. Each output must be unique, context-aware, and mimic natural customer writing in ${language}. ${allowMistakes
            ? "Include 1-2 small spelling mistakes or colloquial expressions."
            : ""
        }

Product/Service: ${input.productSummary || input.businessName}
Business Name: ${input.businessName}
Tone: ${tone}
Language: ${language}
Max Length: 200 characters

Write a single user review (1-2 sentences) about the product/service for this business. Use the selected tone and language. Keep it natural and unique. Vary punctuation naturally.

Return ONLY a JSON object in this exact format:
{
  "review_text": "your review here",
  "language": "${language}",
  "rating": 4
}

Do not include any other text, explanation, or markdown formatting. Just the JSON object.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean the response - remove markdown code blocks if present
        let cleanedText = text.trim();
        if (cleanedText.startsWith("```json")) {
            cleanedText = cleanedText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
        } else if (cleanedText.startsWith("```")) {
            cleanedText = cleanedText.replace(/```\n?/g, "");
        }

        const parsed = JSON.parse(cleanedText) as {
            review_text: string;
            language: string;
            rating: number;
        };

        return {
            reviewText: parsed.review_text,
            language: parsed.language,
            rating: parsed.rating,
        };
    } catch (error) {
        console.error("Error generating review:", error);
        throw new Error("Failed to generate review");
    }
}

export function generateHash(text: string): string {
    return crypto.createHash("sha256").update(text.toLowerCase().trim()).digest("hex");
}

// Simple cosine similarity for basic deduplication
export function calculateSimilarity(text1: string, text2: string): number {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);

    const set1 = new Set(words1);
    const set2 = new Set(words2);

    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size; // Jaccard similarity
}
