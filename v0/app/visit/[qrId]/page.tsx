"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

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
    const [googleMapsLink, setGoogleMapsLink] = useState<string | null>(null);
    const [jobId, setJobId] = useState<string | null>(null);
    const [draft, setDraft] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const eventSourceRef = useRef<EventSource | null>(null);

    const [regenerating, setRegenerating] = useState(false);

    // Available languages for selection
    const LANGUAGES = ["English", "Hindi", "Hinglish", "Gujarati"];

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
                if (data.googleMapsLink) {
                    setGoogleMapsLink(data.googleMapsLink);
                }
            } catch (err) {
                console.error("Scan error:", err);
                setError("Failed to process QR scan");
                setLoading(false);
            }
        };

        initiateScan();
    }, [params.qrId]);

    // ... (useEffect for SSE remains same)

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


    const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLanguage = e.target.value;
        if (!tempReview || !jobId) return;

        setRegenerating(true);
        try {
            const response = await fetch("/api/reviews/regenerate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jobId: jobId,
                    language: newLanguage,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to regenerate review");
            }

            const data = await response.json();

            // Update local state with new review
            const updatedReview = {
                ...tempReview,
                reviewText: data.reviewText,
                language: data.language,
                rating: data.rating,
            };

            setTempReview(updatedReview);
            setDraft(data.reviewText);
            toast.success("Review regenerated in " + data.language);

        } catch (err) {
            console.error("Regeneration error:", err);
            toast.error("Failed to regenerate review");
        } finally {
            setRegenerating(false);
        }
    };

    const handleCopyAndRedirect = async () => {
        try {
            await navigator.clipboard.writeText(draft);
            toast.success("Review copied! Redirecting...");

            if (googleMapsLink) {
                // Short delay to allow toast to be seen
                setTimeout(() => {
                    window.location.href = googleMapsLink;
                }, 1500);
            } else {
                alert("Review copied! (No redirect link found)");
            }
        } catch (err) {
            console.error("Clipboard error:", err);
            // Fallback
            const textarea = document.getElementById("review-text") as HTMLTextAreaElement;
            if (textarea) {
                textarea.select();
                document.execCommand("copy");
                if (googleMapsLink) {
                    setTimeout(() => {
                        window.location.href = googleMapsLink;
                    }, 1000);
                }
            }
        }
    };

    const handleSubmit = async () => {
        // ... (existing submit logic)
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
            <div className="min-h-screen flex items-center justify-center bg-black px-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-2">Error</h1>
                    <p className="text-gray-400">{error}</p>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black px-4">
                <div className="text-center bg-zinc-900 border border-zinc-800 p-8 rounded-lg shadow-md max-w-md">
                    <div className="text-6xl mb-4">✅</div>
                    <h1 className="text-2xl font-bold text-green-500 mb-2">
                        Review Submitted!
                    </h1>
                    <p className="text-gray-400 mb-4">
                        Thank you for sharing your feedback!
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black px-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-violet-600 mx-auto mb-4"></div>
                    <h1 className="text-xl font-semibold text-white">
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
        <div className="min-h-screen bg-black text-white py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg p-8 relative">
                    {regenerating && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-xl backdrop-blur-sm">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-600 mx-auto mb-2"></div>
                                <p className="text-white font-medium">Regenerating...</p>
                            </div>
                        </div>
                    )}

                    <h1 className="text-3xl font-bold text-white mb-2">
                        Your AI-Generated Review
                    </h1>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            <label htmlFor="language-select" className="text-gray-400 font-medium whitespace-nowrap">
                                Language:
                            </label>
                            <select
                                id="language-select"
                                value={tempReview?.language?.toLowerCase() || ""}
                                onChange={handleLanguageChange}
                                className="bg-zinc-950 border border-zinc-800 text-white text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block p-2.5"
                                disabled={regenerating}
                            >
                                {LANGUAGES.map((lang) => (
                                    <option key={lang} value={lang.toLowerCase()}>
                                        {lang}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <p className="text-gray-400">
                            Rating: <span className="font-semibold text-white">{tempReview?.rating}/5</span>
                        </p>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="review-text" className="block text-sm font-medium text-gray-400 mb-2">
                            Review Text (editable)
                        </label>
                        <textarea
                            id="review-text"
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-violet-600 focus:border-transparent resize-none text-white placeholder:text-gray-600"
                            rows={5}
                            disabled={regenerating}
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleCopyAndRedirect}
                            className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={regenerating}
                        >
                            <span>📋</span> Copy & Post Review
                        </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-4 text-center">
                        This review was generated by AI. Clicking 'Copy & Post' will copy to clipboard and open the review page.
                    </p>
                </div>
            </div>
        </div>
    );
}
