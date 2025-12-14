"use client";

import { useEffect, useRef, useState } from "react";

interface TempReview {
    jobId: string;
    reviewText: string;
    language: string;
    rating: number;
}

export default function VisitPage({ params }: { params: { qrId: string } }) {
    const [tempReview, setTempReview] = useState<TempReview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [jobId, setJobId] = useState<string | null>(null);
    const [draft, setDraft] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const eventSourceRef = useRef<EventSource | null>(null);

    useEffect(() => {
        const initiateScan = async () => {
            try {
                const response = await fetch("/api/qr/scan", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        qrId: params.qrId,
                        deviceId: navigator.userAgent,
                        sessionId: Math.random().toString(36).substring(7),
                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to initiate scan");
                }

                const data = await response.json();
                setJobId(data.jobId);
            } catch (err) {
                console.error("Scan error:", err);
                setError("Failed to process QR scan");
                setLoading(false);
            }
        };

        initiateScan();
    }, [params.qrId]);

    useEffect(() => {
        if (!jobId) return;

        // Connect to SSE stream
        const eventSource = new EventSource(`/api/reviews/stream?jobId=${jobId}`);
        eventSourceRef.current = eventSource;

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === "review_ready") {
                    setTempReview({
                        jobId: data.jobId,
                        reviewText: data.reviewText,
                        language: data.language,
                        rating: data.rating,
                    });
                    setDraft(data.reviewText);
                    setLoading(false);
                    eventSource.close();
                } else if (data.type === "timeout") {
                    setError("Review generation timed out");
                    setLoading(false);
                    eventSource.close();
                }
            } catch (err) {
                console.error("Error parsing SSE data:", err);
            }
        };

        eventSource.onerror = (err) => {
            console.error("SSE error:", err);
            setError("Connection error");
            setLoading(false);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [jobId]);

    const handlePaste = async () => {
        try {
            await navigator.clipboard.writeText(draft);
            alert("Review copied to clipboard!");
        } catch (err) {
            console.error("Clipboard error:", err);
            const textarea = document.getElementById("review-text") as HTMLTextAreaElement;
            if (textarea) {
                textarea.select();
            }
        }
    };

    const handleSubmit = async () => {
        if (!tempReview) return;

        setSubmitting(true);
        try {
            const response = await fetch("/api/reviews/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jobId: tempReview.jobId,
                    reviewText: draft,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to submit review");
            }

            setSubmitted(true);
        } catch (err) {
            console.error("Submit error:", err);
            setError("Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
                    <div className="text-6xl mb-4">✅</div>
                    <h1 className="text-2xl font-bold text-green-600 mb-2">
                        Review Submitted!
                    </h1>
                    <p className="text-gray-600 mb-4">
                        Thank you for sharing your feedback!
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h1 className="text-xl font-semibold text-gray-700">
                        Generating your review...
                    </h1>
                    <p className="text-gray-500 mt-2">
                        This will only take a moment
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Your AI-Generated Review
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Language: <span className="font-semibold">{tempReview?.language}</span> |
                        Rating: <span className="font-semibold">{tempReview?.rating}/5</span>
                    </p>

                    <div className="mb-6">
                        <label htmlFor="review-text" className="block text-sm font-medium text-gray-700 mb-2">
                            Review Text (editable)
                        </label>
                        <textarea
                            id="review-text"
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows={5}
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handlePaste}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                            📋 Copy to Clipboard
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting || !draft.trim()}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                            {submitting ? "Submitting..." : "✓ Submit Review"}
                        </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-4 text-center">
                        This review was generated by AI. You can edit it before submitting.
                    </p>
                </div>
            </div>
        </div>
    );
}
