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
    // Create a stream
    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            let isStreamClosed = false;
            let timeoutId: NodeJS.Timeout;

            // Helper to close stream safely
            const closeStream = () => {
                if (!isStreamClosed) {
                    isStreamClosed = true;
                    clearInterval(pollInterval);
                    clearTimeout(timeoutId);
                    try {
                        controller.close();
                    } catch (e) {
                        // Ignore if already closed
                    }
                }
            };

            // Send initial connection message
            try {
                controller.enqueue(encoder.encode(`: connected\n\n`));
            } catch (e) {
                closeStream();
                return;
            }

            // Poll for review
            const pollInterval = setInterval(async () => {
                if (isStreamClosed) return;

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

                        if (!isStreamClosed) {
                            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                            closeStream();
                        }
                    }
                } catch (error) {
                    console.error("Error polling for review:", error);
                    closeStream();
                }
            }, 1000); // Poll every second

            // Timeout after 30 seconds
            timeoutId = setTimeout(() => {
                if (!isStreamClosed) {
                    try {
                        controller.enqueue(
                            encoder.encode(`data: ${JSON.stringify({ type: "timeout" })}\n\n`)
                        );
                    } catch (e) { }
                    closeStream();
                }
            }, 30000);

            // Handle client disconnect (if supported by runtime, usually request.signal)
            request.signal.addEventListener("abort", () => {
                closeStream();
            });
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
