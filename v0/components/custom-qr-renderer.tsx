import React, { useEffect, useState, useMemo } from 'react';
import QRCode from 'qrcode';
import { QRPattern, CORNER_SQUARE_PATHS, CORNER_DOT_PATHS } from '@/lib/qr-patterns';

interface CustomQRRendererProps {
    data: string;
    pattern: QRPattern;
    width?: number | string;
    height?: number | string;
    color: string;
    bgColor: string;
    bgTransparent: boolean;
    logo?: string | null;
    logoSize?: number;
    logoMargin?: number;
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
    cornerSquareType?: string; // 'square' | 'dot' | 'extra-rounded'
    cornerSquareColor?: string;
    cornerDotType?: string; // 'square' | 'dot'
    cornerDotColor?: string;
    id?: string;
    dotsGradientType?: "none" | "linear" | "radial";
    dotsGradientColor1?: string;
    dotsGradientColor2?: string;
    dotsGradientRotation?: number; // degrees
}

export const CustomQRRenderer: React.FC<CustomQRRendererProps> = ({
    data,
    pattern,
    width = 300,
    height = 300,
    color,
    bgColor,
    bgTransparent,
    logo,
    logoSize = 20,
    logoMargin = 2,
    errorCorrectionLevel = 'M',
    cornerSquareType = 'square',
    cornerSquareColor,
    cornerDotType = 'square',
    cornerDotColor,
    id = "custom-qr-svg",
    dotsGradientType = "none",
    dotsGradientColor1 = "#000000",
    dotsGradientColor2 = "#000000",
    dotsGradientRotation = 0,
}) => {
    const uniqueGradientId = `qr-gradient-${id}`;
    const [modules, setModules] = useState<boolean[][]>([]);
    const [qrSize, setQrSize] = useState(0);

    useEffect(() => {
        const generateQR = async () => {
            try {
                const qr = QRCode.create(data, { errorCorrectionLevel: errorCorrectionLevel });
                const mat = qr.modules.data;
                const size = qr.modules.size;

                // Convert Uint8Array to 2D boolean array
                const matrix: boolean[][] = [];
                for (let i = 0; i < size; i++) {
                    const row: boolean[] = [];
                    for (let j = 0; j < size; j++) {
                        row.push(!!mat[i * size + j]);
                    }
                    matrix.push(row);
                }
                setModules(matrix);
                setQrSize(size);
            } catch (err) {
                console.error("Error generating custom QR:", err);
            }
        };
        generateQR();
    }, [data, errorCorrectionLevel]);

    const cellSize = 100 / qrSize; // Percentage or coordinate space size per module if viewBox is 100x100
    // Actually, let's use a coordinate system of [0, size] x [0, size]

    // Position detection patterns (Eyes) locations
    // Top-left: (0,0) to (7,7)
    // Top-right: (size-7, 0) to (size, 7)
    // Bottom-left: (0, size-7) to (7, size)
    const isEye = (r: number, c: number) => {
        if (r < 7 && c < 7) return true;
        if (r < 7 && c >= qrSize - 7) return true;
        if (r >= qrSize - 7 && c < 7) return true;
        return false;
    };

    // Render body modules
    const bodyPaths = useMemo(() => {
        if (!modules.length || !pattern) return null;

        const paths: JSX.Element[] = [];

        for (let r = 0; r < qrSize; r++) {
            for (let c = 0; c < qrSize; c++) {
                if (modules[r][c] && !isEye(r, c)) {
                    // Render custom pattern module
                    // We need to scale and translate the pattern path
                    // pattern.viewBox is typically "0 0 100 100".
                    // We transform it to fit into (c, r) with size 1x1.
                    // If pattern is defined in 100x100 space, we scale by 0.01.
                    // Wait, SVG transform order: translate(c, r) scale(0.01).
                    paths.push(
                        <g key={`${r}-${c}`} transform={`translate(${c}, ${r}) scale(${1 / 100})`}>
                            <path d={pattern.path} fill={dotsGradientType !== "none" ? `url(#${uniqueGradientId})` : color} />
                        </g>
                    );
                }
            }
        }
        return paths;
    }, [modules, pattern, color, qrSize, dotsGradientType, uniqueGradientId]);

    // Helpers for Corners
    const renderCorner = (x: number, y: number) => {
        const outerColor = cornerSquareColor || color;
        const innerColor = cornerDotColor || color;

        // Check if we have a custom corner path
        const customCorner = CORNER_SQUARE_PATHS.find(p => p.id === cornerSquareType);

        // Check if we have a custom dot path
        const customDot = CORNER_DOT_PATHS.find(p => p.id === cornerDotType);

        // DEBUG LOGGING
        console.log("Renderer Debug:", { cornerDotType, patternFound: !!customDot, availableIDs: CORNER_DOT_PATHS.map(p => p.id) });

        const renderFrame = () => {
            if (customCorner) {
                // Calculate scale to fit the viewBox into 7x7 modules
                const viewBox = customCorner.viewBox.split(' ').map(Number);
                const scaleX = 7 / viewBox[2];
                const scaleY = 7 / viewBox[3];

                return (
                    <g transform={`scale(${scaleX}, ${scaleY})`}>
                        {customCorner.isStroke ? (
                            <path
                                d={customCorner.path}
                                fill="none"
                                stroke={outerColor}
                                strokeWidth={customCorner.strokeWidth || 5}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        ) : (
                            <path d={customCorner.path} fill={outerColor} />
                        )}
                    </g>
                );
            }

            // Standard Frame Fallback
            let frameRadius = 0;
            if (cornerSquareType === 'extra-rounded') frameRadius = 2.5;
            if (cornerSquareType === 'dot') frameRadius = 3.5;

            return (
                <g>
                    <rect x="0" y="0" width="7" height="7" rx={frameRadius} fill={outerColor} />
                    <rect x="1" y="1" width="5" height="5" rx={Math.max(0, frameRadius - 1)} fill={bgTransparent ? "white" : (bgColor || "white")} />
                </g>
            );
        };

        const renderDot = () => {
            if (customDot) {
                // Calculate scale to fit the viewBox into 7x7 modules
                const viewBox = customDot.viewBox.split(' ').map(Number);
                const scaleX = 7 / viewBox[2];
                const scaleY = 7 / viewBox[3];

                return (
                    <g transform={`scale(${scaleX}, ${scaleY})`}>
                        {customDot.isStroke ? (
                            <path
                                d={customDot.path}
                                fill="none"
                                stroke={innerColor}
                                strokeWidth={customDot.strokeWidth || 1}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        ) : (
                            <path d={customDot.path} fill={innerColor} />
                        )}
                    </g>
                )
            }

            // Standard Dot Fallback
            let dotRadius = 0;
            if (cornerDotType === 'dot') dotRadius = 1.5;
            return <rect x="2" y="2" width="3" height="3" rx={dotRadius} fill={innerColor} />;
        };

        return (
            <g transform={`translate(${x}, ${y})`}>
                {renderFrame()}
                {renderDot()}
            </g>
        );
    };

    if (!modules.length) return <div>Generating...</div>;

    return (
        <div id="custom-qr-container" style={{ width, height, position: 'relative' }}>
            <svg
                id={id}
                viewBox={`0 0 ${qrSize} ${qrSize}`}
                style={{ width: '100%', height: '100%' }}
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Defs for Gradients */}
                <defs>
                    {dotsGradientType === "linear" && (
                        <linearGradient
                            id={uniqueGradientId}
                            x1="0%" y1="0%" x2="100%" y2="100%"
                            gradientTransform={`rotate(${dotsGradientRotation}, 0.5, 0.5)`}
                        >
                            <stop offset="0%" stopColor={dotsGradientColor1} />
                            <stop offset="100%" stopColor={dotsGradientColor2} />
                        </linearGradient>
                    )}
                    {dotsGradientType === "radial" && (
                        <radialGradient id={uniqueGradientId} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                            <stop offset="0%" stopColor={dotsGradientColor1} />
                            <stop offset="100%" stopColor={dotsGradientColor2} />
                        </radialGradient>
                    )}
                </defs>

                {/* Background */}
                {!bgTransparent && (
                    <rect x="0" y="0" width={qrSize} height={qrSize} fill={bgColor} />
                )}

                {/* Body */}
                {bodyPaths}

                {/* Eyes */}
                {renderCorner(0, 0)}
                {renderCorner(qrSize - 7, 0)}
                {renderCorner(0, qrSize - 7)}
            </svg>

            {/* Logo Overlay */}
            {logo && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: `${logoSize}%`,
                        height: `${logoSize}%`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {/* Clear area behind logo if margin > 0. SVG masking is cleaner but div overlay works here. */}
                    {/* Actually, standard behavior clears dots. We haven't cleared dots in matrix. */}
                    {/* For visual consistency, we might put a background div/svg rect behind img if needed. */}
                    <img
                        src={logo}
                        alt="QR Logo"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            // Add simplistic white background if margin requested
                            backgroundColor: logoMargin > 0 ? (bgTransparent && !bgColor ? 'white' : bgColor) : 'transparent',
                            padding: logoMargin,
                            borderRadius: '10%'
                        }}
                    />
                </div>
            )}
        </div>
    );
};
