import React from 'react';

export interface QRFrameProps {
    children: React.ReactNode;
    color: string;
    textColor: string;
    text?: string;
    width?: number;
    height?: number;
    className?: string;
}

import { GENERATED_FRAMES } from './generated-qr-frames';

export const FRAMES = [
    { id: 'none', label: 'None', category: 'Standard Frames', component: ({ children }: any) => <>{children}</> },
    { id: 'scan-me-1', label: 'Scan Me 1', category: 'Standard Frames', component: ScanMeFrame1 },
    { id: 'scan-me-2', label: 'Scan Me 2', category: 'Standard Frames', component: ScanMeFrame2 },
    { id: 'balloon', label: 'Balloon', category: 'Standard Frames', component: BalloonFrame },
    { id: 'border', label: 'Simple Border', category: 'Standard Frames', component: BorderFrame },
    ...GENERATED_FRAMES,
];

export function getFrameComponent(id: string) {
    return FRAMES.find(f => f.id === id)?.component || FRAMES[0].component;
}

function ScanMeFrame1({ children, color, textColor, text = "SCAN ME" }: QRFrameProps) {
    return (
        <div className="relative flex flex-col items-center justify-center p-4 bg-white rounded-xl">
            {/* Top Text Banner */}
            <div className="mb-2 px-6 py-1.5 rounded-full font-bold text-sm uppercase tracking-wide text-white" style={{ backgroundColor: color }}>
                {text}
            </div>

            {/* QR Container */}
            <div className="p-2 border-4 rounded-xl" style={{ borderColor: color }}>
                {children}
            </div>
        </div>
    );
}

function ScanMeFrame2({ children, color, textColor, text = "SCAN ME" }: QRFrameProps) {
    return (
        <div className="relative p-5 pb-12 bg-white rounded-lg border-4" style={{ borderColor: color }}>
            {children}
            <div className="absolute bottom-0 left-0 right-0 py-2 font-bold text-center text-lg uppercase tracking-wider text-white" style={{ backgroundColor: color }}>
                {text}
            </div>
        </div>
    );
}

function PhoneFrame({ children, color }: QRFrameProps) {
    return (
        <div className="relative p-4 bg-black rounded-[3rem] border-[8px] border-gray-800 shadow-xl">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-black rounded-b-xl z-10"></div>

            {/* Screen Content */}
            <div className="bg-white rounded-[2rem] overflow-hidden p-6 pt-12">
                {children}
            </div>

            {/* Home Bar */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1/3 h-1.5 bg-gray-700 rounded-full"></div>
        </div>
    );
}

function BalloonFrame({ children, color, textColor, text = "Scan Me" }: QRFrameProps) {
    return (
        <div className="relative flex flex-col items-center">
            {/* Speech Bubble */}
            <div className="relative mb-3 px-6 py-3 bg-white rounded-full shadow-lg border-2" style={{ borderColor: color }}>
                <span className="font-bold text-lg" style={{ color: color }}>{text}</span>
                {/* Pointer */}
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-white border-b-2 border-r-2 rotate-45 transform" style={{ borderColor: color }}></div>
            </div>

            <div className="p-3 bg-white rounded-xl shadow-lg border-2" style={{ borderColor: color }}>
                {children}
            </div>
        </div>
    );
}

function BorderFrame({ children, color }: QRFrameProps) {
    return (
        <div className="p-4 bg-white border-dashed border-4 rounded-xl" style={{ borderColor: color }}>
            {children}
        </div>
    );
}
