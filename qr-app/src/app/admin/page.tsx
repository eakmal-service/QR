'use client';

import { useState } from 'react';
import { BarChart3, Link as LinkIcon, Smartphone, Download, Calendar, Users, Eye } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Mock data - will be replaced with real database queries once Prisma is fixed
const mockScanData = [
    { date: '2024-01-01', scans: 45, uniqueScans: 32 },
    { date: '2024-01-02', scans: 52, uniqueScans: 38 },
    { date: '2024-01-03', scans: 49, uniqueScans: 35 },
    { date: '2024-01-04', scans: 63, uniqueScans: 42 },
    { date: '2024-01-05', scans: 55, uniqueScans: 39 },
    { date: '2024-01-06', scans: 71, uniqueScans: 48 },
    { date: '2024-01-07', scans: 68, uniqueScans: 45 },
];

const mockRecentLinks = [
    { id: '1', originalUrl: 'https://example.com/product1', shortCode: 'abc123', scans: 156, uniqueScans: 89, source: 'Instagram' },
    { id: '2', originalUrl: 'https://example.com/product2', shortCode: 'xyz789', scans: 243, uniqueScans: 142, source: 'Facebook' },
    { id: '3', originalUrl: 'https://example.com/landing', shortCode: 'def456', scans: 98, uniqueScans: 67, source: 'Email Campaign' },
    { id: '4', originalUrl: 'https://example.com/promo', shortCode: 'ghi789', scans: 187, uniqueScans: 123, source: 'Twitter' },
    { id: '5', originalUrl: 'https://example.com/offer', shortCode: 'jkl012', scans: 76, uniqueScans: 54, source: 'Direct' },
];

export default function AdminPage() {
    const [dateRange, setDateRange] = useState('weekly');

    const totalLinks = 247;
    const totalScans = 1856;
    const uniqueScans = 1243;
    const activeDevices = 892;

    const downloadReport = (format: 'csv' | 'excel') => {
        // Mock download functionality
        const data = mockRecentLinks.map(link => ({
            'Short Code': link.shortCode,
            'Original URL': link.originalUrl,
            'Total Scans': link.scans,
            'Unique Scans': link.uniqueScans,
            'Source': link.source
        }));

        if (format === 'csv') {
            const csv = [
                Object.keys(data[0]).join(','),
                ...data.map(row => Object.values(row).join(','))
            ].join('\n');

            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `qr-analytics-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
        } else {
            alert('Excel export coming soon! For now, please use CSV format.');
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">Comprehensive QR code tracking and analytics</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => downloadReport('csv')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                        <Download size={18} />
                        Export CSV
                    </button>
                    <button
                        onClick={() => downloadReport('excel')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                        <Download size={18} />
                        Export Excel
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-panel p-6 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                            <LinkIcon size={24} />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Total Links</div>
                            <div className="text-2xl font-bold">{totalLinks}</div>
                        </div>
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                            <Smartphone size={24} />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Total Scans</div>
                            <div className="text-2xl font-bold">{totalScans}</div>
                        </div>
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                            <Eye size={24} />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Unique Scans</div>
                            <div className="text-2xl font-bold">{uniqueScans}</div>
                        </div>
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                            <Users size={24} />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Active Devices</div>
                            <div className="text-2xl font-bold">{activeDevices}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Date Range Filter */}
            <div className="glass-panel p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Calendar size={20} />
                        Time Period
                    </h2>
                    <div className="flex gap-2">
                        {['daily', 'weekly', 'monthly', 'yearly'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setDateRange(range)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${dateRange === range
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {range.charAt(0).toUpperCase() + range.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Line Chart - Scan Frequency */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-4">SCAN FREQUENCY</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={mockScanData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Line type="monotone" dataKey="scans" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="uniqueScans" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Bar Chart - Scan Comparison */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-4">TOTAL VS UNIQUE SCANS</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={mockScanData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Bar dataKey="scans" fill="#6366f1" />
                                <Bar dataKey="uniqueScans" fill="#10b981" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* QR Links Table */}
            <div className="glass-panel p-6 rounded-2xl">
                <h2 className="text-lg font-semibold mb-6">QR Code Performance</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Short Code</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Original URL</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Source</th>
                                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Total Scans</th>
                                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Unique Scans</th>
                                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Conversion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockRecentLinks.map((link) => (
                                <tr key={link.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4">
                                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{link.shortCode}</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="text-sm truncate max-w-xs">{link.originalUrl}</div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">{link.source}</span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="text-sm font-semibold">{link.scans}</span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="text-sm font-semibold text-green-600">{link.uniqueScans}</span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="text-sm font-semibold text-purple-600">
                                            {Math.round((link.uniqueScans / link.scans) * 100)}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Note about mock data */}
            <div className="glass-panel p-4 rounded-xl bg-yellow-50 border border-yellow-200">
                <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Currently displaying mock data. Database connection will be established to show real analytics.
                </p>
            </div>
        </div>
    );
}
