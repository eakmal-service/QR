"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { read, utils } from "xlsx";

interface QRCode {
    id: string;
    businessId: string;
    businessName: string;
    businessCategory?: string;
    businessType?: string;
    productSummary: string;
    description: string;
    menuItems?: any[];
    visitUrl: string;
    createdAt: string;
    isActive: boolean;
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
        businessCategory: "",
        businessType: "",
        productSummary: "",
        description: "",
        businessId: "",
        menuItems: [] as { name: string, price: string }[],
    });
    const [newItemName, setNewItemName] = useState("");
    const [newItemPrice, setNewItemPrice] = useState("");
    const CATEGORIES = ["Ice Cream Parlor", "Restaurant", "Cafe", "Hotel", "Hospital", "Car Rental", "Retail", "Service", "Other"];
    const [creating, setCreating] = useState(false);
    const [selectedQR, setSelectedQR] = useState<string | null>(null);
    const [downloadSettings, setDownloadSettings] = useState<Record<string, { format: string; size: number }>>({});
    const [editingQrId, setEditingQrId] = useState<string | null>(null);
    const [editDesc, setEditDesc] = useState("");
    const [role, setRole] = useState<string | null>(null);
    const [isEditingForm, setIsEditingForm] = useState(false);
    const [editingFormId, setEditingFormId] = useState<string | null>(null);

    useEffect(() => {
        setRole(localStorage.getItem("simulatedAdminRole") || "SUPER_ADMIN");
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

    const handleToggleStatus = async (qrId: string, currentStatus: boolean) => {
        try {
            const response = await fetch("/api/admin/qr-codes/toggle", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ qrId, isActive: !currentStatus }),
            });
            const data = await response.json();
            if (data.success) {
                fetchQRCodes();
            } else {
                alert("Failed to toggle status");
            }
        } catch (error) {
            console.error("Error toggling status:", error);
            alert("Failed to toggle status");
        }
    };

    const handleUpdateDescription = async (qrId: string) => {
        try {
            const response = await fetch("/api/admin/qr-codes/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ qrId, productSummary: editDesc }),
            });
            const data = await response.json();
            if (data.success) {
                setEditingQrId(null);
                fetchQRCodes();
            } else {
                alert("Failed to update description");
            }
        } catch (error) {
            console.error("Error updating description:", error);
            alert("Failed to update description");
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setIsEditingForm(false);
        setEditingFormId(null);
        setFormData({ businessName: "", businessCategory: "", businessType: "", productSummary: "", description: "", businessId: "", menuItems: [] });
    };

    const handleEditClick = (qr: QRCode) => {
        setFormData({
            businessName: qr.businessName || "",
            businessCategory: qr.businessCategory || "",
            businessType: qr.businessType || "",
            productSummary: qr.productSummary || "",
            description: qr.description || "",
            businessId: qr.businessId || qr.id,
            menuItems: qr.menuItems || [],
        });
        setEditingFormId(qr.id);
        setIsEditingForm(true);
        setShowForm(true);
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);

        try {
            const endpoint = isEditingForm ? "/api/admin/qr-codes/update" : "/api/admin/qr-codes/create";
            const method = isEditingForm ? "PUT" : "POST";
            const payload = isEditingForm ? { id: editingFormId, ...formData } : formData;

            const response = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (data.success) {
                alert(`QR Code ${isEditingForm ? "updated" : "created"} successfully!`);
                handleCancelForm();
                fetchQRCodes();
            } else {
                alert(`Failed to ${isEditingForm ? "update" : "create"} QR code`);
            }
        } catch (error) {
            console.error(`Error ${isEditingForm ? "updating" : "creating"} QR code:`, error);
            alert(`Failed to ${isEditingForm ? "update" : "create"} QR code`);
        } finally {
            setCreating(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const data = await file.arrayBuffer();
            const workbook = read(data);
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            // Expected format is an array of arrays representing rows: [ [name, price], [name, price] ]
            const json = utils.sheet_to_json<any[]>(worksheet, { header: 1 });

            const newItems: { name: string, price: string }[] = [];

            // Skip header if it exists (e.g. if row 0 is ["Item Name", "Price"])
            const startIndex = (json[0] && (String(json[0][0]).toLowerCase().includes('name') || String(json[0][0]).toLowerCase().includes('item'))) ? 1 : 0;

            for (let i = startIndex; i < json.length; i++) {
                const row = json[i];
                if (row && row.length > 0 && row[0]) {
                    const itemName = String(row[0]).trim();
                    const itemPrice = row.length > 1 && row[1] != null ? String(row[1]).trim() : "";

                    if (itemName) {
                        newItems.push({ name: itemName, price: itemPrice });
                    }
                }
            }

            if (newItems.length > 0) {
                setFormData(prev => ({ ...prev, menuItems: [...prev.menuItems, ...newItems] }));
                alert(`Successfully added ${newItems.length} items from ${file.name}`);
            } else {
                alert("No valid items found in the file. Ensure the format is [Item Name] | [Price].");
            }

        } catch (error) {
            console.error("Error parsing file:", error);
            alert("Failed to parse the file. Ensure it is a valid Excel or CSV file.");
        } finally {
            // Reset input so the same file could be uploaded again if needed
            e.target.value = "";
        }
    };

    const handleSettingChange = (qrId: string, key: 'format' | 'size', value: string | number) => {
        setDownloadSettings(prev => ({
            ...prev,
            [qrId]: {
                ...(prev[qrId] || { format: 'png', size: 400 }),
                [key]: value
            }
        }));
    };

    const downloadQR = async (qrId: string, businessName: string) => {
        try {
            const settings = downloadSettings[qrId] || { format: 'png', size: 400 };
            const response = await fetch(`/api/qr/image/${qrId}?format=${settings.format}&size=${settings.size}`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${businessName.replace(/\s+/g, "-")}-qr-${settings.size}.${settings.format}`;
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
            <div className="flex h-[50vh] items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="py-2">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">QR Code Management</h1>
                        <p className="text-gray-600 mt-2">Create and manage QR codes for Smart Auto-Review</p>
                    </div>
                    <button
                        onClick={() => {
                            if (showForm) {
                                handleCancelForm();
                            } else {
                                handleCancelForm();
                                setShowForm(true);
                                const mainContent = document.querySelector('main');
                                if (mainContent) {
                                    mainContent.scrollTo({ top: 0, behavior: 'smooth' });
                                } else {
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }
                            }
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        {showForm ? "Cancel" : "+ Create New QR Code"}
                    </button>
                </div>

                {/* Create/Edit Form */}
                {showForm && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <h2 className="text-xl font-bold mb-4">{isEditingForm ? "Edit QR Code Details" : "Create New QR Code"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Business Category</label>
                                    <select
                                        value={formData.businessCategory}
                                        onChange={(e) => setFormData({ ...formData, businessCategory: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        <option value="">Select Category</option>
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Business Type (B2B/B2C)</label>
                                    <input
                                        type="text"
                                        value={formData.businessType}
                                        onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., B2C"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium">Menu / Service Items (Optional)</label>
                                    <div>
                                        <input
                                            type="file"
                                            id="bulkUpload"
                                            className="hidden"
                                            accept=".xlsx, .xls, .csv"
                                            onChange={handleFileUpload}
                                        />
                                        <label
                                            htmlFor="bulkUpload"
                                            className="cursor-pointer text-xs bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1"
                                        >
                                            📥 Bulk Upload (Excel/CSV)
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={newItemName}
                                        onChange={(e) => setNewItemName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                if (newItemName.trim()) {
                                                    setFormData({ ...formData, menuItems: [...formData.menuItems, { name: newItemName.trim(), price: newItemPrice.trim() }] });
                                                    setNewItemName("");
                                                    setNewItemPrice("");
                                                }
                                            }
                                        }}
                                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Item Name (e.g., Kaju Anjeer)"
                                    />
                                    <input
                                        type="text"
                                        value={newItemPrice}
                                        onChange={(e) => setNewItemPrice(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                if (newItemName.trim()) {
                                                    setFormData({ ...formData, menuItems: [...formData.menuItems, { name: newItemName.trim(), price: newItemPrice.trim() }] });
                                                    setNewItemName("");
                                                    setNewItemPrice("");
                                                }
                                            }
                                        }}
                                        className="w-1/3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Price (Optional)"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (newItemName.trim()) {
                                                setFormData({ ...formData, menuItems: [...formData.menuItems, { name: newItemName.trim(), price: newItemPrice.trim() }] });
                                                setNewItemName("");
                                                setNewItemPrice("");
                                            }
                                        }}
                                        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-medium"
                                    >
                                        Add
                                    </button>
                                </div>
                                {formData.menuItems.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.menuItems.map((item, index) => {
                                            // Handle both legacy strings and new `{name, price}` objects for safety
                                            const displayName = typeof item === 'string' ? item : item.name;
                                            const displayPrice = typeof item === 'object' && item.price ? ` - ${item.price}` : '';

                                            return (
                                                <span key={index} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                                                    {displayName}{displayPrice}
                                                    <button type="button" onClick={() => {
                                                        setFormData({ ...formData, menuItems: formData.menuItems.filter((_, i) => i !== index) });
                                                    }} className="text-blue-600 hover:text-blue-900 ml-1">&times;</button>
                                                </span>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Product/Service Summary</label>
                                <textarea
                                    value={formData.productSummary}
                                    onChange={(e) => setFormData({ ...formData, productSummary: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Premium artisan coffee and fresh pastries"
                                    rows={2}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Detailed Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Detailed information about the business, target audience, and key selling points to help AI generate better reviews."
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
                                {isEditingForm ? (creating ? "Updating..." : "Update QR Code") : (creating ? "Creating..." : "Create QR Code")}
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
                                    {role === "SUPER_ADMIN" && (
                                        <p className="text-sm text-gray-500">ID: {qr.id}</p>
                                    )}
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-3 py-1 text-xs rounded-full font-semibold ${qr.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {qr.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                    {role === "SUPER_ADMIN" && (
                                        <button
                                            onClick={() => handleToggleStatus(qr.id, qr.isActive)}
                                            className={`text-xs px-2 py-1 rounded border font-medium transition-colors ${qr.isActive ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}
                                        >
                                            {qr.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4">
                                {editingQrId === qr.id ? (
                                    <div className="space-y-2">
                                        <textarea
                                            className="w-full text-sm p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                                            rows={6}
                                            value={editDesc}
                                            onChange={(e) => setEditDesc(e.target.value)}
                                        />
                                        <div className="flex gap-2">
                                            <button onClick={() => handleUpdateDescription(qr.id)} className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors font-medium">Save</button>
                                            <button onClick={() => setEditingQrId(null)} className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition-colors font-medium">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="group relative">
                                        <p className="text-sm text-gray-800 font-medium leading-relaxed">{qr.productSummary || "No description provided."}</p>
                                        {role === "SUPER_ADMIN" && (
                                            <button
                                                onClick={() => {
                                                    setEditingQrId(qr.id);
                                                    setEditDesc(qr.productSummary || "");
                                                }}
                                                className="text-xs font-semibold text-blue-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ✎ Edit Description
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

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
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-2 mb-2">
                                    <button
                                        onClick={() => handleEditClick(qr)}
                                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-1.5 px-3 rounded-lg text-sm font-semibold transition-colors"
                                    >
                                        ✏️ Edit Details
                                    </button>
                                </div>
                                <div className="flex gap-2 mb-2">
                                    <select
                                        className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 py-1.5 px-3 rounded-lg text-sm transition-colors"
                                        value={downloadSettings[qr.id]?.format || 'png'}
                                        onChange={(e) => handleSettingChange(qr.id, 'format', e.target.value)}
                                    >
                                        <option value="png">PNG</option>
                                        <option value="jpeg">JPEG</option>
                                        <option value="svg">SVG</option>
                                    </select>
                                    <select
                                        className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 py-1.5 px-3 rounded-lg text-sm transition-colors"
                                        value={downloadSettings[qr.id]?.size || 400}
                                        onChange={(e) => handleSettingChange(qr.id, 'size', Number(e.target.value))}
                                    >
                                        <option value={200}>Small (200px)</option>
                                        <option value={400}>Medium (400px)</option>
                                        <option value={800}>Large (800px)</option>
                                        <option value={1200}>HD (1200px)</option>
                                    </select>
                                </div>
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
