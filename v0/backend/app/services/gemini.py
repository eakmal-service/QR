import os
import google.generativeai as genai
import hashlib
import json
import random
from typing import Optional
from pydantic import BaseModel

# Configure Gemini
# Suppress the warning by using the recommended import if possible, 
# or just ensure API key is set correctly.
# The warning says: "Please switch to the `google.genai` package as soon as possible."
# Checking if we can suppress it or if it's blocking.
# For now, let's keep it but ensure async calls are correct.

genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))

TONES = ["casual", "grateful", "impressed", "short and sweet", "detailed", "enthusiastic", "humorous", "direct"]
LANGUAGES = ["english", "hindi", "hinglish", "gujarati"]

class GeneratedReview(BaseModel):
    reviewText: str
    language: str
    rating: int

def generate_hash(text: str) -> str:
    return hashlib.sha256(text.lower().strip().encode()).hexdigest()

def calculate_similarity(text1: str, text2: str) -> float:
    words1 = set(text1.lower().split())
    words2 = set(text2.lower().split())
    
    if not words1 or not words2:
        return 0.0

    intersection = words1.intersection(words2)
    union = words1.union(words2)
    
    return len(intersection) / len(union)

async def generate_review(business_name: str, product_summary: str) -> GeneratedReview:
    # Define base variables first
    tone = random.choice(TONES)
    language = random.choice(LANGUAGES)
    allow_mistakes = random.random() < 0.3
    
    mistakes_instruction = (
        "Include 1-2 minor imperfections (e.g., lowercase start, missing punctuation, or common slang like 'awsm', 'gr8') to make it look authentic."
        if allow_mistakes
        else "Use casual, conversational grammar. Avoid overly polished or robotic sentences."
    )

    # 1. Determine Review Length (Short vs Long)
    # 20% chance of a long review (>400 words), 80% chance of a short review
    is_long_review = random.random() < 0.2
    length_instruction = (
        "Write a detailed, comprehensive review (more than 400 words). Go into depth about the experience, specific items/services, atmosphere, and value for money. Use paragraphs."
        if is_long_review
        else "Keep it short and punchy (1-3 sentences max)."
    )

    # 2. Determine Rating (High vs Low/Mid)
    # 85% chance of High Rating (4 or 5), 15% chance of Low/Mid Rating (1, 2, or 3)
    if random.random() < 0.85:
        target_rating_pool = [4, 5]
    else:
        target_rating_pool = [1, 2, 3] # 3 allowed for "mid" range, user said "below 3" but 1-3 covers realistic negative/mixed
    
    target_rating = random.choice(target_rating_pool)
    
    # Adjust tone based on rating
    if target_rating <= 3:
        current_tone = random.choice(["disappointed", "frustrated", "average", "honest", "critical"])
    else:
        current_tone = tone

    prompt = f"""Generate a genuine, human-like customer review for the following business.
    
    Business Name: {business_name}
    Product/Service: {product_summary or business_name}
    Target Language: {language} (STRICTLY OUTPUT THE REVIEW TEXT IN THIS LANGUAGE)
    Tone: {current_tone}
    Target Rating: {target_rating} / 5
    Length Requirement: { "LONG (>400 words)" if is_long_review else "SHORT (1-3 lines)" }
    RandomSeed: {random.random()} (Ignore this, used for variance)

    CRITICAL INSTRUCTIONS:
    1. Make it sound like a REAL person, not a bot. Use natural phrasing.
    2. {mistakes_instruction}
    3. LENGTH RULE: {length_instruction}
    4. Mention a specific detail relevant to the business (e.g., if it's a cafe, mention the coffee or vibe; if a shop, mention the staff).
    5. STRICTLY RETURN ONLY A JSON OBJECT.
    6. ENSURE THE REVIEW IS IN THE TARGET LANGUAGE ({language}) ONLY. Do not mix languages unless requested (e.g. Hinglish).
    7. RATING RULE: The review text MUST match the rating of {target_rating} stars.

    Format:
    {{
      "review_text": "your unique review text here",
      "language": "{language}",
      "rating": {target_rating}
    }}
    
    Do not include markdown formatting or explanations. Just the JSON.
    """
    
    models = ["gemini-2.5-flash-lite", "gemini-2.0-flash-lite", "gemini-2.0-flash"]
    
    last_exception = None

    for model_name in models:
        try:
            print(f"Attempting to generate review using model: {model_name}")
            model = genai.GenerativeModel(model_name)
            response = await model.generate_content_async(prompt)
            text = response.text
            
            # Clean markdown
            cleaned_text = text.strip()
            if cleaned_text.startswith("```json"):
                cleaned_text = cleaned_text[7:]
            if cleaned_text.endswith("```"):
                cleaned_text = cleaned_text[:-3]
            
            data = json.loads(cleaned_text)
            
            print(f"Successfully generated review with model: {model_name}")
            return GeneratedReview(
                reviewText=data.get("review_text"),
                language=data.get("language"),
                rating=data.get("rating")
            )
            
        except Exception as e:
            print(f"Error generating review with {model_name}: {e}")
            last_exception = e
            continue

    # If all models fail, raise the last exception
    if last_exception:
        print("All models failed to generate review.")
        raise last_exception
