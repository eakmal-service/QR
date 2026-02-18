"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

interface QRCode {
    id: string;
    businessName: string;
    productSummary: string;
    visitUrl: string;
    createdAt: string;
    analytics: {
        totalScans: number;
        totalReviews: number;
        totalSubmissions: number;
        averageRating: number;
        conversionRate: string;
    };
}

export default function AdminQRCodesPage() {
    const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        businessName: "",
        productSummary: "",
        businessId: "",
    });
    const [creating, setCreating] = useState(false);
    const [selectedQR, setSelectedQR] = useState<string | null>(null);

    useEffect(() => {
        fetchQRCodes();
    }, []);

    const fetchQRCodes = async () => {
        try {
            const response = await fetch("/api/admin/qr-codes/list");
            const data = await response.json();
            if (data.success) {
                setQrCodes(data.qrCodes);
            }
        } catch (error) {
            console.error("Error fetching QR codes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);

        try {
            const response = await fetch("/api/admin/qr-codes/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (data.success) {
                alert("QR Code created successfully!");
                setShowForm(false);
                setFormData({ businessName: "", productSummary: "", businessId: "" });
                fetchQRCodes();
            }
        } catch (error) {
            console.error("Error creating QR code:", error);
            alert("Failed to create QR code");
        } finally {
            setCreating(false);
        }
    };

    const downloadQR = async (qrId: string, businessName: string) => {
        try {
            const response = await fetch(`/api/qr/image/${qrId}`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${businessName.replace(/\s+/g, "-")}-qr.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
            alert("Failed to download QR code");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">QR Code Management</h1>
                        <p className="text-gray-600 mt-2">Create and manage QR codes for Smart Auto-Review</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        {showForm ? "Cancel" : "+ Create New QR Code"}
                    </button>
                </div>

                {/* Create Form */}
                {showForm && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <h2 className="text-xl font-bold mb-4">Create New QR Code</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Business Name *</label>
                                <input
                                    type="text"
                                    value={formData.businessName}
                                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., The Coffee House"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Product/Service Summary</label>
                                <textarea
                                    value={formData.productSummary}
                                    onChange={(e) => setFormData({ ...formData, productSummary: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Premium artisan coffee and fresh pastries"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Custom ID (optional)</label>
                                <input
                                    type="text"
                                    value={formData.businessId}
                                    onChange={(e) => setFormData({ ...formData, businessId: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., my-coffee-shop (leave empty for auto-generated)"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={creating}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors"
                            >
                                {creating ? "Creating..." : "Create QR Code"}
                            </button>
                        </form>
                    </div>
                )}

                {/* QR Codes List */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {qrCodes.map((qr) => (
                        <div key={qr.id} className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{qr.businessName}</h3>
                                    <p className="text-sm text-gray-500">ID: {qr.id}</p>
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-semibold">
                                    Active
                                </span>
                            </div>

                            <p className="text-sm text-gray-600 mb-4">{qr.productSummary}</p>

                            {/* QR Code */}
                            <div className="bg-gray-50 p-4 rounded-lg mb-4 flex justify-center" id={`qr-${qr.id}`}>
                                <img
                                    src={`/api/qr/image/${qr.id}`}
                                    alt={`QR code for ${qr.businessName}`}
                                    className="w-48 h-48"
                                />
                            </div>

                            {/* Analytics */}
                            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <div className="text-blue-600 font-semibold">{qr.analytics.totalScans}</div>
                                    <div className="text-gray-600">Scans</div>
                                </div>
                                <div className="bg-green-50 p-3 rounded-lg">
                                    <div className="text-green-600 font-semibold">{qr.analytics.totalReviews}</div>
                                    <div className="text-gray-600">Reviews</div>
                                </div>
                                <div className="bg-purple-50 p-3 rounded-lg">
                                    <div className="text-purple-600 font-semibold">{qr.analytics.averageRating}</div>
                                    <div className="text-gray-600">Avg Rating</div>
                                </div>
                                <div className="bg-orange-50 p-3 rounded-lg">
                                    <div className="text-orange-600 font-semibold">{qr.analytics.conversionRate}</div>
                                    <div className="text-gray-600">Conv. Rate</div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => downloadQR(qr.id, qr.businessName)}
                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors"
                                >
                                    📥 Download
                                </button>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(qr.visitUrl);
                                        alert("URL copied!");
                                    }}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors"
                                >
                                    🔗 Copy URL
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {qrCodes.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No QR codes yet. Create your first one!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
