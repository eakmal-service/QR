'use client';

import React from 'react';
import { QRData } from '@/types/qr';
import { Link, Type, Mail, User, Wifi, FileText, Instagram, Image, Building2, Calendar, Facebook, Music, Tag, MessageSquare, Star } from 'lucide-react';
import clsx from 'clsx';

interface Props {
    data: QRData;
    onChange: (data: QRData) => void;
    onGenerate: () => void;
    onNext?: () => void;
}

const QR_TYPES = [
    { id: 'vcard', label: 'vCard Plus', description: 'Share personalized contact details', icon: User },
    { id: 'pdf', label: 'PDF', description: 'Link to a mobile-optimized PDF', icon: FileText },
    { id: 'social', label: 'Social Media', description: 'Link to your social media channels', icon: Link },
    { id: 'instagram', label: 'Instagram', description: 'Link to your Instagram page', icon: Instagram },
    { id: 'images', label: 'Images', description: 'Show a series of photos', icon: Image },
    { id: 'app', label: 'App', description: 'View your app on various App Stores', icon: Building2 },
    { id: 'business', label: 'Business Page', description: 'Provide your company information', icon: Building2 },
    { id: 'video', label: 'Video', description: 'Share one or more videos', icon: FileText },
    { id: 'event', label: 'Event', description: 'Promote your event', icon: Calendar },
    { id: 'barcode', label: '2D Barcode', description: 'Supports GS1 standards', icon: Tag },
    { id: 'facebook', label: 'Facebook', description: 'Get more Likes for your page', icon: Facebook },
    { id: 'mp3', label: 'MP3', description: 'Play an audio file', icon: Music },
    { id: 'coupons', label: 'Coupons', description: 'Share coupons and discounts', icon: Tag },
    { id: 'feedback', label: 'Feedback', description: 'Collect feedback and get rated', icon: MessageSquare },
    { id: 'rating', label: 'Rating', description: 'Ask a question and get rated', icon: Star },
] as const;

export default function InputForms({ data, onChange, onGenerate, onNext }: Props) {
    const isUrlType = data.type === 'url';
    // Grid types are selected only if it's in QR_TYPES and NOT the URL type
    const isGridTypeSelected = !isUrlType && QR_TYPES.some(type => type.id === data.type);

    const handleTypeChange = (type: QRData['type']) => {
        onChange({ ...data, type, value: '' });
    };

    const handleChange = (value: string) => {
        onChange({ ...data, value });
    };

    const handleOpenWebsite = () => {
        if (data.value && isUrlType) {
            let url = data.value;
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            window.open(url, '_blank');
        }
    };

    const getPlaceholder = () => {
        switch (data.type) {
            case 'url': return 'https://www.your-website.com';
            case 'text': return 'Enter your text here...';
            case 'email': return 'name@example.com';
            case 'wifi': return 'Network Name';
            default: return 'Enter value...';
        }
    };

    return (
        <div className="space-y-8">
            {/* Main Input Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-gray-100 rounded-lg">
                        <Link className="w-6 h-6 text-gray-700" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Website</h2>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Create this QR Code type to link to your website, any Google URL or document, your social media profile or any other page on the web. You can customize and download your QR Code in the next steps.
                        </p>
                    </div>
                    <button className="text-blue-600 text-sm font-medium hover:underline whitespace-nowrap">
                        Bulk Create from CSV
                    </button>
                </div>

                <div className="flex gap-3 items-center">
                    <input
                        type={data.type === 'email' ? 'email' : data.type === 'url' ? 'url' : 'text'}
                        placeholder={getPlaceholder()}
                        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                        value={data.value}
                        onChange={(e) => handleChange(e.target.value)}
                    />
                    {isUrlType && (
                        <button
                            onClick={onGenerate}
                            disabled={!data.value}
                            className={clsx(
                                "px-8 py-3 font-semibold rounded-lg transition-all whitespace-nowrap flex-shrink-0",
                                data.value
                                    ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                                    : "bg-gray-400 text-white cursor-not-allowed opacity-60"
                            )}
                        >
                            CREATE
                        </button>
                    )}
                </div>
                <div className="text-right mt-2">
                    <span className="text-xs text-gray-500">0/1500</span>
                </div>

                {data.type === 'url' && (
                    <div className="mt-4 flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="dynamic"
                            checked={data.dynamic}
                            onChange={(e) => onChange({ ...data, dynamic: e.target.checked })}
                            className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="dynamic" className="text-sm text-gray-600">
                            Track scans & Dynamic Redirect (Short URL)
                        </label>
                    </div>
                )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-gray-500 text-sm">or select from more Dynamic Code types</span>
                <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* QR Type Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-32">
                {QR_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                        <button
                            key={type.id}
                            onClick={() => handleTypeChange(type.id)}
                            className={clsx(
                                "flex items-start gap-4 p-5 rounded-xl border-2 transition-all text-left hover:border-blue-300 hover:shadow-md",
                                data.type === type.id
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 bg-white"
                            )}
                        >
                            <div className={clsx(
                                "p-3 rounded-lg",
                                data.type === type.id ? "bg-blue-100" : "bg-gray-100"
                            )}>
                                <Icon className={clsx(
                                    "w-6 h-6",
                                    data.type === type.id ? "text-blue-600" : "text-gray-600"
                                )} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1">{type.label}</h3>
                                <p className="text-sm text-gray-600">{type.description}</p>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* NEXT Button Fixed at Bottom */}
            {isGridTypeSelected && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6 flex justify-center z-50">
                    <button
                        onClick={onNext}
                        className="px-20 py-4 font-bold text-lg rounded-full bg-blue-600 text-white hover:bg-blue-700 cursor-pointer transition-all"
                    >
                        NEXT
                    </button>
                </div>
            )}
        </div>
    );
}
