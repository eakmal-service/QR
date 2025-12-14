'use client';

import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling, { Options } from 'qr-code-styling';
import { QRData } from '@/types/qr';
import { Download } from 'lucide-react';

interface Props {
    options: Options;
    qrData: QRData;
}

export default function QRPreview({ options }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const [qrCode, setQrCode] = useState<QRCodeStyling>();
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const qr = new QRCodeStyling(options);
        setQrCode(qr);
        if (ref.current) {
            qr.append(ref.current);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!qrCode) return;
        qrCode.update(options);
    }, [qrCode, options]);

    const handleDownload = async (extension: 'png' | 'jpeg' | 'svg') => {
        if (!qrCode) return;
        setIsGenerating(true);

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await qrCode.download({ extension: extension as any });
        } catch (err) {
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Preview</h3>
            
            <div className="mb-8 flex justify-center">
                <div ref={ref} className="bg-white p-6 rounded-xl border border-gray-200 inline-block" />
            </div>

            <div className="space-y-3">
                <button
                    onClick={() => handleDownload('png')}
                    disabled={isGenerating}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                    <Download size={20} />
                    {isGenerating ? 'Generating...' : 'Download PNG'}
                </button>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => handleDownload('jpeg')}
                        disabled={isGenerating}
                        className="py-2 px-4 bg-white border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                    >
                        JPG
                    </button>
                    <button
                        onClick={() => handleDownload('svg')}
                        disabled={isGenerating}
                        className="py-2 px-4 bg-white border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                    >
                        SVG
                    </button>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                    High quality QR codes ready for print and digital use
                </p>
            </div>
        </div>
    );
}
