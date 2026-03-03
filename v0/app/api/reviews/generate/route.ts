import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateReview, generateHash } from "@/lib/gemini";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { qrId, sessionId, language, rating, mood, service, category, selectedItems } = body;

        if (!qrId) {
            return NextResponse.json({ error: "qrId is required" }, { status: 400 });
        }

        // Fetch QR code details
        const qrCode = await prisma.qRCode.findUnique({
            where: { id: qrId },
        });

        if (!qrCode) {
            return NextResponse.json({ error: "QR Code not found" }, { status: 404 });
        }

        if (!qrCode.isActive) {
            return NextResponse.json({ error: "This QR Code is currently disabled." }, { status: 403 });
        }

        // Generate new review with user inputs
        const generated = await generateReview({
            businessName: qrCode.businessName,
            productSummary: qrCode.productSummary || qrCode.businessName,
            businessCategory: category || qrCode.businessCategory,
            businessType: qrCode.businessType,
            description: qrCode.description,
            language: language,
            rating: typeof rating === 'number' ? rating : undefined,
            mood,
            service,
            selectedItems: Array.isArray(selectedItems) ? selectedItems : undefined,
        });

        const hash = generateHash(generated.reviewText);
        const jobId = nanoid();
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

        // Create Temp Review
        await prisma.tempReview.create({
            data: {
                jobId,
                qrCodeId: qrId,
                reviewText: generated.reviewText,
                language: generated.language,
                rating: generated.rating,
                hash,
                sessionId: sessionId || "interactive-session",
                expiresAt,
            },
        });

        // Log review generation
        await prisma.scanLog.create({
            data: {
                qrCodeId: qrId,
                jobId,
                action: "review_generated",
                timestamp: new Date(),
            },
        });

        return NextResponse.json({
            success: true,
            jobId,
            reviewText: generated.reviewText,
            language: generated.language,
            rating: generated.rating,
            googleMapsLink: qrCode.googleMapsLink,
        });

    } catch (error) {
        console.error("Error generating interactive review:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
