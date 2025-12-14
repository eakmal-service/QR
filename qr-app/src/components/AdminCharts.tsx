'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
    data: any[];
}

export default function AdminCharts({ data }: Props) {
    // Transform data for chart if needed
    // For now assuming data is passed in a format suitable or we process it here.
    // Let's say we want scans per day.

    // This is a placeholder for the actual chart logic
    const chartData = [
        { name: 'Mon', scans: 4 },
        { name: 'Tue', scans: 3 },
        { name: 'Wed', scans: 2 },
        { name: 'Thu', scans: 7 },
        { name: 'Fri', scans: 5 },
        { name: 'Sat', scans: 9 },
        { name: 'Sun', scans: 6 },
    ];

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="name" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="scans" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
