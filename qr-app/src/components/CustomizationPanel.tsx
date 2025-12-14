'use client';

import React from 'react';
import { Options } from 'qr-code-styling';
import { Palette, Layout, Image as ImageIcon } from 'lucide-react';

interface Props {
    options: Options;
    onChange: (options: Partial<Options>) => void;
}

const DOT_TYPES = ['rounded', 'dots', 'classy', 'classy-rounded', 'square', 'extra-rounded'] as const;
const CORNER_TYPES = ['dot', 'square', 'extra-rounded'] as const;

export default function CustomizationPanel({ options, onChange }: Props) {

    const handleColorChange = (key: 'dotsOptions' | 'backgroundOptions', color: string) => {
        onChange({
            [key]: {
                ...options[key],
                color
            }
        });
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                onChange({
                    image: reader.result as string
                });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6">
            {/* Colors */}
            <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Palette size={18} /> Colors
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-2">QR Code Color</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={options.dotsOptions?.color}
                                onChange={(e) => handleColorChange('dotsOptions', e.target.value)}
                                className="h-12 w-12 rounded-lg cursor-pointer border-2 border-gray-200"
                            />
                            <span className="text-sm font-mono text-gray-700">{options.dotsOptions?.color}</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-2">Background</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={options.backgroundOptions?.color}
                                onChange={(e) => handleColorChange('backgroundOptions', e.target.value)}
                                className="h-12 w-12 rounded-lg cursor-pointer border-2 border-gray-200"
                            />
                            <span className="text-sm font-mono text-gray-700">{options.backgroundOptions?.color}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shapes */}
            <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Layout size={18} /> Dot Style
                </h3>
                <div className="grid grid-cols-3 gap-2">
                    {DOT_TYPES.map(type => (
                        <button
                            key={type}
                            onClick={() => onChange({ dotsOptions: { ...options.dotsOptions, type } })}
                            className={`px-3 py-2.5 text-xs rounded-lg border-2 capitalize transition-all ${options.dotsOptions?.type === type
                                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                }`}
                        >
                            {type.replace('-', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Layout size={18} /> Corner Style
                </h3>
                <div className="grid grid-cols-3 gap-2">
                    {CORNER_TYPES.map(type => (
                        <button
                            key={type}
                            onClick={() => onChange({ cornersSquareOptions: { ...options.cornersSquareOptions, type } })}
                            className={`px-3 py-2.5 text-xs rounded-lg border-2 capitalize transition-all ${options.cornersSquareOptions?.type === type
                                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                }`}
                        >
                            {type.replace('-', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Logo */}
            <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <ImageIcon size={18} /> Add Logo
                </h3>
                <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-all">
                            <span className="text-sm text-gray-600">Click to upload logo</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                        </div>
                    </label>
                    {options.image && (
                        <div className="relative w-20 h-20 rounded-lg border-2 border-gray-200 overflow-hidden bg-white">
                            <img src={options.image} alt="Logo" className="w-full h-full object-contain p-2" />
                            <button
                                onClick={() => onChange({ image: '' })}
                                className="absolute -top-1 -right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs hover:bg-red-600 transition-colors"
                            >
                                ×
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
