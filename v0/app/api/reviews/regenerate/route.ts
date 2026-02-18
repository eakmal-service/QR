import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateReview, generateHash } from "@/lib/gemini";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { jobId, language } = body;

        if (!jobId) {
            return NextResponse.json(
                { error: "jobId is required" },
                { status: 400 }
            );
        }

        // Find the existing review associated with the jobId
        const existingReview = await prisma.tempReview.findFirst({
            where: { jobId },
        });

        if (!existingReview) {
            return NextResponse.json(
                { error: "Review not found" },
                { status: 404 }
            );
        }

        // Fetch QR code details to regenerate review
        const qrCode = await prisma.qRCode.findUnique({
            where: { id: existingReview.qrCodeId },
        });

        if (!qrCode) {
            return NextResponse.json(
                { error: "QR Code not found" },
                { status: 404 }
            );
        }

        // Generate new review
        const generated = await generateReview({
            businessName: qrCode.businessName,
            productSummary: qrCode.productSummary || qrCode.businessName,
            language: language,
        });

        const hash = generateHash(generated.reviewText);

        // Update the existing review
        const updatedReview = await prisma.tempReview.update({
            where: { id: existingReview.id },
            data: {
                reviewText: generated.reviewText,
                language: generated.language,
                rating: generated.rating,
                hash,
                // Optionally update expiresAt to extend life
                expiresAt: new Date(Date.now() + 30 * 60 * 1000),
            },
        });

        return NextResponse.json({
            reviewText: updatedReview.reviewText,
            language: updatedReview.language,
            rating: updatedReview.rating,
        });

    } catch (error) {
        console.error("Error regenerating review:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
