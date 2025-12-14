import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { jobId, reviewText } = body;

        if (!jobId || !reviewText) {
            return NextResponse.json(
                { error: "jobId and reviewText are required" },
                { status: 400 }
            );
        }

        // Find temp review
        const tempReview = await prisma.tempReview.findUnique({
            where: { jobId },
        });

        if (!tempReview) {
            return NextResponse.json(
                { error: "Review not found or expired" },
                { status: 404 }
            );
        }

        // Create permanent review
        const review = await prisma.review.create({
            data: {
                qrCodeId: tempReview.qrCodeId,
                reviewText,
                language: tempReview.language,
                rating: tempReview.rating,
                source: "auto-gemini",
            },
        });

        // Delete temp review
        await prisma.tempReview.delete({
            where: { jobId },
        });

        // Log submission
        await prisma.scanLog.create({
            data: {
                qrCodeId: tempReview.qrCodeId,
                jobId,
                action: "review_submitted",
                timestamp: new Date(),
            },
        });

        return NextResponse.json({
            success: true,
            reviewId: review.id,
        });
    } catch (error) {
        console.error("Error in /api/reviews/submit:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
