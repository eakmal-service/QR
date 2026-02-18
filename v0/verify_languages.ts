import fs from 'fs';
import path from 'path';

async function main() {
    // 1. Load Environment Variables MANUALLY before importing anything else
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        console.log(`Loading env from ${envPath}`);
        if (fs.existsSync(envPath)) {
            const envConfig = fs.readFileSync(envPath, 'utf8');
            envConfig.split('\n').forEach(line => {
                const [key, value] = line.split('=');
                if (key && value) {
                    process.env[key.trim()] = value.trim();
                }
            });
        }
        console.log("API Key loaded:", process.env.GOOGLE_API_KEY ? "Yes (starts with " + process.env.GOOGLE_API_KEY.substring(0, 4) + ")" : "No");
    } catch (e) {
        console.error("Error loading .env.local", e);
    }

    // 2. Dynamic import AFTER env is set
    const { generateReview } = await import("./lib/gemini");

    async function testLanguages() {
        console.log("Testing language distribution...");
        const results: Record<string, number> = {};

        for (let i = 0; i < 10; i++) {
            try {
                const review = await generateReview({
                    businessName: "Test Cafe",
                    productSummary: "A cozy place for coffee",
                });
                console.log(`Run ${i + 1}: ${review.language}`);
                results[review.language] = (results[review.language] || 0) + 1;
            } catch (e: any) {
                console.error(`Run ${i + 1} failed:`, e.message);
            }
        }

        console.log("\nDistribution:", results);
    }

    await testLanguages();
}

main();
