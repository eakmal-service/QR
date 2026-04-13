"use client";

import React, { useEffect, useState, memo } from "react";
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

const SERVICE_OPTIONS = [
    { value: "Excellent", label: "Excellent" },
    { value: "Good", label: "Good" },
    { value: "Average", label: "Average" },
    { value: "Bad", label: "Bad" },
    { value: "Fast", label: "Fast" },
    { value: "Slow", label: "Slow" }
];

const LANGUAGES = ["English", "Hindi", "Hinglish", "Gujarati"];

import { DairyDonBackground } from "../../../components/clients/dairy-don/DairyDonBackground";
import { TexnaBackground } from "../../../components/clients/texna/TexnaBackground";
import { RubyLogo } from "../../../components/clients/ruby/RubyLogo";

export default function VisitPage({ params }: { params: { qrId: string } }) {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);

    const isDairyDon = params.qrId === "qr-VU94MVcLYm";
    const isTexna = params.qrId === "qr-TEXNA1234";
    const isRuby = params.qrId === "ruby-online-store";

    const bgClass = isRuby ? "bg-[#000000]" : isTexna ? "bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6]" : isDairyDon ? "bg-gradient-to-br from-[#7A1F6A] to-[#B23A96]" : "bg-black";
    const isLightMode = isDairyDon || isTexna;
    
    const themeColor = isRuby ? "#D4AF37" : isTexna ? "#1E3A8A" : "#9C2C86";

    // Static Class Maps for Tailwind Compiler
    const themeClasses = isRuby ? {
        text: "text-[#D4AF37]",
        border: "border-[#D4AF37]",
        bg: "bg-[#D4AF37]",
        bgOpacity5: "bg-[#D4AF37]/5",
        bgOpacity10: "bg-[#D4AF37]/10",
        bgOpacity20: "bg-[#D4AF37]/20",
        borderOpacity30: "border-[#D4AF37]/30",
        borderOpacity20: "border-[#D4AF37]/20",
        ringOpacity50: "focus:ring-[#D4AF37]/50"
    } : isTexna ? {
        text: "text-[#1E3A8A]",
        border: "border-[#1E3A8A]",
        bg: "bg-[#1E3A8A]",
        bgOpacity5: "bg-[#1E3A8A]/5",
        bgOpacity10: "bg-[#1E3A8A]/10",
        bgOpacity20: "bg-[#1E3A8A]/20",
        borderOpacity30: "border-[#1E3A8A]/30",
        borderOpacity20: "border-[#1E3A8A]/20",
        ringOpacity50: "focus:ring-[#1E3A8A]/50"
    } : {
        text: "text-[#9C2C86]",
        border: "border-[#9C2C86]",
        bg: "bg-[#9C2C86]",
        bgOpacity5: "bg-[#9C2C86]/5",
        bgOpacity10: "bg-[#9C2C86]/10",
        bgOpacity20: "bg-[#9C2C86]/20",
        borderOpacity30: "border-[#9C2C86]/30",
        borderOpacity20: "border-[#9C2C86]/20",
        ringOpacity50: "focus:ring-[#9C2C86]/50"
    };

    // Derived UI Classes
    const mainCardClass = isLightMode ? "bg-white shadow-xl rounded-[24px] p-6 sm:p-8" : "bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] p-6 sm:p-8 shadow-sm";
    const headingClass = isLightMode ? `text-[22px] font-bold ${themeClasses.text} flex items-center gap-2` : "text-[22px] font-bold text-white flex items-center gap-2";
    const stepCircleClass = isLightMode ? `w-7 h-7 rounded-full border-2 ${themeClasses.border} ${themeClasses.text} flex items-center justify-center text-sm` : "w-7 h-7 rounded-full border-2 border-white text-white flex items-center justify-center text-sm";
    const dividerClass = isLightMode ? "border-b-[1.5px] border-dashed border-gray-200 my-5" : "border-b-[1.5px] border-dashed border-white/20 my-5";
    const labelClass = isLightMode ? "block text-[17px] font-semibold text-gray-800 mb-2 pl-1" : "block text-[17px] font-semibold text-white mb-2 pl-1";
    const labelSmallClass = isLightMode ? "block text-[16px] font-semibold text-gray-800 mb-2 pl-1" : "block text-[16px] font-semibold text-white mb-2 pl-1";
    const subLabelClass = isLightMode ? "text-sm text-gray-500 mb-4 pl-1" : "text-sm text-gray-400 mb-4";
    const inputClass = isLightMode
        ? `w-full tracking-wide p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-900 font-medium text-[15px] focus:ring-1 ${themeClasses.ringOpacity50} appearance-none`
        : "w-full tracking-wide p-3.5 bg-black border border-white/20 rounded-xl outline-none text-white font-medium text-[15px] focus:ring-1 focus:ring-white/50 appearance-none";

    // Menu item cards
    const menuItemBaseClass = isLightMode ? "bg-gray-50 border-gray-200 hover:bg-gray-100" : "bg-black/30 border-white/10 hover:bg-white/10";
    const menuItemSelectedClass = isLightMode ? `${themeClasses.bgOpacity5} ${themeClasses.border}` : "bg-white/10 border-white/40";
    const menuItemTextClass = isLightMode ? "text-[15px] font-medium text-gray-900 truncate" : "text-[15px] font-medium text-white truncate";
    const menuItemPriceClass = isLightMode ? "text-xs text-gray-500 font-semibold" : "text-xs text-gray-400 font-semibold";
    const checkboxBorderClass = isLightMode ? themeClasses.border : "border-gray-500";
    const checkboxDotClass = isLightMode ? themeClasses.bg : "bg-white";

    const btnPrimaryClass = isLightMode ? `w-full ${themeClasses.bg} text-white font-bold text-[17px] py-[18px] rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-60 disabled:active:scale-100 flex items-center justify-center gap-2 mt-2 hover:opacity-90` : "w-full bg-white text-black font-bold text-[17px] py-[18px] rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-60 disabled:active:scale-100 flex items-center justify-center gap-2 mt-2 hover:bg-gray-200";

    const reviewCardTopClass = isLightMode ? "bg-white shadow-lg rounded-[24px] p-6 mb-5" : `bg-white/5 backdrop-blur-xl border ${themeClasses.borderOpacity20} rounded-[24px] p-6 shadow-sm`;
    const reviewCardClass = isLightMode ? "bg-gray-50 border border-gray-200 rounded-[20px] p-5 mb-5 relative" : `bg-black/40 border ${themeClasses.borderOpacity20} rounded-[20px] p-5 mb-5 relative`;
    const reviewTextAreaClass = isLightMode ? "w-full bg-transparent border-none focus:ring-0 p-0 text-gray-900 font-medium leading-relaxed resize-none outline-none min-h-[160px] whitespace-pre-wrap" : "w-full bg-transparent border-none focus:ring-0 p-0 text-white font-medium leading-relaxed resize-none outline-none min-h-[160px] whitespace-pre-wrap";
    const reviewMetaTextClass = isLightMode ? "flex items-center gap-2 text-gray-800" : "flex items-center gap-2 text-white/90";
    const reviewLocationClass = isLightMode ? "flex items-center gap-1.5 text-gray-500" : "flex items-center gap-1.5 text-white/50";
    const iconColor = isLightMode ? "text-gray-500" : themeClasses.text;

    const btnHalfPrimaryClass = isLightMode ? `flex-1 ${themeClasses.bg} hover:opacity-90 text-white font-bold text-[16px] py-[15px] px-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-70` : "flex-1 bg-white hover:bg-gray-200 text-black font-bold text-[16px] py-[15px] px-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-70";
    const btnHalfSecondaryClass = isLightMode ? "flex-1 bg-gray-100 border border-gray-200 hover:bg-gray-200 text-gray-800 font-bold text-[16px] py-[15px] px-4 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70" : "flex-1 bg-white/5 border border-white/20 hover:bg-white/10 text-white font-bold text-[16px] py-[15px] px-4 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70";

    const getMenuItemClass = (isSelected: boolean) => {
        const base = "flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-colors";
        const stateClass = isSelected ? menuItemSelectedClass : menuItemBaseClass;
        return `${base} ${stateClass}`;
    };

    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [qrData, setQrData] = useState<QRCodeData | null>(null);

    // Form State
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [rating, setRating] = useState<number>(0);
    const [language, setLanguage] = useState<string>("");
    const [showAllMenu, setShowAllMenu] = useState(false);
    const [reviewType, setReviewType] = useState<'short' | 'detailed' | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    // Progressive Unlock Logic
    const isRatingUnlocked = reviewType === 'short' ? true : selectedItems.length > 0;
    const isLanguageUnlocked = isRatingUnlocked && rating > 0;

    const getSectionClass = (isUnlocked: boolean) =>
        `transition-all duration-500 ${isUnlocked ? 'opacity-100 blur-none pointer-events-auto' : 'opacity-40 blur-[3px] pointer-events-none select-none'}`;

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
            } catch (err: any) {
                console.error("Scan error:", err);
                setError(err.message || "Failed to load page");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [params.qrId, sessionId]);

    const groups = React.useMemo(() => {
        if (!qrData?.menuItems) return {};
        return qrData.menuItems.reduce((acc: any, item: any) => {
            const cat = (typeof item === 'object' && item.category && item.category.trim() !== "") ? item.category.trim() : 'Menu';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(item);
            return acc;
        }, {});
    }, [qrData?.menuItems]);

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

    const handleGenerate = async (selectedLanguage = language) => {
        if (!isLanguageUnlocked || selectedLanguage === "") {
            toast.warning("Please complete all details first!");
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
                    language: selectedLanguage,
                    rating,
                    selectedItems: reviewType === 'short' ? [] : selectedItems,
                    reviewType,
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
                let redirectUrl = qrData.googleMapsLink;
                if (!redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
                    redirectUrl = 'https://' + redirectUrl;
                }
                window.location.assign(redirectUrl);
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
                    let redirectUrl = qrData.googleMapsLink;
                    if (!redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
                        redirectUrl = 'https://' + redirectUrl;
                    }
                    window.location.assign(redirectUrl);
                } else {
                    toast.info("Please paste the copied review on Google.");
                }
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (error) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${bgClass} px-4 font-sans`}>
                <div className="text-center p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] shadow-sm max-w-md w-full">
                    <h1 className="text-2xl font-bold text-red-500 mb-2">Oops!</h1>
                    <p className="text-gray-300">{error}</p>
                </div>
            </div>
        );
    }

    if (!isMounted || loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center bg-black font-sans`}>
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
                width="60" height="60"
                viewBox="0 0 24 24"
                fill={isActive ? "#FDE047" : "#FFFBF6"}
                stroke={isActive ? "#EAB308" : "#E2D3BE"}
                strokeWidth={isActive ? "1" : "1.5"}
                className={`w-14 h-14 sm:w-16 sm:h-16 drop-shadow-md`}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
            </svg>
        </button>
    );

    return (
        <div className={`min-h-screen ${bgClass} text-white py-6 px-4 font-sans selection:bg-white/30 selection:text-white relative`}>
            {isDairyDon && isLightMode && <DairyDonBackground />}
            {isTexna && isLightMode && <TexnaBackground />}
            <div className="max-w-[800px] mx-auto space-y-5 relative z-10">
                {isDairyDon && (
                    <div className="text-center pt-2 pb-2">
                        <h1 className="text-[52px] sm:text-[64px] md:text-[72px] font-bold text-white tracking-wider" style={{ fontFamily: "'Fredoka', 'Baloo 2', 'Pacifico', cursive", textShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
                            Dairy Don
                        </h1>
                    </div>
                )}
                {isTexna && (
                    <div className="text-center pt-2 pb-2">
                        <h1 className="text-[48px] sm:text-[56px] md:text-[64px] font-bold text-white tracking-widest uppercase" style={{ fontFamily: "'Inter', 'Roboto', sans-serif", letterSpacing: "0.1em", textShadow: "0 4px 12px rgba(0,0,0,0.4)" }}>
                            TEXNA
                        </h1>
                        <p className="text-blue-200 font-medium text-sm tracking-widest mt-1">B2B TEXTILE MACHINERY</p>
                    </div>
                )}
                {isRuby && <RubyLogo />}

                {/* 1. Visit Details Form */}
                <div className={mainCardClass}>
                    {/* Header */}
                    <h2 className={headingClass}>
                        <span className={stepCircleClass}>
                            1
                        </span>
                        Aapki Visit Details
                    </h2>

                    <div className={dividerClass}></div>

                    {!reviewType ? (
                        <div className="flex flex-col gap-4 py-2">
                            <label className={labelClass}>Review ka type select karein</label>
                            <button
                                onClick={() => setReviewType('short')}
                                className={btnPrimaryClass}
                            >
                                Short Review (Quick Rating)
                            </button>
                            <button
                                onClick={() => setReviewType('detailed')}
                                className={isLightMode ? `w-full bg-transparent border-2 ${themeClasses.border} ${themeClasses.text} font-bold text-[17px] py-[16px] rounded-xl shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${themeClasses.bgOpacity5.replace('bg-', 'hover:bg-')}` : "w-full bg-transparent border-2 border-white text-white font-bold text-[17px] py-[16px] rounded-xl shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 hover:bg-white/10"}
                            >
                                Detailed Review (Menu Items)
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center bg-gray-100/10 p-2 rounded-lg mb-2">
                                <span className={labelSmallClass}>{reviewType === 'short' ? 'Short Review' : 'Detailed Review'}</span>
                                <button
                                    onClick={() => { setReviewType(null); setSelectedItems([]); setRating(0); setLanguage(""); setDraft(""); setStep(1); }}
                                    className={`text-sm underline ${isLightMode ? themeClasses.text : 'text-blue-400'}`}
                                >
                                    Change Option
                                </button>
                            </div>

                            {/* Items Section */}
                            {reviewType === 'detailed' && qrData?.menuItems && qrData.menuItems.length > 0 && (
                                <div className="animate-in fade-in duration-300">
                                    <label className={labelClass}>Aapne kya order kiya? (Jo items try ki wo select kero menu me se)</label>
                                    <p className={subLabelClass}>Up to 4 items select karo — review mein mention honge</p>

                                    <div className="mt-4">
                                        {(() => {
                                            const allCategories = ["All", ...Object.keys(groups)];
                                            let itemsToDisplay: any[] = [];

                                            // Extract items based on selected category
                                            if (selectedCategory === "All") {
                                                // Group all items
                                                Object.values(groups).forEach((items: any) => {
                                                    itemsToDisplay.push(...items);
                                                });
                                            } else {
                                                itemsToDisplay = groups[selectedCategory] || [];
                                            }

                                            // Limit logic
                                            const MAX_INITIAL_ITEMS = 12;
                                            const hasMore = !showAllMenu && itemsToDisplay.length > MAX_INITIAL_ITEMS;
                                            const visibleItems = showAllMenu ? itemsToDisplay : itemsToDisplay.slice(0, MAX_INITIAL_ITEMS);

                                            return (
                                                <div className="flex flex-col gap-4">
                                                    {/* Category Tabs */}
                                                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide hide-scrollbar w-full snap-x">
                                                        {allCategories.map(cat => (
                                                            <button
                                                                key={cat}
                                                                onClick={() => {
                                                                    setSelectedCategory(cat);
                                                                    setShowAllMenu(false); // reset limit when switching categories
                                                                }}
                                                                className={`shrink-0 px-4 py-2 rounded-full text-[14px] font-semibold transition-colors border snap-start outline-none ${selectedCategory === cat
                                                                    ? (isLightMode ? `${themeClasses.bg} text-white ${themeClasses.border}` : 'bg-white text-black border-white')
                                                                    : (isLightMode ? 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50' : 'bg-transparent text-white border-white/20 hover:bg-white/10')
                                                                    }`}
                                                            >
                                                                {cat === "Menu" ? "Other" : cat}
                                                            </button>
                                                        ))}
                                                    </div>

                                                    {/* Items Grid */}
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                                                        {visibleItems.map((item: any, idx: number) => {
                                                            const itemName = typeof item === 'string' ? item : item.name;
                                                            const itemPrice = typeof item === 'object' && item.price ? item.price : null;

                                                            return (
                                                                <label key={`${selectedCategory}-${idx}`} className={getMenuItemClass(selectedItems.includes(itemName))}>
                                                                    <div className={`w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] rounded-full border flex items-center justify-center shrink-0 ${checkboxBorderClass}`}>
                                                                        {selectedItems.includes(itemName) && (
                                                                            <div className={`w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] rounded-full ${checkboxDotClass}`}></div>
                                                                        )}
                                                                    </div>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedItems.includes(itemName)}
                                                                        onChange={() => toggleItem(itemName)}
                                                                        className="hidden"
                                                                    />
                                                                    <div className="flex flex-col overflow-hidden">
                                                                        <span className={`${menuItemTextClass} text-[13px] sm:text-[15px] leading-tight mb-0.5`}>{itemName}</span>
                                                                        {itemPrice && <span className={`${menuItemPriceClass} text-[11px] sm:text-[12px] opacity-80`}>₹{itemPrice}</span>}
                                                                    </div>
                                                                </label>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Show More Button */}
                                                    {hasMore && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowAllMenu(true)}
                                                            className={`mt-2 w-full py-3 rounded-lg font-semibold text-[15px] transition-colors border ${isLightMode ? `bg-[${themeColor}]/10 text-[${themeColor}] border-[${themeColor}]/30 hover:bg-[${themeColor}]/20` : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
                                                        >
                                                            Show {itemsToDisplay.length - MAX_INITIAL_ITEMS} More {selectedCategory === "All" ? "Items" : selectedCategory}
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            )}



                            {/* Rating */}
                            <div className={getSectionClass(isRatingUnlocked)}>
                                <label className={labelSmallClass}>Rating</label>
                                <div className="flex gap-1.5 ml-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <StarRating key={star} isActive={rating >= star} onClick={() => setRating(star)} />
                                    ))}
                                </div>
                            </div>



                            {/* Language */}
                            <div className={getSectionClass(isLanguageUnlocked)}>
                                <label className={labelSmallClass}>Language</label>
                                <select
                                    value={language}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setLanguage(val);
                                        handleGenerate(val);
                                    }}
                                    className={inputClass}
                                >
                                    <option value="" disabled>Select Language</option>
                                    {LANGUAGES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>

                        </div>
                    )}
                </div>

                {/* Loading State */}
                {generating && (
                    <div className={`${mainCardClass} flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-300`}>
                        <Loader2 className={`w-12 h-12 ${isLightMode ? themeClasses.text : 'text-white'} animate-spin mb-4`} />
                        <p className={`${isLightMode ? themeClasses.text : 'text-white'} font-bold text-lg`}>Generating Your Review...</p>
                    </div>
                )}

                {/* 2. Aapka Review */}
                {step === 2 && !generating && (
                    <div className={`${reviewCardTopClass} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                        <h2 className={headingClass}>
                            <span className={stepCircleClass}>
                                2
                            </span>
                            Aapka Review
                        </h2>
                        <div className={dividerClass}></div>

                        <div className={reviewCardClass}>
                            <textarea
                                id="review-text"
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                className={reviewTextAreaClass}
                            />

                            <div className="mt-6 font-medium text-[15px] flex flex-col gap-2.5">
                                <div className={reviewMetaTextClass}>
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
                                    <div className={reviewLocationClass}>
                                        <MapPin className={`w-4 h-4 ${iconColor}`} />
                                        {qrData.businessName}{qrData.location ? `, ${qrData.location}` : ""}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleCopyAndRedirect}
                                disabled={submitting}
                                className={btnPrimaryClass}
                            >
                                <Clipboard className="w-5 h-5 pointer-events-none" />
                                Copy & Redirect
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
