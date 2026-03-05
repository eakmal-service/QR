import { GoogleGenerativeAI } from "@google/generative-ai";
import crypto from "crypto";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const LANGUAGES = ["english", "hindi", "hinglish", "gujarati"];

interface ReviewGenerationInput {
    businessName: string;
    productSummary?: string | null;
    businessCategory?: string | null;
    businessType?: string | null; // e.g., b2b, b2c
    description?: string | null;
    rating?: number;
    mood?: string;
    service?: string;
    selectedItems?: string[];
}

interface GeneratedReview {
    reviewText: string;
    language: string;
    rating: number;
}

export async function generateReview(
    input: ReviewGenerationInput & { language?: string }
): Promise<GeneratedReview> {
    const language = input.language || LANGUAGES[Math.floor(Math.random() * LANGUAGES.length)];

    // Drastically lower the chance of artificial mistakes. Too many spelling errors looks fake.
    const allowMistakes = Math.random() < 0.05; // 5% chance

    const generateRating = () => {
        const rand = Math.random();
        if (rand < 0.05) return 2; // 5% chance of 2 stars (keeps it realistic)
        if (rand < 0.15) return 3; // 10% chance of 3 stars
        if (rand < 0.50) return 4; // 35% chance of 4 stars
        return 5; // 50% chance of 5 stars
    };
    const rating = input.rating || generateRating();

    const productSummaryText = input.productSummary ? `Product/Service Summary: ${input.productSummary}` : "";
    const categoryText = input.businessCategory ? `Business Category: ${input.businessCategory}` : "";
    const typeText = input.businessType ? `Business Type: ${input.businessType}` : "";
    const descText = input.description ? `Detailed Description: ${input.description}` : "";

    const isDetailed = Math.random() < 0.4; // 40% detailed, 60% short
    const lengthInstruction = isDetailed
        ? "Length: Write a detailed review (3 to 5 full sentences) explaining the experience."
        : "Length: Write a short, quick review (1 to 2 short sentences).";

    // User selections
    const itemsText = input.selectedItems && input.selectedItems.length > 0 ? `Items Ordered/Experienced: ${input.selectedItems.join(", ")}` : "";
    const serviceText = input.service ? `Customer's Opinion on Service/Ambience: ${input.service}` : "";

    const languageInstruction = language.toLowerCase() === 'hinglish'
        ? "Target Language: HINGLISH. You MUST write in conversational Hindi but STRICTLY use the English alphabet (e.g., 'Bohot acha experience tha', 'Service ekdum mast thi'). NEVER use Devanagari script. ONLY English letters."
        : `Target Language: ${language} (STRICTLY OUTPUT THE REVIEW TEXT IN THIS LANGUAGE)`;

    const prompt = `Generate a highly unique, unpredictable, and human-like customer review for the following business.
    
    Business details to understand context:
    Business Name: ${input.businessName}
    ${categoryText}
    ${typeText}
    ${productSummaryText}
    ${descText}
    
    Customer's Specific Visit Details (MANDATORY TO INCLUDE IN REVIEW):
    ${itemsText}
    ${serviceText}
    Rating Given: ${rating} out of 5 stars.
    
    ${languageInstruction}
    
    Randomness Constraints (Follow these to make the review TRULY unique and completely unpredictable):
    - Invent a creative Reviewer Persona based on the Mood/Experience provided.
    - Invent a unique Tone based on the persona (e.g., enthusiastic, matter-of-fact, highly detailed, very brief exclamation).
    - ${lengthInstruction}
    - Focus Area: STRICTLY mention the items ordered and the service opinion provided, blending them naturally into the story.
    - RandomSeed: ${Math.random() * 1000000} (Use this random number to seed your creativity so no two reviews are ever identical).

    CRITICAL INSTRUCTIONS:
    1. Make it sound exactly like a REAL person from the perspective of the persona you invented, never an AI bot. Use incredibly natural phrasing and vocabulary appropriate for this persona.
    2. Ensure the tone matches the assigned '${rating} star' rating and the provided mood.
    3. You MUST naturally weave the "Items Ordered" and the "Service/Ambience" into the review text. Do not just list them out.
    4. ${allowMistakes
            ? "Include 1 minor human imperfection (e.g., lowercase start, trailing thoughts, or casually missing punctuation)."
            : "Use extremely casual, conversational internet grammar. DO NOT use corporate, overly polished, or formal phrasing. Write how a real person texts or posts online."}
    5. STRICTLY RETURN ONLY A JSON OBJECT.
    6. ENSURE THE REVIEW IS IN THE TARGET LANGUAGE (${language}) ONLY. Do not mix languages unless requested (e.g. Hinglish).

    Format:
    {
      "review_text": "your unique review text here",
      "language": "${language}",
      "rating": ${rating}
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
