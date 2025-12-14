import { Options } from "qr-code-styling";

export type QRData = {
    type: 'url' | 'text' | 'email' | 'wifi' | 'vcard' | 'pdf' | 'social' | 'instagram' | 'images' | 'app' | 'business' | 'video' | 'event' | 'barcode' | 'facebook' | 'mp3' | 'coupons' | 'feedback' | 'rating';
    value: string;
    dynamic?: boolean;
};

export type QRCustomization = {
    dotsOptions: Options['dotsOptions'];
    cornersSquareOptions: Options['cornersSquareOptions'];
    cornersDotOptions: Options['cornersDotOptions'];
    backgroundOptions: Options['backgroundOptions'];
    imageOptions: Options['imageOptions'];
    image?: string;
    shape?: 'square' | 'circle'; // Basic shape of the whole QR (not supported by lib directly but we can mask or just mean dots)
    // Actually qr-code-styling supports dots types: 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded'
};
