"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Coffee, Wrench, Sprout, ArrowRight, QrCode } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner"; // Assuming sonner is set up as per previous tasks

export default function SmartReviewPage() {
    const qrCodes = [
        {
            id: "test-qr-1",
            name: "The Coffee House",
            summary: "Premium coffee and pastries",
            icon: Coffee,
            color: "text-amber-400",
            bg: "bg-amber-400/10",
            border: "border-amber-400/20 hover:border-amber-400/50"
        },
        {
            id: "test-qr-2",
            name: "Tech Repair Shop",
            summary: "Fast and reliable repair services",
            icon: Wrench,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
            border: "border-blue-400/20 hover:border-blue-400/50"
        },
        {
            id: "test-qr-3",
            name: "Yoga Studio",
            summary: "Peaceful yoga classes",
            icon: Sprout,
            color: "text-green-400",
            bg: "bg-green-400/10",
            border: "border-green-400/20 hover:border-green-400/50"
        },
    ];

    const [formData, setFormData] = useState({
        businessName: "",
        googleMapsLink: "",
        businessType: "",
        location: "",
        description: "", // Added description field
    });
    const [loading, setLoading] = useState(false);
    const [generatedQr, setGeneratedQr] = useState<{ visitUrl: string; id: string } | null>(null);

    const handleCreateQr = async () => {
        if (!formData.businessName || !formData.googleMapsLink || !formData.businessType || !formData.location) {
            toast.error("Please fill in all required fields");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/admin/qr-codes/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    businessName: formData.businessName,
                    // Include description in productSummary for AI context
                    productSummary: `${formData.description ? formData.description + ". " : ""}${formData.businessType} in ${formData.location}`,
                    businessId: undefined, // Let backend generate ID
                    googleMapsLink: formData.googleMapsLink,
                    businessType: formData.businessType,
                    location: formData.location,
                    metadata: {
                        type: "smart-review-qr",
                        description: formData.description // Store description in metadata too
                    },
                }),
            });

            const data = await response.json();
            if (response.ok && data.success) {
                setGeneratedQr(data.qrCode);
                toast.success("Smart Review QR Generated!");
            } else {
                toast.error(data.error || "Failed to generate QR");
            }
        } catch (error) {
            console.error("Error generating QR:", error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Header with Create Button */}
                <div className="mb-12 flex justify-between items-start">
                    <div>
                        <Link href="/">
                            <Button variant="ghost" className="mb-6 hover:bg-zinc-900 text-gray-400 hover:text-white pl-0">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Home
                            </Button>
                        </Link>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-violet-500/10 rounded-xl border border-violet-500/20">
                                <Star className="w-8 h-8 text-violet-400 fill-violet-400/20" />
                            </div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                Smart Auto-Review
                            </h1>
                        </div>
                        <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                            Experience the future of feedback. Our AI automatically generates personalized, context-aware reviews for your business in multiple languages.
                        </p>
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-violet-600 hover:bg-violet-700 text-white gap-2" size="lg">
                                <QrCode className="w-4 h-4" />
                                Generate QR for Review
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold">Create Smart Review QR</DialogTitle>
                            </DialogHeader>
                            {!generatedQr ? (
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Business Name</Label>
                                        <Input
                                            placeholder="e.g. The Coffee House"
                                            className="bg-zinc-900 border-zinc-800 focus:ring-violet-500"
                                            value={formData.businessName}
                                            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Google Business Page Link</Label>
                                        <Input
                                            placeholder="https://g.page/..."
                                            className="bg-zinc-900 border-zinc-800 focus:ring-violet-500"
                                            value={formData.googleMapsLink}
                                            onChange={(e) => setFormData({ ...formData, googleMapsLink: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Business Type</Label>
                                            <Input
                                                placeholder="e.g. Cafe"
                                                className="bg-zinc-900 border-zinc-800 focus:ring-violet-500"
                                                value={formData.businessType}
                                                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Location</Label>
                                            <Input
                                                placeholder="e.g. New York"
                                                className="bg-zinc-900 border-zinc-800 focus:ring-violet-500"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Business Description (Optional)</Label>
                                        <Input
                                            placeholder="e.g. Cozy atmosphere, specializing in artisanal coffee and vegan treats."
                                            className="bg-zinc-900 border-zinc-800 focus:ring-violet-500"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                        <p className="text-xs text-gray-500">Helps AI generate more accurate reviews.</p>
                                    </div>
                                    <Button
                                        className="w-full bg-violet-600 hover:bg-violet-700 mt-4"
                                        onClick={handleCreateQr}
                                        disabled={loading}
                                    >
                                        {loading ? "Generating..." : "Generate QR Code"}
                                    </Button>
                                </div>
                            ) : (
                                <div className="py-6 flex flex-col items-center text-center space-y-4">
                                    <div className="p-4 bg-white rounded-xl">
                                        {/* Using Python backend to generate QR image */}
                                        <img
                                            src={`/api/qr/image/${generatedQr.id}`}
                                            alt="QR Code"
                                            className="w-48 h-48"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 mb-2">Scan to test your Smart Review flow</p>
                                        <Link href={generatedQr.visitUrl} target="_blank">
                                            <Button variant="outline" className="text-violet-400 border-violet-500/20 hover:bg-violet-500/10">
                                                Test Link Direct Access
                                            </Button>
                                        </Link>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setGeneratedQr(null);
                                            setFormData({ businessName: "", googleMapsLink: "", businessType: "", location: "", description: "" });
                                        }}
                                        className="text-gray-400 hover:text-white"
                                    >
                                        Create Another
                                    </Button>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Demo Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    {qrCodes.map((qr) => (
                        <Link
                            key={qr.id}
                            href={`/visit/${qr.id}`}
                            className={`group relative overflow-hidden rounded-2xl border ${qr.border} bg-zinc-900/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:bg-zinc-900`}
                        >
                            <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
                                <qr.icon className={`w-24 h-24 ${qr.color}`} />
                            </div>

                            <div className="relative z-10">
                                <div className={`w-12 h-12 rounded-xl ${qr.bg} flex items-center justify-center mb-4 ring-1 ring-white/5`}>
                                    <qr.icon className={`w-6 h-6 ${qr.color}`} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white/90">
                                    {qr.name}
                                </h3>
                                <p className="text-sm text-gray-400 mb-6 min-h-[40px]">
                                    {qr.summary}
                                </p>
                                <div className="flex items-center text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                                    Try Demo <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Info Section */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-zinc-900/30 rounded-2xl p-8 border border-white/5">
                        <h3 className="text-2xl font-bold text-white mb-6">How It Works</h3>
                        <div className="space-y-6">
                            {[
                                { step: "01", title: "Scan & Visit", desc: "Customer scans the QR code specific to your business." },
                                { step: "02", title: "AI Generation", desc: "Our Gemini-powered AI analyzes your business type and generates a unique review." },
                                { step: "03", title: "Review & Edit", desc: "Customer sees the review, can edit it, and select their preferred language." },
                                { step: "04", title: "Submit", desc: "One-click submission to save the review permanently." }
                            ].map((item) => (
                                <div key={item.step} className="flex gap-4">
                                    <span className="text-violet-500 font-mono font-bold text-lg opacity-80">{item.step}</span>
                                    <div>
                                        <h4 className="text-white font-medium mb-1">{item.title}</h4>
                                        <p className="text-sm text-gray-400">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-2xl p-8 border border-violet-500/20">
                            <h3 className="text-xl font-bold text-white mb-4">🚀 Key Features</h3>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                                    Multi-language Support (English, Hindi, etc.)
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                                    Context-Aware Content
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                                    Real-time Streaming
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                                    Duplicate Prevention
                                </li>
                            </ul>
                        </div>

                        <div className="bg-amber-500/5 rounded-2xl p-6 border border-amber-500/10">
                            <h3 className="text-lg font-bold text-amber-500 mb-2 flex items-center gap-2">
                                ⚠️ Setup Required
                            </h3>
                            <p className="text-sm text-amber-200/60 leading-relaxed">
                                Ensure you have configured your <code className="bg-amber-500/10 px-1.5 py-0.5 rounded text-amber-500 font-mono text-xs">GEMINI_API_KEY</code> in the <code className="bg-amber-500/10 px-1.5 py-0.5 rounded text-amber-500 font-mono text-xs">.env.local</code> file to use the AI generation features.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
