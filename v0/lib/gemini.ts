import { GoogleGenerativeAI } from "@google/generative-ai";
import crypto from "crypto";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const TONES = ["casual", "grateful", "impressed", "short and sweet", "detailed", "enthusiastic", "humorous", "direct"];
const LANGUAGES = ["english", "hindi", "hinglish", "gujarati"];

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
    input: ReviewGenerationInput & { language?: string }
): Promise<GeneratedReview> {
    const tone = TONES[Math.floor(Math.random() * TONES.length)];
    const language = input.language || LANGUAGES[Math.floor(Math.random() * LANGUAGES.length)];
    const allowMistakes = Math.random() < 0.3; // Increased to 30% chance for more natural feel

    const prompt = `Generate a genuine, human-like customer review for the following business.
    
    Business Name: ${input.businessName}
    Product/Service: ${input.productSummary || input.businessName}
    Target Language: ${language} (STRICTLY OUTPUT THE REVIEW TEXT IN THIS LANGUAGE)
    Tone: ${tone}
    RandomSeed: ${Math.random()} (Ignore this, used for variance)

    CRITICAL INSTRUCTIONS:
    1. Make it sound like a REAL person, not a bot. Use natural phrasing.
    2. ${allowMistakes
            ? "Include 1-2 minor imperfections (e.g., lowercase start, missing punctuation, or common slang like 'awsm', 'gr8') to make it look authentic."
            : "Use casual, conversational grammar. Avoid overly polished or robotic sentences."}
    3. Keep it short (1-3 sentences max).
    4. Mention a specific detail relevant to the business (e.g., if it's a cafe, mention the coffee or vibe; if a shop, mention the staff).
    5. STRICTLY RETURN ONLY A JSON OBJECT.
    6. ENSURE THE REVIEW IS IN THE TARGET LANGUAGE (${language}) ONLY. Do not mix languages unless requested (e.g. Hinglish).

    Format:
    {
      "review_text": "your unique review text here",
      "language": "${language}",
      "rating": ${Math.floor(Math.random() * 2) + 4} // Randomly 4 or 5 stars
    }
    
    Do not include markdown formatting or explanations. Just the JSON.`;

    const models = ["gemini-2.5-flash-lite", "gemini-2.0-flash-lite", "gemini-2.0-flash"];
    let lastError = null;

    for (const modelName of models) {
        try {
            console.log(`Attempting generation with model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
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
            console.warn(`Model ${modelName} failed:`, error);
            lastError = error;
            continue; // Try next model
        }
    }

    console.error("All models failed to generate review. Last error:", lastError);
    throw new Error("Failed to generate review after trying all available models");
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
