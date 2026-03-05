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
        menuItems: [] as { category?: string, name: string, price: string }[],
    });
    const [newItemCategory, setNewItemCategory] = useState("");
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

            // Expected format could be [name, price] OR [category, name, price]
            const json = utils.sheet_to_json<any[]>(worksheet, { header: 1 });

            const newItems: { category?: string, name: string, price: string }[] = [];

            // Skip header if it exists
            const startIndex = (json[0] && (String(json[0]).toLowerCase().includes('name') || String(json[0]).toLowerCase().includes('item') || String(json[0]).toLowerCase().includes('category'))) ? 1 : 0;

            for (let i = startIndex; i < json.length; i++) {
                const row = json[i];
                if (row && row.length > 0) {
                    // check if 3 columns: category, name, price
                    let itemCategory = "";
                    let itemName = "";
                    let itemPrice = "";

                    if (row.length >= 3) {
                        itemCategory = String(row[0]).trim();
                        itemName = String(row[1]).trim();
                        itemPrice = row[2] != null ? String(row[2]).trim() : "";
                    } else if (row.length >= 1) {
                        itemName = String(row[0]).trim();
                        itemPrice = row.length > 1 && row[1] != null ? String(row[1]).trim() : "";
                    }

                    if (itemName) {
                        const targetCategory = newItemCategory.trim().toLowerCase();
                        if (targetCategory && itemCategory.toLowerCase() !== targetCategory) {
                            continue;
                        }
                        newItems.push({ category: itemCategory, name: itemName, price: itemPrice });
                    }
                }
            }

            if (newItems.length > 0) {
                setFormData(prev => ({ ...prev, menuItems: [...prev.menuItems, ...newItems] }));
                const filterMsg = newItemCategory.trim() ? ` (filtered by '${newItemCategory.trim()}')` : "";
                alert(`Successfully added ${newItems.length} items from ${file.name}${filterMsg}`);
            } else {
                alert("No valid items found in the file. Ensure the format is [Category?] | [Item Name] | [Price], and check your category filter if applied.");
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
        <div className="py-2 min-h-screen bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">QR Code Management</h1>
                        <p className="text-gray-400 mt-2">Create and manage QR codes for Smart Auto-Review</p>
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
                        className="bg-white hover:bg-gray-200 text-black px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        {showForm ? "Cancel" : "+ Create New QR Code"}
                    </button>
                </div>

                {/* Create/Edit Form */}
                {showForm && (
                    <div className="bg-[#1a1a1a] border border-[#404040] rounded-xl shadow-md p-6 mb-8">
                        <h2 className="text-xl font-bold mb-4 text-white">{isEditingForm ? "Edit QR Code Details" : "Create New QR Code"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">Business Name *</label>
                                <input
                                    type="text"
                                    value={formData.businessName}
                                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                    className="w-full px-4 py-2 bg-black border border-[#404040] text-white rounded-lg focus:ring-1 focus:ring-white focus:outline-none"
                                    placeholder="e.g., The Coffee House"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">Business Category</label>
                                    <select
                                        value={formData.businessCategory}
                                        onChange={(e) => setFormData({ ...formData, businessCategory: e.target.value })}
                                        className="w-full px-4 py-2 bg-black border border-[#404040] text-white rounded-lg focus:ring-1 focus:ring-white focus:outline-none"
                                    >
                                        <option value="">Select Category</option>
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">Business Type (B2B/B2C)</label>
                                    <input
                                        type="text"
                                        value={formData.businessType}
                                        onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                                        className="w-full px-4 py-2 bg-black border border-[#404040] text-white rounded-lg focus:ring-1 focus:ring-white focus:outline-none"
                                        placeholder="e.g., B2C"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-300">Menu / Service Items (Optional)</label>
                                    <div className="flex items-center gap-2">
                                        {formData.menuItems.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (window.confirm("Are you sure you want to delete all menu items?")) {
                                                        setFormData({ ...formData, menuItems: [] });
                                                    }
                                                }}
                                                className="text-xs bg-red-900/40 hover:bg-red-900/60 text-red-200 border border-red-900/50 px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1"
                                            >
                                                🗑️ Delete All
                                            </button>
                                        )}
                                        <input
                                            type="file"
                                            id="bulkUpload"
                                            className="hidden"
                                            accept=".xlsx, .xls, .csv"
                                            onChange={handleFileUpload}
                                        />
                                        <label
                                            htmlFor="bulkUpload"
                                            className="cursor-pointer text-xs bg-[#404040] hover:bg-gray-600 text-white border border-[#404040] px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1"
                                        >
                                            📥 Bulk Upload (Excel/CSV)
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={newItemCategory}
                                        onChange={(e) => setNewItemCategory(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                            }
                                        }}
                                        className="w-1/4 px-4 py-2 bg-black border border-[#404040] text-white rounded-lg focus:ring-1 focus:ring-white focus:outline-none"
                                        placeholder="Category (e.g., Ice Cream)"
                                    />
                                    <input
                                        type="text"
                                        value={newItemName}
                                        onChange={(e) => setNewItemName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                if (newItemName.trim()) {
                                                    setFormData({ ...formData, menuItems: [...formData.menuItems, { category: newItemCategory.trim(), name: newItemName.trim(), price: newItemPrice.trim() }] });
                                                    setNewItemName("");
                                                    setNewItemPrice("");
                                                }
                                            }
                                        }}
                                        className="flex-1 px-4 py-2 bg-black border border-[#404040] text-white rounded-lg focus:ring-1 focus:ring-white focus:outline-none"
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
                                                    setFormData({ ...formData, menuItems: [...formData.menuItems, { category: newItemCategory.trim(), name: newItemName.trim(), price: newItemPrice.trim() }] });
                                                    setNewItemName("");
                                                    setNewItemPrice("");
                                                }
                                            }
                                        }}
                                        className="w-1/4 px-4 py-2 bg-black border border-[#404040] text-white rounded-lg focus:ring-1 focus:ring-white focus:outline-none"
                                        placeholder="Price"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (newItemName.trim()) {
                                                setFormData({ ...formData, menuItems: [...formData.menuItems, { category: newItemCategory.trim(), name: newItemName.trim(), price: newItemPrice.trim() }] });
                                                setNewItemName("");
                                                setNewItemPrice("");
                                            }
                                        }}
                                        className="bg-[#404040] hover:bg-gray-600 text-white px-4 py-2 border border-[#404040] rounded-lg font-medium"
                                    >
                                        Add
                                    </button>
                                </div>
                                {formData.menuItems.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.menuItems.map((item, index) => {
                                            // Handle both legacy strings and new `{category, name, price}` objects for safety
                                            const displayName = typeof item === 'string' ? item : item.name;
                                            const displayPrice = typeof item === 'object' && item.price ? ` - ₹${item.price}` : '';
                                            const displayCategory = typeof item === 'object' && item.category ? `[${item.category}] ` : '';

                                            return (
                                                <span key={index} className="bg-[#2a2a2a] text-gray-300 border border-[#404040] text-xs px-3 py-1 rounded-full flex items-center gap-1">
                                                    <span className="font-semibold text-white">{displayCategory}</span>{displayName}{displayPrice}
                                                    <button type="button" onClick={() => {
                                                        setFormData({ ...formData, menuItems: formData.menuItems.filter((_, i) => i !== index) });
                                                    }} className="text-gray-400 hover:text-white ml-1">&times;</button>
                                                </span>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">Product/Service Summary</label>
                                <textarea
                                    value={formData.productSummary}
                                    onChange={(e) => setFormData({ ...formData, productSummary: e.target.value })}
                                    className="w-full px-4 py-2 bg-black border border-[#404040] text-white rounded-lg focus:ring-1 focus:ring-white focus:outline-none"
                                    placeholder="e.g., Premium artisan coffee and fresh pastries"
                                    rows={2}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">Detailed Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 bg-black border border-[#404040] text-white rounded-lg focus:ring-1 focus:ring-white focus:outline-none"
                                    placeholder="Detailed information about the business, target audience, and key selling points to help AI generate better reviews."
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">Custom ID (optional)</label>
                                <input
                                    type="text"
                                    value={formData.businessId}
                                    onChange={(e) => setFormData({ ...formData, businessId: e.target.value })}
                                    className="w-full px-4 py-2 bg-black border border-[#404040] text-white rounded-lg focus:ring-1 focus:ring-white focus:outline-none"
                                    placeholder="e.g., my-coffee-shop (leave empty for auto-generated)"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={creating}
                                className="w-full bg-white hover:bg-gray-200 disabled:bg-[#404040] disabled:text-gray-500 text-black py-3 rounded-lg font-semibold transition-colors"
                            >
                                {isEditingForm ? (creating ? "Updating..." : "Update QR Code") : (creating ? "Creating..." : "Create QR Code")}
                            </button>
                        </form>
                    </div>
                )}

                {/* QR Codes List */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {qrCodes.map((qr) => (
                        <div key={qr.id} className="bg-[#1a1a1a] border border-[#404040] rounded-xl shadow-md p-6 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-white">{qr.businessName}</h3>
                                    {role === "SUPER_ADMIN" && (
                                        <p className="text-sm text-gray-500">ID: {qr.id}</p>
                                    )}
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-3 py-1 text-xs rounded-full font-semibold ${qr.isActive ? 'bg-[rgba(255,255,255,0.15)] text-white border border-[rgba(200,200,220,0.3)]' : 'bg-red-900/40 text-red-200 border border-red-900/50'}`}>
                                        {qr.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                    {role === "SUPER_ADMIN" && (
                                        <button
                                            onClick={() => handleToggleStatus(qr.id, qr.isActive)}
                                            className={`text-xs px-2 py-1 rounded border font-medium transition-colors ${qr.isActive ? 'border-red-900/50 text-red-400 hover:bg-red-900/20' : 'border-[rgba(200,200,220,0.3)] text-gray-300 hover:bg-[rgba(255,255,255,0.1)]'}`}
                                        >
                                            {qr.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4 flex-grow">
                                {editingQrId === qr.id ? (
                                    <div className="space-y-2">
                                        <textarea
                                            className="w-full text-sm p-3 bg-black border border-[#404040] text-white rounded-md focus:ring-1 focus:ring-white focus:outline-none"
                                            rows={6}
                                            value={editDesc}
                                            onChange={(e) => setEditDesc(e.target.value)}
                                        />
                                        <div className="flex gap-2">
                                            <button onClick={() => handleUpdateDescription(qr.id)} className="text-xs bg-white hover:bg-gray-200 text-black px-4 py-2 rounded transition-colors font-medium">Save</button>
                                            <button onClick={() => setEditingQrId(null)} className="text-xs bg-[#404040] hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors font-medium">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="group relative">
                                        <p className="text-sm text-gray-300 font-medium leading-relaxed">{qr.productSummary || "No description provided."}</p>
                                        {role === "SUPER_ADMIN" && (
                                            <button
                                                onClick={() => {
                                                    setEditingQrId(qr.id);
                                                    setEditDesc(qr.productSummary || "");
                                                }}
                                                className="text-xs font-semibold text-white mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                                            >
                                                ✎ Edit Description
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* QR Code */}
                            <div className="bg-black border border-[#404040] p-4 rounded-lg mb-4 flex justify-center items-center" id={`qr-${qr.id}`}>
                                <img
                                    src={`/api/qr/image/${qr.id}`}
                                    alt={`QR code for ${qr.businessName}`}
                                    className="w-48 h-48 filter invert opacity-90"
                                />
                            </div>

                            {/* Analytics */}
                            <div className="grid grid-cols-2 gap-3 mb-4 text-sm mt-auto">
                                <div className="bg-[#2a2a2a] border border-[#404040] p-3 rounded-lg text-center">
                                    <div className="text-white font-semibold text-lg">{qr.analytics.totalScans}</div>
                                    <div className="text-gray-400 text-xs uppercase tracking-wider">Scans</div>
                                </div>
                                <div className="bg-[#2a2a2a] border border-[#404040] p-3 rounded-lg text-center">
                                    <div className="text-white font-semibold text-lg">{qr.analytics.totalReviews}</div>
                                    <div className="text-gray-400 text-xs uppercase tracking-wider">Reviews</div>
                                </div>
                                <div className="bg-[#2a2a2a] border border-[#404040] p-3 rounded-lg text-center">
                                    <div className="text-white font-semibold text-lg">{qr.analytics.averageRating}</div>
                                    <div className="text-gray-400 text-xs uppercase tracking-wider">Avg Rating</div>
                                </div>
                                <div className="bg-[#2a2a2a] border border-[#404040] p-3 rounded-lg text-center">
                                    <div className="text-white font-semibold text-lg">{qr.analytics.conversionRate}</div>
                                    <div className="text-gray-400 text-xs uppercase tracking-wider">Conv. Rate</div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-2 mb-2">
                                    <button
                                        onClick={() => handleEditClick(qr)}
                                        className="flex-1 bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] border border-[rgba(200,200,220,0.3)] text-white py-1.5 px-3 rounded-lg text-sm font-semibold transition-colors"
                                    >
                                        ✏️ Edit Details
                                    </button>
                                </div>
                                <div className="flex gap-2 mb-2">
                                    <select
                                        className="flex-1 bg-black border border-[#404040] text-gray-300 py-1.5 px-3 rounded-lg text-sm transition-colors focus:ring-1 focus:ring-white focus:outline-none"
                                        value={downloadSettings[qr.id]?.format || 'png'}
                                        onChange={(e) => handleSettingChange(qr.id, 'format', e.target.value)}
                                    >
                                        <option value="png">PNG</option>
                                        <option value="jpeg">JPEG</option>
                                        <option value="svg">SVG</option>
                                    </select>
                                    <select
                                        className="flex-1 bg-black border border-[#404040] text-gray-300 py-1.5 px-3 rounded-lg text-sm transition-colors focus:ring-1 focus:ring-white focus:outline-none"
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
                                        className="flex-1 bg-[#404040] hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors"
                                    >
                                        📥 Download
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(qr.visitUrl);
                                            alert("URL copied!");
                                        }}
                                        className="flex-1 bg-white hover:bg-gray-200 text-black py-2 px-4 rounded-lg text-sm font-semibold transition-colors"
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
                        <p className="text-gray-400 text-lg">No QR codes yet. Create your first one!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
