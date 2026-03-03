"use client";

import { useEffect, useState } from "react";
import { AdminRole } from "./layout";
import {
    Users,
    QrCode,
    Activity,
    TrendingUp,
    ShieldAlert,
    Trash2
} from "lucide-react";

export default function AdminDashboardPage() {
    const [role, setRole] = useState<AdminRole | null>(null);
    const [qrCodes, setQrCodes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simple polling to catch changes without a global context for this quick simulation
        const checkRole = () => {
            const currentRole = (localStorage.getItem("simulatedAdminRole") as AdminRole) || "SUPER_ADMIN";
            setRole(currentRole);
        };

        checkRole();
        const interval = setInterval(checkRole, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch("/api/admin/qr-codes/list");
                const data = await response.json();
                if (data.success && Array.isArray(data.qrCodes)) {
                    setQrCodes(data.qrCodes);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!process.browser) return;
        if (!confirm(`Are you sure you want to completely delete the QR code for "${name}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const res = await fetch(`/api/admin/qr-codes/delete?id=${id}`, {
                method: "DELETE"
            });
            const data = await res.json();

            if (data.success) {
                setQrCodes(prev => prev.filter(qr => qr.id !== id));
            } else {
                alert(data.error || "Failed to delete QR code");
            }
        } catch (err) {
            console.error(err);
            alert("Network error occurred while trying to delete.");
        }
    };

    if (!role) return null; // Hydration

    const isSuperAdmin = role === "SUPER_ADMIN";

    // Calculations
    const totalQRs = qrCodes.length;
    const totalScans = qrCodes.reduce((sum, qr) => sum + (qr.analytics?.totalScans || 0), 0);
    const totalReviews = qrCodes.reduce((sum, qr) => sum + (qr.analytics?.totalReviews || 0), 0);
    const avgConversion = totalScans > 0 ? ((totalReviews / totalScans) * 100).toFixed(1) : "0.0";

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
                <p className="mt-2 text-gray-400">
                    Welcome back, <span className="font-semibold text-white">{isSuperAdmin ? "Super Administrator" : "Administrator"}</span>. Here's what's happening today.
                </p>
            </div>

            {/* Simulated Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#1a1a1a] rounded-xl shadow-sm border border-[#404040] p-6 flex items-center">
                    <div className="p-3 rounded-lg bg-white/10 text-white mr-4">
                        <QrCode className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-400">Total Smart QRs</p>
                        <h3 className="text-2xl font-bold text-white">{loading ? "..." : totalQRs}</h3>
                    </div>
                </div>

                <div className="bg-[#1a1a1a] rounded-xl shadow-sm border border-[#404040] p-6 flex items-center">
                    <div className="p-3 rounded-lg bg-white/10 text-white mr-4">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-400">Total Scans</p>
                        <h3 className="text-2xl font-bold text-white">{loading ? "..." : totalScans.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="bg-[#1a1a1a] rounded-xl shadow-sm border border-[#404040] p-6 flex items-center">
                    <div className="p-3 rounded-lg bg-white/10 text-white mr-4">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-400">Total Auto-Reviews</p>
                        <h3 className="text-2xl font-bold text-white">{loading ? "..." : totalReviews.toLocaleString()}</h3>
                    </div>
                </div>

                {isSuperAdmin && (
                    <div className="bg-[#1a1a1a] rounded-xl shadow-sm border border-[#404040] p-6 flex items-center">
                        <div className="p-3 rounded-lg bg-white/10 text-white mr-4">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-400">Avg Conversion</p>
                            <h3 className="text-2xl font-bold text-white">{loading ? "..." : avgConversion}%</h3>
                        </div>
                    </div>
                )}
            </div>

            {/* Role-Specific Content Area */}
            <div className={`grid grid-cols-1 ${isSuperAdmin ? "" : "lg:grid-cols-2"} gap-6 mt-8`}>
                {!isSuperAdmin ? (
                    <>
                        <div className="bg-[#1a1a1a] rounded-xl shadow-sm border border-[#404040] p-6 min-h-[300px]">
                            <h3 className="text-lg font-bold text-white border-b border-[#404040] pb-3 mb-4">Recent Businesses Added</h3>
                            {loading ? (
                                <p className="text-sm text-gray-400">Loading...</p>
                            ) : qrCodes.length === 0 ? (
                                <p className="text-sm text-gray-400">No data available.</p>
                            ) : (
                                <div className="space-y-4">
                                    {qrCodes.slice(0, 5).map((qr) => (
                                        <div key={qr.id} className="flex justify-between items-center text-sm">
                                            <span className="text-gray-300 font-medium">{qr.businessName}</span>
                                            <span className="text-gray-400 font-medium">{qr.analytics?.totalScans || 0} scans</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="bg-white/5 rounded-xl border border-white/10 p-6 min-h-[300px] flex flex-col justify-center items-center text-center backdrop-blur-sm">
                            <div className="w-16 h-16 bg-white/10 rounded-full border border-white/20 flex items-center justify-center mb-4">
                                <ShieldAlert className="w-8 h-8 text-white opacity-70" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Restricted Area</h3>
                            <p className="text-sm text-gray-400 max-w-xs">
                                Advanced tracking and System Settings are restricted to Super Administrators.
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="bg-white/5 rounded-xl border border-white/10 p-6 min-h-[300px] shadow-sm backdrop-blur-md">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5 text-white" />
                                <h3 className="text-lg font-bold text-white">Super Admin Master Tracker</h3>
                            </div>
                            <span className="text-xs font-semibold bg-white/20 text-white px-3 py-1 rounded-full uppercase tracking-wider">
                                All Businesses
                            </span>
                        </div>

                        <div className="bg-[#1a1a1a] rounded-lg border border-[#404040] overflow-hidden shadow-sm">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-[#0a0a0a] border-b border-[#404040] text-gray-300 font-bold uppercase tracking-wider text-xs">
                                    <tr>
                                        <th className="px-6 py-4">Business Name & Unique ID</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-center">Total Scans</th>
                                        <th className="px-6 py-4 text-center">Reviews Generated</th>
                                        <th className="px-6 py-4 text-center">Avg Rating</th>
                                        <th className="px-6 py-4 text-right">Added On</th>
                                        <th className="px-6 py-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#404040]">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading tracking data...</td>
                                        </tr>
                                    ) : qrCodes.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No Smart QR codes generated yet.</td>
                                        </tr>
                                    ) : (
                                        qrCodes.map((qr) => (
                                            <tr key={qr.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-200">{qr.businessName}</div>
                                                    <div className="text-xs font-mono text-gray-500 mt-0.5">ID: {qr.id}</div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${qr.isActive !== false ? 'bg-white/20 text-white' : 'bg-red-500/20 text-red-400'}`}>
                                                        {qr.isActive !== false ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-gray-300 border border-white/20">
                                                        {qr.analytics?.totalScans || 0}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                                                        {qr.analytics?.totalReviews || 0}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center font-bold text-white">
                                                    {qr.analytics?.averageRating || "N/A"}
                                                </td>
                                                <td className="px-6 py-4 text-right text-gray-500 text-xs">
                                                    {new Date(qr.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => handleDelete(qr.id, qr.businessName)}
                                                        className="p-2 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-colors"
                                                        title="Delete QR Code"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
