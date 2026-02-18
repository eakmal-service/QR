import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateReview, generateHash, calculateSimilarity } from "@/lib/gemini";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { qrId, deviceId, sessionId } = body;

        if (!qrId) {
            return NextResponse.json(
                { error: "qrId is required" },
                { status: 400 }
            );
        }

        // Fetch QR code details
        const qrCode = await prisma.qRCode.findUnique({
            where: { id: qrId },
        });

        if (!qrCode) {
            return NextResponse.json(
                { error: "QR code not found" },
                { status: 404 }
            );
        }

        // Log the scan
        await prisma.scanLog.create({
            data: {
                qrCodeId: qrId,
                deviceType: deviceId,
                action: "scan",
                timestamp: new Date(),
            },
        });

        // Generate job ID
        const jobId = nanoid();

        // Generate review
        const maxAttempts = 3;
        let attempt = 0;
        let review = null;

        while (attempt < maxAttempts && !review) {
            attempt++;

            const generated = await generateReview({
                businessName: qrCode.businessName,
                productSummary: qrCode.productSummary || qrCode.businessName,
            });

            const hash = generateHash(generated.reviewText);

            //Check for exact duplicates
            const existingReview = await prisma.tempReview.findFirst({
                where: { hash },
            });

            if (existingReview) {
                console.log(`Duplicate detected (attempt ${attempt}), regenerating...`);
                continue;
            }

            // Check for similar reviews (last 90 days)
            const recentReviews = await prisma.tempReview.findMany({
                where: {
                    qrCodeId: qrId,
                    createdAt: {
                        gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
                    },
                },
                select: { reviewText: true },
            });

            const isSimilar = recentReviews.some(
                (r) => calculateSimilarity(r.reviewText, generated.reviewText) > 0.85
            );

            if (isSimilar) {
                console.log(`Similar review detected (attempt ${attempt}), regenerating...`);
                continue;
            }

            // Store temp review
            const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
            review = await prisma.tempReview.create({
                data: {
                    jobId,
                    qrCodeId: qrId,
                    reviewText: generated.reviewText,
                    language: generated.language,
                    rating: generated.rating,
                    hash,
                    sessionId,
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
        }

        if (!review) {
            return NextResponse.json(
                { error: "Failed to generate unique review after multiple attempts" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            status: "accepted",
            jobId,
            googleMapsLink: qrCode.googleMapsLink,
        });
    } catch (error) {
        console.error("Error in /api/qr/scan:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
