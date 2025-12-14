import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
        return new Response("jobId is required", { status: 400 });
    }

    const encoder = new TextEncoder();

    // Create a stream
    const stream = new ReadableStream({
        async start(controller) {
            // Send initial connection message
            controller.enqueue(encoder.encode(`: connected\n\n`));

            // Poll for review
            const pollInterval = setInterval(async () => {
                try {
                    const review = await prisma.tempReview.findUnique({
                        where: { jobId },
                    });

                    if (review) {
                        const data = JSON.stringify({
                            type: "review_ready",
                            jobId: review.jobId,
                            reviewText: review.reviewText,
                            language: review.language,
                            rating: review.rating,
                        });

                        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                        clearInterval(pollInterval);
                        controller.close();
                    }
                } catch (error) {
                    console.error("Error polling for review:", error);
                    clearInterval(pollInterval);
                    controller.close();
                }
            }, 1000); // Poll every second

            // Timeout after 30 seconds
            setTimeout(() => {
                clearInterval(pollInterval);
                controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ type: "timeout" })}\n\n`)
                );
                controller.close();
            }, 30000);
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}
