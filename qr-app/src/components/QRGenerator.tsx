'use client';

import React, { useState, useEffect } from 'react';
import { QRData } from '@/types/qr';
import InputForms from './InputForms';
import CustomizationPanel from './CustomizationPanel';
import QRPreview from './QRPreview';
import { Options } from 'qr-code-styling';

const DEFAULT_OPTIONS: Options = {
    width: 300,
    height: 300,
    type: 'svg',
    data: 'https://example.com',
    image: '',
    dotsOptions: {
        color: '#000000',
        type: 'rounded'
    },
    backgroundOptions: {
        color: '#ffffff',
    },
    imageOptions: {
        crossOrigin: 'anonymous',
        margin: 10
    }
};

export default function QRGenerator() {
    const [qrData, setQrData] = useState<QRData>({ type: 'url', value: 'https://example.com', dynamic: true });
    const [options, setOptions] = useState<Options>(DEFAULT_OPTIONS);
    const [isGenerating, setIsGenerating] = useState(false);
    const [shortLink, setShortLink] = useState<string | null>(null);
    const [showCustomization, setShowCustomization] = useState(false);

    // Effect to handle dynamic link generation
    useEffect(() => {
        if (!qrData.dynamic) {
            setShortLink(null);
            setOptions(prev => ({ ...prev, data: qrData.value }));
            return;
        }
        // If dynamic is enabled, we wait for user to trigger generation or we could debounce.
        // For this demo, let's just reset shortLink if value changes, forcing regeneration.
        setShortLink(null);
    }, [qrData.value, qrData.dynamic]);

    const handleCreateQR = async () => {
        if (!qrData.value) return;
        
        // For URL type with dynamic enabled, generate short link
        if (qrData.type === 'url' && qrData.dynamic) {
            setIsGenerating(true);
            try {
                const res = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ originalUrl: qrData.value }),
                });
                const data = await res.json();
                if (data.shortCode) {
                    const fullShortUrl = `${window.location.origin}/r/${data.shortCode}`;
                    setShortLink(fullShortUrl);
                    setOptions(prev => ({ ...prev, data: fullShortUrl }));
                }
            } catch (error) {
                console.error('Failed to generate link', error);
            } finally {
                setIsGenerating(false);
            }
        } else {
            // For URL type without dynamic or other types, just set the data
            setOptions(prev => ({ ...prev, data: qrData.value }));
        }
    };

    const handleNextClick = () => {
        if (qrData.value) {
            setOptions(prev => ({ ...prev, data: qrData.value }));
            setShowCustomization(true);
        }
    };

    const handleDataChange = (data: QRData) => {
        setQrData(data);
        setShowCustomization(false);
        // If not dynamic, update immediately. If dynamic, wait for generation.
        if (!data.dynamic) {
            setOptions(prev => ({ ...prev, data: data.value }));
        }
    };

    const handleOptionsChange = (newOptions: Partial<Options>) => {
        setOptions(prev => ({ ...prev, ...newOptions }));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
                <InputForms data={qrData} onChange={handleDataChange} onGenerate={handleCreateQR} onNext={handleNextClick} />

                {qrData.dynamic && qrData.type === 'url' && shortLink && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-green-900">
                                <span className="font-semibold">Short Link: </span>
                                <span className="font-mono">{shortLink}</span>
                            </div>
                        </div>
                    </div>
                )}

                {showCustomization && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold mb-4">Customize Design</h2>
                        <CustomizationPanel options={options} onChange={handleOptionsChange} />
                    </div>
                )}
            </div>

            <div className="lg:col-span-5">
                <div className="sticky top-24">
                    <QRPreview options={options} qrData={qrData} />
                </div>
            </div>
        </div>
    );
}
