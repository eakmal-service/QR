"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Copy, RefreshCw, Loader2, MapPin, Star, Clipboard } from "lucide-react";
import Head from 'next/head';

interface QRCodeData {
    id: string;
    businessName: string;
    businessCategory?: string;
    productSummary?: string;
    menuItems: any[];
    googleMapsLink?: string;
    location?: string;
}

const MOOD_OPTIONS = [
    { value: "Family outing ke liye aaya tha", label: "Family outing ke liye aaya tha" },
    { value: "Doston ke saath masti", label: "Doston ke saath masti" },
    { value: "Date night tha", label: "Date night tha" },
    { value: "Regular customer hoon", label: "Regular customer hoon" },
    { value: "Pehli baar aaya/aayi", label: "Pehli baar aaya/aayi" },
    { value: "Ice cream ki craving thi", label: "Ice cream ki craving thi" },
];

const SERVICE_OPTIONS = [
    { value: "Bahut achha — fast service aur friendly staff", label: "Bahut achha — fast service aur friendly staff" },
    { value: "Acha tha — smooth experience", label: "Acha tha — smooth experience" },
    { value: "Theek tha — average experience", label: "Theek tha — average experience" },
    { value: "Thodi bheed thi par koi baat nahi", label: "Thodi bheed thi par koi baat nahi" }
];

const LANGUAGES = ["English", "Hindi", "Hinglish", "Gujarati"];

const CATEGORY_OPTIONS = [
    { value: "Milk Shake 🥛", label: "Milk Shake 🥛" },
    { value: "Ice Cream 🍨", label: "Ice Cream 🍨" },
    { value: "Coco Special 🥥", label: "Coco Special 🥥" },
    { value: "Kulfi / Roll Slice 🍧", label: "Kulfi / Roll Slice 🍧" },
    { value: "Falooda 🌹", label: "Falooda 🌹" },
    { value: "Mixed Items", label: "Mixed Items" }
];

const CATEGORY_DEFAULT = CATEGORY_OPTIONS[0].value;

export default function VisitPage({ params }: { params: { qrId: string } }) {
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [qrData, setQrData] = useState<QRCodeData | null>(null);

    // Form State
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [rating, setRating] = useState<number>(0);
    const [mood, setMood] = useState<string>(MOOD_OPTIONS[0].value);
    const [service, setService] = useState<string>(SERVICE_OPTIONS[0].value);
    const [category, setCategory] = useState<string>(CATEGORY_DEFAULT);
    const [language, setLanguage] = useState<string>("Hinglish");

    // Result State
    const [draft, setDraft] = useState("");
    const [jobId, setJobId] = useState<string | null>(null);

    // 1: Details, 2: Result
    const [step, setStep] = useState<1 | 2>(1);

    // Session ID for tracking
    const [sessionId] = useState(() => Math.random().toString(36).substring(7));

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await fetch("/api/qr/scan", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        qrId: params.qrId,
                        deviceId: navigator.userAgent,
                        sessionId,
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Failed to load business details");
                }

                setQrData(data.qrCode);
                if (data.qrCode.businessCategory) {
                    setCategory(data.qrCode.businessCategory);
                }
            } catch (err: any) {
                console.error("Scan error:", err);
                setError(err.message || "Failed to load page");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [params.qrId, sessionId]);

    const toggleItem = (item: string) => {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter(i => i !== item));
        } else {
            if (selectedItems.length >= 4) {
                toast.warning("You can only select up to 4 items.");
                return;
            }
            setSelectedItems([...selectedItems, item]);
        }
    };

    const handleGenerate = async () => {
        if (rating === 0) {
            toast.warning("Please provide a rating first!");
            return;
        }

        setGenerating(true);
        try {
            const response = await fetch("/api/reviews/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    qrId: params.qrId,
                    sessionId,
                    language,
                    rating,
                    mood,
                    service,
                    category,
                    selectedItems,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to generate review");
            }

            setDraft(data.reviewText);
            setJobId(data.jobId);
            setStep(2);
            toast.success("Review generated successfully!");
        } catch (err: any) {
            console.error("Generate error:", err);
            toast.error(err.message || "Failed to generate review");
        } finally {
            setGenerating(false);
        }
    };

    const handleCopyAndRedirect = async () => {
        if (!jobId) return;
        setSubmitting(true);

        try {
            await navigator.clipboard.writeText(draft);
            toast.success("Review copied! Redirecting...");

            // Mark as submitted
            await fetch("/api/reviews/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobId, reviewText: draft }),
            });

            if (qrData?.googleMapsLink) {
                setTimeout(() => {
                    window.location.href = qrData.googleMapsLink!;
                }, 1500);
            } else {
                toast.info("Please paste the copied review on Google.");
            }
        } catch (err) {
            console.error("Copy error:", err);

            // Fallback submission tracking
            fetch("/api/reviews/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobId, reviewText: draft }),
            });

            const textarea = document.getElementById("review-text") as HTMLTextAreaElement;
            if (textarea) {
                textarea.select();
                document.execCommand("copy");
                if (qrData?.googleMapsLink) {
                    setTimeout(() => {
                        window.location.href = qrData.googleMapsLink!;
                    }, 1000);
                }
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black px-4 font-sans">
                <div className="text-center p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] shadow-sm max-w-md w-full">
                    <h1 className="text-2xl font-bold text-red-500 mb-2">Oops!</h1>
                    <p className="text-gray-300">{error}</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black font-sans">
                <div className="text-center p-8 bg-white/5 backdrop-blur-xl rounded-2xl shadow-sm border border-white/10 max-w-sm w-full flex flex-col items-center">
                    <Loader2 className="w-10 h-10 text-white animate-spin mb-4" />
                    <p className="text-gray-300 font-medium">Loading details...</p>
                </div>
            </div>
        );
    }

    // Helper SVG for Rating Star (custom look)
    const StarRating = ({ isActive, onClick }: { isActive: boolean, onClick: () => void }) => (
        <button onClick={onClick} className="focus:outline-none hover:scale-110 transition-transform">
            <svg
                width="40" height="40"
                viewBox="0 0 24 24"
                fill={isActive ? "#FDE047" : "#FFFBF6"}
                stroke={isActive ? "#EAB308" : "#E2D3BE"}
                strokeWidth={isActive ? "1" : "1.5"}
                className={`w-10 h-10 drop-shadow-sm`}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
            </svg>
        </button>
    );

    return (
        <div className="min-h-screen bg-black text-white py-6 px-4 font-sans selection:bg-white/30 selection:text-white">
            <div className="max-w-[800px] mx-auto space-y-5">

                {/* 1. Visit Details Form */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] p-6 sm:p-8 shadow-sm">
                    {/* Header */}
                    <h2 className="text-[22px] font-bold text-white flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full border-2 border-white text-white flex items-center justify-center text-sm">
                            1
                        </span>
                        Aapki Visit Details
                    </h2>

                    <div className="border-b-[1.5px] border-dashed border-white/20 my-5"></div>

                    <div className="space-y-6">


                        {/* Items Section */}
                        {qrData?.menuItems && qrData.menuItems.length > 0 && (
                            <div>
                                <label className="block text-[17px] font-semibold text-white mb-1">Aapne kya order kiya? (Jo items try ki wo select kero menu me se )</label>
                                <p className="text-sm text-gray-400 mb-4">Up to 4 items select karo — review mein mention honge</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {qrData.menuItems.map((item, idx) => {
                                        const itemName = typeof item === 'string' ? item : item.name;
                                        const itemPrice = typeof item === 'object' && item.price ? item.price : null;

                                        return (
                                            <label key={idx} className={`flex items-center gap-3 p-3.5 border ${selectedItems.includes(itemName) ? 'border-white/40 bg-white/10' : 'border-white/10 bg-black/30'} rounded-xl cursor-pointer hover:bg-white/10 transition-colors`}>
                                                <div className="w-[18px] h-[18px] rounded-full border border-gray-500 flex items-center justify-center shrink-0">
                                                    {selectedItems.includes(itemName) && (
                                                        <div className="w-[10px] h-[10px] rounded-full bg-white"></div>
                                                    )}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.includes(itemName)}
                                                    onChange={() => toggleItem(itemName)}
                                                    className="hidden"
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-[15px] font-medium text-white truncate">{itemName}</span>
                                                    {itemPrice && <span className="text-xs text-gray-400 font-semibold">₹{itemPrice}</span>}
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Category */}
                        <div>
                            <label className="block text-[16px] font-semibold text-white mb-2 pl-1">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full tracking-wide p-3.5 bg-black border border-white/20 rounded-xl outline-none text-white font-medium text-[15px] focus:ring-1 focus:ring-white/50 appearance-none"
                            >
                                <option value="">Select Category</option>
                                {CATEGORY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="block text-[16px] font-semibold text-white mb-2 pl-1">Rating</label>
                            <div className="flex gap-1.5 ml-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <StarRating key={star} isActive={rating >= star} onClick={() => setRating(star)} />
                                ))}
                            </div>
                        </div>

                        {/* Mood / Experience */}
                        <div>
                            <label className="block text-[16px] font-semibold text-white mb-2 pl-1">Mood / Experience</label>
                            <select
                                value={mood}
                                onChange={(e) => setMood(e.target.value)}
                                className="w-full p-3.5 bg-black border border-white/20 rounded-xl outline-none text-white font-medium text-[15px] appearance-none focus:ring-1 focus:ring-white/50"
                            >
                                {MOOD_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>

                        {/* Service & Ambience */}
                        <div>
                            <label className="block text-[16px] font-semibold text-white mb-2 pl-1">Service & Ambience</label>
                            <select
                                value={service}
                                onChange={(e) => setService(e.target.value)}
                                className="w-full p-3.5 bg-black border border-white/20 rounded-xl outline-none text-white font-medium text-[15px] appearance-none focus:ring-1 focus:ring-white/50"
                            >
                                {SERVICE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>

                        {/* Language */}
                        <div>
                            <label className="block text-[16px] font-semibold text-white mb-2 pl-1">Language</label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full p-3.5 bg-black border border-white/20 rounded-xl outline-none text-white font-medium text-[15px] appearance-none focus:ring-1 focus:ring-white/50"
                            >
                                {LANGUAGES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>

                    </div>
                </div>

                {/* 2. Review Generate Karo */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] p-6 shadow-sm">
                    <h2 className="text-[22px] font-bold text-white flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full border-2 border-white text-white flex items-center justify-center text-sm">
                            2
                        </span>
                        Review Generate Karo
                    </h2>
                    <div className="border-b-[1.5px] border-dashed border-white/20 my-4"></div>

                    <button
                        onClick={handleGenerate}
                        disabled={generating || rating === 0}
                        className="w-full bg-white text-black font-bold text-[17px] py-[18px] rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-60 disabled:active:scale-100 flex items-center justify-center gap-2 mt-2 hover:bg-gray-200"
                    >
                        {generating ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Generating Review...</>
                        ) : (
                            <>✨ Smart Review Banao</>
                        )}
                    </button>
                    {rating === 0 && <p className="text-center text-sm text-gray-400 mt-3">Pehle rating select karein</p>}
                </div>

                {/* 3. Aapka Review */}
                {step === 2 && (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-[22px] font-bold text-white flex items-center gap-2">
                            <span className="w-7 h-7 rounded-full border-2 border-white text-white flex items-center justify-center text-sm">
                                3
                            </span>
                            Aapka Review
                        </h2>
                        <div className="border-b-[1.5px] border-dashed border-white/20 my-4"></div>

                        <div className="bg-black/30 border border-white/10 rounded-[20px] p-5 mb-5 relative">
                            <textarea
                                id="review-text"
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-0 p-0 text-white font-medium leading-relaxed resize-none outline-none min-h-[160px] whitespace-pre-wrap"
                            />

                            <div className="mt-6 font-medium text-[15px] flex flex-col gap-2.5">
                                <div className="flex items-center gap-2 text-white">
                                    Rating:
                                    <span className="flex text-[#Fcd34d]">
                                        {[...Array(rating)].map((_, i) => <Star key={i} className="w-[18px] h-[18px] fill-[#Fcd34d] stroke-[#Fcd34d]" />)}
                                        {rating < 5 && [...Array(5 - rating)].map((_, i) => <Star key={`e${i}`} className="w-[18px] h-[18px] fill-transparent stroke-gray-500 stroke-[1.5]" />)}
                                    </span>
                                    <span className="ml-[1px]">{rating}/5</span>
                                    {rating === 5 && <span> 😍</span>}
                                    {rating === 4 && <span> 😊</span>}
                                    {rating <= 3 && <span> 😐</span>}
                                </div>
                                {(qrData?.location || qrData?.businessName) && (
                                    <div className="flex items-center gap-1.5 text-gray-400">
                                        <MapPin className="w-4 h-4 text-white" />
                                        {qrData.businessName}{qrData.location ? `, ${qrData.location}` : ""}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleCopyAndRedirect}
                                disabled={submitting}
                                className="flex-1 bg-white hover:bg-gray-200 text-black font-bold text-[16px] py-[15px] px-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                <Clipboard className="w-5 h-5 text-black" />
                                Copy Review
                            </button>
                            <button
                                onClick={() => setStep(1)}
                                disabled={generating}
                                className="flex-1 bg-white/5 border border-white/20 hover:bg-white/10 text-white font-bold text-[16px] py-[15px] px-4 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                <RefreshCw className="w-5 h-5 text-white" />
                                Naya Review Generate Karo
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
