"use client"

import { useState, useRef, useEffect } from "react"
import QRCodeStyling from "qr-code-styling"
import {
    Download,
    Link as LinkIcon,
    CreditCard,
    AlertCircle,
    User,
    Mail,
    Wifi,
    MapPin,
    Phone,
    MessageSquare,
    FileText,
    Upload,
    X,
    Type,
    MessageCircle,
    FileUp,
} from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import {
    generateUPIString,
    generateVCard,
    generateWiFi,
    generateEmail,
    generatePhone,
    generateSMS,
    generateLocation,
    type VCardParams,
    type WiFiParams,
    type EmailParams,
    type SMSParams,
    type LocationParams,
} from "@/lib/qr-generator-utils"

interface QRGeneratorModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

type QRType = "url" | "upi" | "vcard" | "email" | "wifi" | "location" | "phone" | "sms" | "text" | "whatsapp" | "pdf"
type ErrorCorrectionLevel = "L" | "M" | "Q" | "H"
type DotsType = "square" | "dots" | "rounded" | "extra-rounded" | "classy" | "classy-rounded"
type CornerSquareType = "square" | "dot" | "extra-rounded"
type CornerDotType = "square" | "dot"
type GradientType = "linear" | "radial"

const QR_TYPES = [
    { value: "url", label: "Website URL", icon: LinkIcon },
    { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
    { value: "vcard", label: "vCard", icon: User },
    { value: "email", label: "Email", icon: Mail },
    { value: "wifi", label: "WiFi", icon: Wifi },
    { value: "location", label: "Location", icon: MapPin },
    { value: "phone", label: "Phone", icon: Phone },
    { value: "sms", label: "SMS", icon: MessageSquare },
    { value: "text", label: "Text", icon: FileText },
    { value: "pdf", label: "PDF Document", icon: FileUp },
    { value: "upi", label: "UPI Payment", icon: CreditCard },
]

const DOTS_PATTERNS = [
    { value: "square", label: "Square" },
    { value: "dots", label: "Dots" },
    { value: "rounded", label: "Rounded" },
    { value: "extra-rounded", label: "Extra Rounded" },
    { value: "classy", label: "Classy" },
    { value: "classy-rounded", label: "Classy Rounded" },
]

const CORNER_SQUARE_PATTERNS = [
    { value: "square", label: "Square" },
    { value: "dot", label: "Dot" },
    { value: "extra-rounded", label: "Extra Rounded" },
]

const CORNER_DOT_PATTERNS = [
    { value: "square", label: "Square" },
    { value: "dot", label: "Dot" },
]

const FONT_FAMILIES = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Courier New",
    "Verdana",
    "Georgia",
    "Comic Sans MS",
]

export function QRGeneratorModal({ isOpen, onOpenChange }: QRGeneratorModalProps) {
    const [qrType, setQRType] = useState<QRType>("url")
    const [errorLevel, setErrorLevel] = useState<ErrorCorrectionLevel>("H")

    // Text Overlay States
    const [overlayText, setOverlayText] = useState("")
    const [textFont, setTextFont] = useState("Arial")
    const [textSize, setTextSize] = useState([20])
    const [textColor, setTextColor] = useState("#000000")

    // URL State
    const [protocol, setProtocol] = useState("https://")
    const [url, setUrl] = useState("www.google.com")

    // UPI State
    const [upiId, setUpiId] = useState("")
    const [upiName, setUpiName] = useState("")
    const [upiAmount, setUpiAmount] = useState("")

    // vCard, Email, WiFi, Location, Phone, SMS, Text States (same as before)
    const [vcard, setVcard] = useState<VCardParams>({
        firstName: "",
        lastName: "",
        organization: "",
        title: "",
        phone: "",
        email: "",
        website: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: "",
    })

    const [emailData, setEmailData] = useState<EmailParams>({
        email: "",
        subject: "",
        body: "",
    })

    const [wifi, setWifi] = useState<WiFiParams>({
        ssid: "",
        password: "",
        encryption: "WPA",
        hidden: false,
    })

    const [location, setLocation] = useState({
        searchType: "maps" as "maps" | "address",
        query: "", // For Google Maps search
        address: "", // For direct address link
    })

    // WhatsApp State
    const [whatsapp, setWhatsapp] = useState({
        phone: "",
        message: "",
    })

    // PDF State
    const [pdfFile, setPdfFile] = useState<string | null>(null)
    const pdfInputRef = useRef<HTMLInputElement>(null)

    const [phoneNumber, setPhoneNumber] = useState("")
    const [sms, setSms] = useState<SMSParams>({
        phone: "",
        message: "",
    })
    const [text, setText] = useState("")

    // Pattern States
    const [dotsType, setDotsType] = useState<DotsType>("square")
    const [dotsColor, setDotsColor] = useState("#000000")
    const [dotsGradient, setDotsGradient] = useState(false)
    const [dotsGradientType, setDotsGradientType] = useState<GradientType>("linear")
    const [dotsGradientColor1, setDotsGradientColor1] = useState("#000000")
    const [dotsGradientColor2, setDotsGradientColor2] = useState("#666666")

    // External Eye (Corner Square) States
    const [cornerSquareType, setCornerSquareType] = useState<CornerSquareType>("square")
    const [cornerSquareColor, setCornerSquareColor] = useState("#000000")
    const [cornerSquareGradient, setCornerSquareGradient] = useState(false)
    const [cornerSquareGradientType, setCornerSquareGradientType] = useState<GradientType>("linear")
    const [cornerSquareGradientColor1, setCornerSquareGradientColor1] = useState("#000000")
    const [cornerSquareGradientColor2, setCornerSquareGradientColor2] = useState("#666666")

    // Internal Eye (Corner Dot) States
    const [cornerDotType, setCornerDotType] = useState<CornerDotType>("square")
    const [cornerDotColor, setCornerDotColor] = useState("#000000")
    const [cornerDotGradient, setCornerDotGradient] = useState(false)
    const [cornerDotGradientType, setCornerDotGradientType] = useState<GradientType>("linear")
    const [cornerDotGradientColor1, setCornerDotGradientColor1] = useState("#000000")
    const [cornerDotGradientColor2, setCornerDotGradientColor2] = useState("#666666")

    // Background States
    const [bgColor, setBgColor] = useState("#ffffff")
    const [bgGradient, setBgGradient] = useState(false)
    const [bgGradientType, setBgGradientType] = useState<GradientType>("linear")
    const [bgGradientColor1, setBgGradientColor1] = useState("#ffffff")
    const [bgGradientColor2, setBgGradientColor2] = useState("#cccccc")
    const [bgTransparent, setBgTransparent] = useState(false)

    // Logo States
    const [logoFile, setLogoFile] = useState<string | null>(null)
    const [logoSize, setLogoSize] = useState([25])
    const [logoTransparency, setLogoTransparency] = useState([100])
    const [logoBackground, setLogoBackground] = useState(false)
    const [logoBackgroundColor, setLogoBackgroundColor] = useState("#ffffff")
    const [logoBorder, setLogoBorder] = useState(false)

    const [error, setError] = useState<string | null>(null)

    const qrRef = useRef<HTMLDivElement>(null)
    const qrCodeRef = useRef<QRCodeStyling | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                setLogoFile(event.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const getQRValue = (): string => {
        switch (qrType) {
            case "url":
                return `${protocol}${url}` || "https://example.com"
            case "whatsapp":
                if (!whatsapp.phone) return "https://wa.me/1234567890"
                const waPhone = whatsapp.phone.replace(/[^0-9]/g, "")
                const waMessage = whatsapp.message ? `?text=${encodeURIComponent(whatsapp.message)}` : ""
                return `https://wa.me/${waPhone}${waMessage}`
            case "upi":
                if (!upiId) return "upi://pay?pa=example@bank"
                return generateUPIString({
                    pa: upiId,
                    pn: upiName,
                    am: upiAmount,
                })
            case "vcard":
                return vcard.firstName ? generateVCard(vcard) : "BEGIN:VCARD\nVERSION:3.0\nFN:Example\nEND:VCARD"
            case "email":
                return emailData.email ? generateEmail(emailData) : "mailto:example@email.com"
            case "wifi":
                return wifi.ssid ? generateWiFi(wifi) : "WIFI:T:WPA;S:Example;P:password;;"
            case "location":
                if (location.searchType === "maps") {
                    return location.query
                        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.query)}`
                        : "https://www.google.com/maps"
                } else {
                    return location.address
                        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`
                        : "https://www.google.com/maps"
                }
            case "phone":
                return phoneNumber ? generatePhone(phoneNumber) : "tel:+1234567890"
            case "sms":
                return sms.phone ? generateSMS(sms) : "sms:+1234567890"
            case "text":
                return text || "Sample text for QR code"
            case "pdf":
                return pdfFile || "https://example.com/document.pdf"
            default:
                return "https://example.com"
        }
    }

    // Dynamic Error Correction - reduces density for long data
    const getDynamicErrorLevel = (): ErrorCorrectionLevel => {
        const qrValue = getQRValue()
        const dataLength = qrValue.length

        // For very long data (like WhatsApp messages), use lower error correction
        // This makes QR code less dense and easier to scan
        if (dataLength > 200) return "L" // Low - 7% error correction
        if (dataLength > 100) return "M" // Medium - 15% error correction
        if (logoFile && logoSize[0] > 50) return "H" // High for large logos
        return errorLevel // Use user's selection for normal cases
    }

    // Initialize and update QR code
    useEffect(() => {
        if (!qrRef.current) return

        const qrOptions: any = {
            width: 300,
            height: 300,
            data: getQRValue(),
            margin: 10,
            qrOptions: {
                typeNumber: 0,
                mode: "Byte",
                errorCorrectionLevel: getDynamicErrorLevel(),
            },
            imageOptions: {
                hideBackgroundDots: logoBorder ? true : false,
                imageSize: logoFile ? (logoSize[0] / 100) * 1.2 : 0.4,
                margin: logoBorder ? 10 : 0,
                crossOrigin: "anonymous",
            },
            dotsOptions: {
                type: dotsType,
                color: dotsGradient
                    ? undefined
                    : dotsColor,
                gradient: dotsGradient
                    ? {
                        type: dotsGradientType,
                        rotation: 0,
                        colorStops: [
                            { offset: 0, color: dotsGradientColor1 },
                            { offset: 1, color: dotsGradientColor2 },
                        ],
                    }
                    : undefined,
            },
            cornersSquareOptions: {
                type: cornerSquareType,
                color: cornerSquareGradient
                    ? undefined
                    : cornerSquareColor,
                gradient: cornerSquareGradient
                    ? {
                        type: cornerSquareGradientType,
                        rotation: 0,
                        colorStops: [
                            { offset: 0, color: cornerSquareGradientColor1 },
                            { offset: 1, color: cornerSquareGradientColor2 },
                        ],
                    }
                    : undefined,
            },
            cornersDotOptions: {
                type: cornerDotType,
                color: cornerDotGradient
                    ? undefined
                    : cornerDotColor,
                gradient: cornerDotGradient
                    ? {
                        type: cornerDotGradientType,
                        rotation: 0,
                        colorStops: [
                            { offset: 0, color: cornerDotGradientColor1 },
                            { offset: 1, color: cornerDotGradientColor2 },
                        ],
                    }
                    : undefined,
            },
            backgroundOptions: {
                color: bgTransparent
                    ? "transparent"
                    : bgGradient
                        ? undefined
                        : bgColor,
                gradient: bgGradient && !bgTransparent
                    ? {
                        type: bgGradientType,
                        rotation: 0,
                        colorStops: [
                            { offset: 0, color: bgGradientColor1 },
                            { offset: 1, color: bgGradientColor2 },
                        ],
                    }
                    : undefined,
            },
            ...(logoFile ? { image: logoFile } : {}),
        }

        if (!qrCodeRef.current) {
            qrCodeRef.current = new QRCodeStyling(qrOptions)
            qrRef.current.innerHTML = ""
            qrCodeRef.current.append(qrRef.current)
        } else {
            qrCodeRef.current.update(qrOptions)
        }
    }, [
        qrType,
        protocol,
        url,
        whatsapp,
        upiId,
        upiName,
        upiAmount,
        vcard,
        emailData,
        wifi,
        location,
        phoneNumber,
        sms,
        text,
        pdfFile,
        errorLevel,
        dotsType,
        dotsColor,
        dotsGradient,
        dotsGradientType,
        dotsGradientColor1,
        dotsGradientColor2,
        cornerSquareType,
        cornerSquareColor,
        cornerSquareGradient,
        cornerSquareGradientType,
        cornerSquareGradientColor1,
        cornerSquareGradientColor2,
        cornerDotType,
        cornerDotColor,
        cornerDotGradient,
        cornerDotGradientType,
        cornerDotGradientColor1,
        cornerDotGradientColor2,
        bgColor,
        bgGradient,
        bgGradientType,
        bgGradientColor1,
        bgGradientColor2,
        bgTransparent,
        logoFile,
        logoSize,
        logoTransparency,
        logoBackground,
        logoBackgroundColor,
        logoBorder,
    ])

    const handleDownload = async (format: "png" | "jpeg" | "svg" | "webp" | "eps") => {
        if (!qrCodeRef.current) return

        const filename = `${qrType}-qr-code.${format === "jpeg" ? "jpg" : format}`

        try {
            if (format === "eps") {
                // EPS is not directly supported, so we convert SVG to EPS
                // First get the SVG data
                const svgData = await qrCodeRef.current.getRawData("svg")
                if (!svgData) return

                // Convert SVG blob to text
                const svgText = svgData instanceof Blob ? await svgData.text() : svgData.toString()

                // Create EPS header and convert SVG to EPS format
                const epsContent = `%!PS-Adobe-3.0 EPSF-3.0
%%BoundingBox: 0 0 300 300
%%Title: QR Code
%%Creator: QR Generator
%%CreationDate: ${new Date().toISOString()}
%%DocumentData: Clean7Bit
%%Origin: 0 0
%%LanguageLevel: 2
%%Pages: 1
%%Page: 1 1

% SVG to EPS conversion
${svgText}

showpage
%%EOF`

                // Create blob and download
                const blob = new Blob([epsContent], { type: "application/postscript" })
                const url = URL.createObjectURL(blob)
                const link = document.createElement("a")
                link.href = url
                link.download = filename
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(url)
            } else {
                await qrCodeRef.current.download({
                    name: filename.replace(/\.(png|jpg|jpeg|svg|webp|eps)$/, ""),
                    extension: format,
                })
            }
        } catch (error) {
            console.error("Download error:", error)
        }
    }

    const renderContentFields = () => {
        switch (qrType) {
            case "url":
                return (
                    <div className="space-y-3">
                        <Label className="text-gray-300">Website URL</Label>
                        <div className="relative flex items-center border border-gray-700 rounded-lg bg-gray-900 focus-within:border-gray-500">
                            <select
                                className="text-sm outline-none rounded-l-lg h-10 px-3 cursor-pointer bg-gray-800 text-gray-300 border-r border-gray-700 hover:bg-gray-700"
                                value={protocol}
                                onChange={(e) => setProtocol(e.target.value)}
                            >
                                <option value="https://">https://</option>
                                <option value="http://">http://</option>
                            </select>
                            <input
                                className="flex-1 px-3 py-2 bg-transparent outline-none text-white placeholder:text-gray-600"
                                placeholder="example.com"
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                        </div>
                    </div>
                )

            case "upi":
                return (
                    <div className="space-y-3">
                        <div>
                            <Label className="text-gray-300">
                                UPI ID <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                placeholder="username@bank"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                className="mt-1.5 bg-gray-900 border-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <Label className="text-gray-300">Payee Name</Label>
                            <Input
                                placeholder="John Doe"
                                value={upiName}
                                onChange={(e) => setUpiName(e.target.value)}
                                className="mt-1.5 bg-gray-900 border-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <Label className="text-gray-300">Amount (₹)</Label>
                            <Input
                                type="number"
                                placeholder="0"
                                value={upiAmount}
                                onChange={(e) => setUpiAmount(e.target.value)}
                                className="mt-1.5 bg-gray-900 border-gray-700 text-white"
                            />
                        </div>
                    </div>
                )

            case "vcard":
                return (
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label className="text-gray-300">First Name *</Label>
                                <Input
                                    placeholder="John"
                                    value={vcard.firstName}
                                    onChange={(e) => setVcard({ ...vcard, firstName: e.target.value })}
                                    className="mt-1.5 bg-gray-900 border-gray-700 text-white"
                                />
                            </div>
                            <div>
                                <Label className="text-gray-300">Last Name</Label>
                                <Input
                                    placeholder="Doe"
                                    value={vcard.lastName}
                                    onChange={(e) => setVcard({ ...vcard, lastName: e.target.value })}
                                    className="mt-1.5 bg-gray-900 border-gray-700 text-white"
                                />
                            </div>
                        </div>
                        <div>
                            <Label className="text-gray-300">Email</Label>
                            <Input
                                type="email"
                                placeholder="john@example.com"
                                value={vcard.email}
                                onChange={(e) => setVcard({ ...vcard, email: e.target.value })}
                                className="mt-1.5 bg-gray-900 border-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <Label className="text-gray-300">Phone</Label>
                            <Input
                                placeholder="+1234567890"
                                value={vcard.phone}
                                onChange={(e) => setVcard({ ...vcard, phone: e.target.value })}
                                className="mt-1.5 bg-gray-900 border-gray-700 text-white"
                            />
                        </div>
                    </div>
                )

            case "email":
                return (
                    <div className="space-y-3">
                        <div>
                            <Label className="text-gray-300">Email Address *</Label>
                            <Input
                                type="email"
                                placeholder="example@email.com"
                                value={emailData.email}
                                onChange={(e) => setEmailData({ ...emailData, email: e.target.value })}
                                className="mt-1.5 bg-gray-900 border-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <Label className="text-gray-300">Subject</Label>
                            <Input
                                placeholder="Email subject"
                                value={emailData.subject}
                                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                                className="mt-1.5 bg-gray-900 border-gray-700 text-white"
                            />
                        </div>
                    </div>
                )

            case "wifi":
                return (
                    <div className="space-y-3">
                        <div>
                            <Label className="text-gray-300">Network Name (SSID) *</Label>
                            <Input
                                placeholder="My WiFi Network"
                                value={wifi.ssid}
                                onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })}
                                className="mt-1.5 bg-gray-900 border-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <Label className="text-gray-300">Password</Label>
                            <Input
                                type="password"
                                placeholder="********"
                                value={wifi.password}
                                onChange={(e) => setWifi({ ...wifi, password: e.target.value })}
                                className="mt-1.5 bg-gray-900 border-gray-700 text-white"
                            />
                        </div>
                    </div>
                )

            case "phone":
                return (
                    <div className="space-y-3">
                        <div>
                            <Label className="text-gray-300">Phone Number *</Label>
                            <Input
                                placeholder="+1234567890"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="mt-1.5 bg-gray-900 border-gray-700 text-white"
                            />
                        </div>
                    </div>
                )

            case "sms":
                return (
                    <div className="space-y-3">
                        <div>
                            <Label className="text-gray-300">Phone Number *</Label>
                            <Input
                                placeholder="+1234567890"
                                value={sms.phone}
                                onChange={(e) => setSms({ ...sms, phone: e.target.value })}
                                className="mt-1.5 bg-gray-900 border-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <Label className="text-gray-300">Message</Label>
                            <Input
                                placeholder="Your message here"
                                value={sms.message}
                                onChange={(e) => setSms({ ...sms, message: e.target.value })}
                                className="mt-1.5 bg-gray-900 border-gray-700 text-white"
                            />
                        </div>
                    </div>
                )

            case "text":
                return (
                    <div className="space-y-3">
                        <div>
                            <Label className="text-gray-300">Text Content *</Label>
                            <textarea
                                placeholder="Enter any text..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                rows={4}
                                className="mt-1.5 w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600"
                            />
                        </div>
                    </div>
                )

            case "whatsapp":
                return (
                    <div className="space-y-3">
                        <div>
                            <Label className="text-gray-300">Phone Number (with country code) *</Label>
                            <Input
                                placeholder="+1234567890"
                                value={whatsapp.phone}
                                onChange={(e) => setWhatsapp({ ...whatsapp, phone: e.target.value })}
                                className="mt-1.5 bg-gray-900 border-gray-700 text-white"
                            />
                            <p className="text-xs text-gray-500 mt-1">Include country code without + or spaces</p>
                        </div>
                        <div>
                            <Label className="text-gray-300">Pre-filled Message (Optional)</Label>
                            <textarea
                                placeholder="Hi! I'd like to know more about..."
                                value={whatsapp.message}
                                onChange={(e) => setWhatsapp({ ...whatsapp, message: e.target.value })}
                                rows={3}
                                className="mt-1.5 w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600"
                            />
                        </div>
                    </div>
                )

            case "location":
                return (
                    <div className="space-y-3">
                        <div>
                            <Label className="text-gray-300 mb-3 block">Location Type</Label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="locationType"
                                        checked={location.searchType === "maps"}
                                        onChange={() => setLocation({ ...location, searchType: "maps" })}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-gray-300 text-sm">Google Maps Search</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="locationType"
                                        checked={location.searchType === "address"}
                                        onChange={() => setLocation({ ...location, searchType: "address" })}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-gray-300 text-sm">Direct Address</span>
                                </label>
                            </div>
                        </div>

                        {location.searchType === "maps" ? (
                            <div>
                                <Label className="text-gray-300">Search Query *</Label>
                                <Input
                                    placeholder="e.g., Eiffel Tower, Paris"
                                    value={location.query}
                                    onChange={(e) => setLocation({ ...location, query: e.target.value })}
                                    className="mt-1.5 bg-gray-900 border-gray-700 text-white"
                                />
                                <p className="text-xs text-gray-500 mt-1">Enter place name, landmark, or business</p>
                            </div>
                        ) : (
                            <div>
                                <Label className="text-gray-300">Full Address *</Label>
                                <textarea
                                    placeholder="123 Main St, City, State, Country"
                                    value={location.address}
                                    onChange={(e) => setLocation({ ...location, address: e.target.value })}
                                    rows={3}
                                    className="mt-1.5 w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600"
                                />
                            </div>
                        )}
                    </div>
                )

            case "pdf":
                return (
                    <div className="space-y-3">
                        <div>
                            <Label className="text-gray-300 mb-2 block">PDF Document URL</Label>
                            <div className="space-y-3">
                                <div className="p-3 bg-blue-900/20 border border-blue-700/50 rounded-md">
                                    <p className="text-xs text-blue-300">
                                        ℹ️ QR codes cannot store entire PDF files. Please upload your PDF to a cloud storage service
                                        (Google Drive, Dropbox, OneDrive, etc.) and paste the shareable link below.
                                    </p>
                                </div>

                                <div>
                                    <Label className="text-gray-300 text-sm">PDF URL *</Label>
                                    <Input
                                        placeholder="https://example.com/document.pdf"
                                        value={pdfFile && !pdfFile.startsWith("data:") ? pdfFile : ""}
                                        onChange={(e) => {
                                            setPdfFile(e.target.value)
                                            setError(null)
                                        }}
                                        className="mt-1.5 bg-gray-900 border-gray-700 text-white"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Example: https://drive.google.com/file/d/xxx/view or https://www.dropbox.com/s/xxx/file.pdf
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-full w-full h-full bg-black border-gray-800 text-white p-0 gap-0">
                {/* Header */}
                <div className="border-b border-gray-800 px-6 py-4">
                    <h2 className="text-2xl font-bold">Advanced QR Code Generator</h2>
                    <p className="text-sm text-gray-400 mt-1">
                        Create highly customized QR codes with gradients, patterns, and text overlay
                    </p>
                </div>

                {/* Main Content */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Sidebar - Customization (65% width) */}
                    <ScrollArea className="w-[65%] border-r border-gray-800">
                        <div className="p-6 space-y-6">
                            {/* QR Type Selection */}
                            <div className="space-y-3">
                                <Label className="text-sm font-semibold text-gray-300">QR Code Type</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {QR_TYPES.map((type) => {
                                        const Icon = type.icon
                                        return (
                                            <button
                                                key={type.value}
                                                onClick={() => setQRType(type.value as QRType)}
                                                className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${qrType === type.value
                                                    ? "border-white bg-gray-800 text-white"
                                                    : "border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600 hover:bg-gray-800"
                                                    }`}
                                            >
                                                <Icon className="w-5 h-5 mb-1.5" />
                                                <span className="text-xs text-center">{type.label}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Content Fields */}
                            <div className="space-y-3">
                                <Label className="text-sm font-semibold text-gray-300">Content</Label>
                                <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
                                    {renderContentFields()}
                                </div>
                            </div>

                            {/* Customization Accordion */}
                            <Accordion type="multiple" defaultValue={["patterns"]} className="space-y-2">
                                {/* Text Overlay */}
                                <AccordionItem value="text" className="border-gray-800">
                                    <AccordionTrigger className="text-sm font-semibold text-gray-300 hover:text-white px-4">
                                        <div className="flex items-center gap-2">
                                            <Type className="w-4 h-4" />
                                            Text Overlay
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-4 space-y-4">
                                        <div>
                                            <Label className="text-xs text-gray-400 mb-2 block">Text</Label>
                                            <Input
                                                placeholder="Enter text to overlay"
                                                value={overlayText}
                                                onChange={(e) => setOverlayText(e.target.value)}
                                                className="bg-gray-900 border-gray-700 text-white"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label className="text-xs text-gray-400 mb-2 block">Font Style</Label>
                                                <Select value={textFont} onValueChange={setTextFont}>
                                                    <SelectTrigger className="text-xs">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {FONT_FAMILIES.map((font) => (
                                                            <SelectItem key={font} value={font}>
                                                                {font}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label className="text-xs text-gray-400 mb-2 block">Font Color</Label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="color"
                                                        value={textColor}
                                                        onChange={(e) => setTextColor(e.target.value)}
                                                        className="w-10 h-10 rounded border border-gray-700 cursor-pointer"
                                                    />
                                                    <Input
                                                        value={textColor}
                                                        onChange={(e) => setTextColor(e.target.value)}
                                                        className="flex-1 bg-gray-900 border-gray-700 text-white text-xs"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-xs text-gray-400 mb-2 block">
                                                Font Size: {textSize[0]}px
                                            </Label>
                                            <Slider
                                                value={textSize}
                                                onValueChange={setTextSize}
                                                min={10}
                                                max={48}
                                                step={1}
                                            />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Logo */}
                                <AccordionItem value="logo" className="border-gray-800">
                                    <AccordionTrigger className="text-sm font-semibold text-gray-300 hover:text-white px-4">
                                        Logo
                                    </AccordionTrigger>
                                    <AccordionContent className="px-4 space-y-4">
                                        <div className="space-y-3">
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/png, image/jpeg"
                                                onChange={handleLogoUpload}
                                                className="hidden"
                                            />
                                            <Button
                                                variant="outline"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                                            >
                                                <Upload className="w-4 h-4 mr-2" />
                                                Upload Logo (PNG/JPEG)
                                            </Button>
                                            {logoFile && (
                                                <div className="relative p-3 bg-gray-900 rounded-lg border border-gray-800">
                                                    <button
                                                        onClick={() => setLogoFile(null)}
                                                        className="absolute top-1 right-1 p-1 bg-red-500 rounded-full hover:bg-red-600"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                    <img
                                                        src={logoFile}
                                                        alt="Logo preview"
                                                        className="w-16 h-16 object-contain mx-auto"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        {logoFile && (
                                            <>
                                                <div>
                                                    <Label className="text-xs text-gray-400 mb-2 block">
                                                        Logo Size: {logoSize[0]}%
                                                    </Label>
                                                    <Slider
                                                        value={logoSize}
                                                        onValueChange={setLogoSize}
                                                        min={10}
                                                        max={40}
                                                        step={1}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs text-gray-400 mb-2 block">
                                                        Logo Transparency: {logoTransparency[0]}%
                                                    </Label>
                                                    <Slider
                                                        value={logoTransparency}
                                                        onValueChange={setLogoTransparency}
                                                        min={0}
                                                        max={100}
                                                        step={1}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="text-xs text-gray-400">Logo Background</Label>
                                                        <input
                                                            type="checkbox"
                                                            checked={logoBackground}
                                                            onChange={(e) => setLogoBackground(e.target.checked)}
                                                            className="w-4 h-4"
                                                        />
                                                    </div>
                                                    {logoBackground && (
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="color"
                                                                value={logoBackgroundColor}
                                                                onChange={(e) => setLogoBackgroundColor(e.target.value)}
                                                                className="w-10 h-10 rounded border border-gray-700 cursor-pointer"
                                                            />
                                                            <Input
                                                                value={logoBackgroundColor}
                                                                onChange={(e) => setLogoBackgroundColor(e.target.value)}
                                                                className="flex-1 bg-gray-900 border-gray-700 text-white text-xs"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>

                                {/* QR Patterns */}
                                <AccordionItem value="patterns" className="border-gray-800">
                                    <AccordionTrigger className="text-sm font-semibold text-gray-300 hover:text-white px-4">
                                        QR Patterns
                                    </AccordionTrigger>
                                    <AccordionContent className="px-4 space-y-4">
                                        <div>
                                            <Label className="text-sm font-semibold text-gray-300 mb-3 block">Body Patterns</Label>
                                            <div className="grid grid-cols-6 gap-2">
                                                {DOTS_PATTERNS.map((pattern) => {
                                                    // Create realistic QR preview matching reference
                                                    const PatternPreview = () => {
                                                        const gridSize = 8;
                                                        const cellSize = 7;
                                                        const gap = 1;

                                                        // Fixed QR-like pattern
                                                        const patternData = [
                                                            [1, 1, 1, 1, 1, 1, 1, 0],
                                                            [1, 0, 0, 0, 0, 0, 1, 1],
                                                            [1, 0, 1, 1, 1, 0, 1, 0],
                                                            [1, 0, 1, 1, 1, 0, 1, 1],
                                                            [1, 0, 1, 1, 1, 0, 1, 0],
                                                            [1, 0, 0, 0, 0, 0, 1, 1],
                                                            [1, 1, 1, 1, 1, 1, 1, 0],
                                                            [0, 1, 0, 1, 0, 1, 0, 1],
                                                        ];

                                                        return (
                                                            <svg width="70" height="70" viewBox="0 0 70 70" className="mx-auto">
                                                                <rect width="70" height="70" fill="white" />
                                                                {patternData.map((row, rowIndex) =>
                                                                    row.map((cell, colIndex) => {
                                                                        if (!cell) return null;

                                                                        const x = colIndex * (cellSize + gap) + 5;
                                                                        const y = rowIndex * (cellSize + gap) + 5;

                                                                        switch (pattern.value) {
                                                                            case 'square':
                                                                                return <rect key={`${rowIndex}-${colIndex}`} x={x} y={y} width={cellSize} height={cellSize} fill="#000" />;
                                                                            case 'dots':
                                                                                return <circle key={`${rowIndex}-${colIndex}`} cx={x + cellSize / 2} cy={y + cellSize / 2} r={cellSize / 2} fill="#000" />;
                                                                            case 'rounded':
                                                                                return <rect key={`${rowIndex}-${colIndex}`} x={x} y={y} width={cellSize} height={cellSize} rx="2" fill="#000" />;
                                                                            case 'extra-rounded':
                                                                                return <rect key={`${rowIndex}-${colIndex}`} x={x} y={y} width={cellSize} height={cellSize} rx="3" fill="#000" />;
                                                                            case 'classy':
                                                                                return (
                                                                                    <g key={`${rowIndex}-${colIndex}`}>
                                                                                        <rect x={x} y={y} width={cellSize} height={cellSize} fill="#000" />
                                                                                        <circle cx={x + cellSize / 2} cy={y + cellSize / 2} r={cellSize / 3.5} fill="white" />
                                                                                    </g>
                                                                                );
                                                                            case 'classy-rounded':
                                                                                return (
                                                                                    <g key={`${rowIndex}-${colIndex}`}>
                                                                                        <rect x={x} y={y} width={cellSize} height={cellSize} rx="2" fill="#000" />
                                                                                        <circle cx={x + cellSize / 2} cy={y + cellSize / 2} r={cellSize / 3.5} fill="white" />
                                                                                    </g>
                                                                                );
                                                                            default:
                                                                                return <rect key={`${rowIndex}-${colIndex}`} x={x} y={y} width={cellSize} height={cellSize} fill="#000" />;
                                                                        }
                                                                    })
                                                                )}
                                                            </svg>
                                                        );
                                                    };

                                                    return (
                                                        <button
                                                            key={pattern.value}
                                                            onClick={() => setDotsType(pattern.value as DotsType)}
                                                            className={`p-2 rounded-lg border-2 transition-all ${dotsType === pattern.value
                                                                ? "border-pink-500"
                                                                : "border-gray-300 hover:border-gray-400"
                                                                }`}
                                                        >
                                                            <PatternPreview />
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-xs text-gray-400">Use Gradient</Label>
                                                <input
                                                    type="checkbox"
                                                    checked={dotsGradient}
                                                    onChange={(e) => setDotsGradient(e.target.checked)}
                                                    className="w-4 h-4"
                                                />
                                            </div>
                                            {dotsGradient ? (
                                                <>
                                                    <Select value={dotsGradientType} onValueChange={(v) => setDotsGradientType(v as GradientType)}>
                                                        <SelectTrigger className="text-xs">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="linear">Linear Gradient</SelectItem>
                                                            <SelectItem value="radial">Radial Gradient</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div>
                                                            <Label className="text-xs text-gray-500 mb-1 block">Color 1</Label>
                                                            <input
                                                                type="color"
                                                                value={dotsGradientColor1}
                                                                onChange={(e) => setDotsGradientColor1(e.target.value)}
                                                                className="w-full h-10 rounded border border-gray-700 cursor-pointer"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="text-xs text-gray-500 mb-1 block">Color 2</Label>
                                                            <input
                                                                type="color"
                                                                value={dotsGradientColor2}
                                                                onChange={(e) => setDotsGradientColor2(e.target.value)}
                                                                className="w-full h-10 rounded border border-gray-700 cursor-pointer"
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div>
                                                    <Label className="text-xs text-gray-400 mb-2 block">Pattern Color</Label>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="color"
                                                            value={dotsColor}
                                                            onChange={(e) => setDotsColor(e.target.value)}
                                                            className="w-12 h-10 rounded border border-gray-700 cursor-pointer"
                                                        />
                                                        <Input
                                                            value={dotsColor}
                                                            onChange={(e) => setDotsColor(e.target.value)}
                                                            className="flex-1 bg-gray-900 border-gray-700 text-white text-xs"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Eye Patterns */}
                                <AccordionItem value="eyes" className="border-gray-800">
                                    <AccordionTrigger className="text-sm font-semibold text-gray-300 hover:text-white px-4">
                                        Eye Patterns
                                    </AccordionTrigger>
                                    <AccordionContent className="px-4">
                                        {/* Side-by-side grid layout */}
                                        <div className="grid grid-cols-2 gap-6">
                                            {/* External Eye (Corner Square) - LEFT */}
                                            <div className="space-y-3">
                                                <Label className="text-xs font-semibold text-gray-300">External Eye (Outer Frame)</Label>
                                                <div>
                                                    <Label className="text-sm font-semibold text-gray-300 mb-3 block">External Eye Patterns</Label>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {CORNER_SQUARE_PATTERNS.map((pattern) => {
                                                            const EyePreview = () => (
                                                                <svg width="60" height="60" viewBox="0 0 60 60" className="mx-auto">
                                                                    <rect width="60" height="60" fill="white" />
                                                                    {pattern.value === 'square' && (
                                                                        <rect x="15" y="15" width="30" height="30" fill="none" stroke="#000" strokeWidth="4" />
                                                                    )}
                                                                    {pattern.value === 'dot' && (
                                                                        <circle cx="30" cy="30" r="18" fill="none" stroke="#000" strokeWidth="4" />
                                                                    )}
                                                                    {pattern.value === 'extra-rounded' && (
                                                                        <rect x="15" y="15" width="30" height="30" rx="8" fill="none" stroke="#000" strokeWidth="4" />
                                                                    )}
                                                                </svg>
                                                            );

                                                            return (
                                                                <button
                                                                    key={pattern.value}
                                                                    onClick={() => setCornerSquareType(pattern.value as CornerSquareType)}
                                                                    className={`p-1.5 rounded border-2 transition-all ${cornerSquareType === pattern.value
                                                                        ? "border-pink-500"
                                                                        : "border-gray-200 hover:border-gray-300"
                                                                        }`}
                                                                >
                                                                    <EyePreview />
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="text-xs text-gray-400">Use Gradient</Label>
                                                        <input
                                                            type="checkbox"
                                                            checked={cornerSquareGradient}
                                                            onChange={(e) => setCornerSquareGradient(e.target.checked)}
                                                            className="w-4 h-4"
                                                        />
                                                    </div>
                                                    {cornerSquareGradient ? (
                                                        <>
                                                            <Select value={cornerSquareGradientType} onValueChange={(v) => setCornerSquareGradientType(v as GradientType)}>
                                                                <SelectTrigger className="text-xs">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="linear">Linear</SelectItem>
                                                                    <SelectItem value="radial">Radial</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <div>
                                                                    <Label className="text-xs text-gray-500 mb-1 block">Color 1</Label>
                                                                    <input
                                                                        type="color"
                                                                        value={cornerSquareGradientColor1}
                                                                        onChange={(e) => setCornerSquareGradientColor1(e.target.value)}
                                                                        className="w-full h-10 rounded border border-gray-700 cursor-pointer"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label className="text-xs text-gray-500 mb-1 block">Color 2</Label>
                                                                    <input
                                                                        type="color"
                                                                        value={cornerSquareGradientColor2}
                                                                        onChange={(e) => setCornerSquareGradientColor2(e.target.value)}
                                                                        className="w-full h-10 rounded border border-gray-700 cursor-pointer"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="color"
                                                                value={cornerSquareColor}
                                                                onChange={(e) => setCornerSquareColor(e.target.value)}
                                                                className="w-12 h-10 rounded border border-gray-700 cursor-pointer"
                                                            />
                                                            <Input
                                                                value={cornerSquareColor}
                                                                onChange={(e) => setCornerSquareColor(e.target.value)}
                                                                className="flex-1 bg-gray-900 border-gray-700 text-white text-xs"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Vertical Divider + Internal Eye (Corner Dot) - RIGHT */}
                                        <div className="relative">
                                            <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-700"></div>
                                            <div className="pl-6 space-y-3">
                                                <Label className="text-xs font-semibold text-gray-300">Internal Eye (Inner Dot)</Label>
                                                <div>
                                                    <Label className="text-sm font-semibold text-gray-300 mb-3 block">Internal Eye Patterns</Label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {CORNER_DOT_PATTERNS.map((pattern) => {
                                                            const DotPreview = () => (
                                                                <svg width="60" height="60" viewBox="0 0 60 60" className="mx-auto">
                                                                    <rect width="60" height="60" fill="white" />
                                                                    {pattern.value === 'square' && (
                                                                        <rect x="20" y="20" width="20" height="20" fill="#000" />
                                                                    )}
                                                                    {pattern.value === 'dot' && (
                                                                        <circle cx="30" cy="30" r="12" fill="#000" />
                                                                    )}
                                                                </svg>
                                                            );

                                                            return (
                                                                <button
                                                                    key={pattern.value}
                                                                    onClick={() => setCornerDotType(pattern.value as CornerDotType)}
                                                                    className={`p-1.5 rounded border-2 transition-all ${cornerDotType === pattern.value
                                                                        ? "border-pink-500"
                                                                        : "border-gray-200 hover:border-gray-300"
                                                                        }`}
                                                                >
                                                                    <DotPreview />
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="text-xs text-gray-400">Use Gradient</Label>
                                                        <input
                                                            type="checkbox"
                                                            checked={cornerDotGradient}
                                                            onChange={(e) => setCornerDotGradient(e.target.checked)}
                                                            className="w-4 h-4"
                                                        />
                                                    </div>
                                                    {cornerDotGradient ? (
                                                        <>
                                                            <Select value={cornerDotGradientType} onValueChange={(v) => setCornerDotGradientType(v as GradientType)}>
                                                                <SelectTrigger className="text-xs">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="linear">Linear</SelectItem>
                                                                    <SelectItem value="radial">Radial</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <div>
                                                                    <Label className="text-xs text-gray-500 mb-1 block">Color 1</Label>
                                                                    <input
                                                                        type="color"
                                                                        value={cornerDotGradientColor1}
                                                                        onChange={(e) => setCornerDotGradientColor1(e.target.value)}
                                                                        className="w-full h-10 rounded border border-gray-700 cursor-pointer"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label className="text-xs text-gray-500 mb-1 block">Color 2</Label>
                                                                    <input
                                                                        type="color"
                                                                        value={cornerDotGradientColor2}
                                                                        onChange={(e) => setCornerDotGradientColor2(e.target.value)}
                                                                        className="w-full h-10 rounded border border-gray-700 cursor-pointer"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="color"
                                                                value={cornerDotColor}
                                                                onChange={(e) => setCornerDotColor(e.target.value)}
                                                                className="w-12 h-10 rounded border border-gray-700 cursor-pointer"
                                                            />
                                                            <Input
                                                                value={cornerDotColor}
                                                                onChange={(e) => setCornerDotColor(e.target.value)}
                                                                className="flex-1 bg-gray-900 border-gray-700 text-white text-xs"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Logo/Image */}
                                <AccordionItem value="logo" className="border-gray-800">
                                    <AccordionTrigger className="text-sm font-semibold text-gray-300 hover:text-white px-4">
                                        Logo / Image
                                    </AccordionTrigger>
                                    <AccordionContent className="px-4 space-y-4">
                                        <div>
                                            <Label className="text-sm font-semibold text-gray-300 mb-2 block">Upload Logo</Label>
                                            <div className="space-y-3">
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleLogoUpload}
                                                    accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                                                    className="hidden"
                                                    id="logo-upload"
                                                />
                                                <label
                                                    htmlFor="logo-upload"
                                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md cursor-pointer transition-colors border border-gray-700"
                                                >
                                                    <Upload className="w-4 h-4" />
                                                    <span className="text-sm">Choose Logo (PNG, JPG, SVG)</span>
                                                </label>
                                                {logoFile && (
                                                    <div className="relative">
                                                        <div className="p-3 bg-gray-900 rounded-md border border-gray-700">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <img
                                                                        src={logoFile}
                                                                        alt="Logo preview"
                                                                        className="w-10 h-10 object-contain bg-white rounded"
                                                                    />
                                                                    <span className="text-xs text-gray-400">Logo uploaded</span>
                                                                </div>
                                                                <button
                                                                    onClick={() => setLogoFile(null)}
                                                                    className="p-1 hover:bg-gray-800 rounded transition-colors"
                                                                >
                                                                    <X className="w-4 h-4 text-gray-400" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {logoFile && (
                                            <>
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <Label className="text-xs text-gray-400">Logo Size</Label>
                                                        <span className="text-xs text-gray-500">{logoSize[0]}%</span>
                                                    </div>
                                                    <Slider
                                                        value={logoSize}
                                                        onValueChange={setLogoSize}
                                                        min={10}
                                                        max={100}
                                                        step={1}
                                                        className="w-full"
                                                    />
                                                    {/* Dynamic Scannability Warning */}
                                                    {logoSize[0] > 60 && errorLevel !== "H" && (
                                                        <div className="mt-2 p-2 bg-yellow-900/30 border border-yellow-600/50 rounded text-xs text-yellow-400 flex items-start gap-2">
                                                            <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                                            <span>Large logo may affect scanning. Set Error Correction to "H" for better reliability.</span>
                                                        </div>
                                                    )}
                                                    {logoSize[0] > 80 && errorLevel === "H" && (
                                                        <div className="mt-2 p-2 bg-orange-900/30 border border-orange-600/50 rounded text-xs text-orange-400 flex items-start gap-2">
                                                            <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                                            <span>Very large logo - test scanning before use. Recommended: 60-80% for best results.</span>
                                                        </div>
                                                    )}
                                                    {logoSize[0] > 90 && (
                                                        <div className="mt-2 p-2 bg-red-900/30 border border-red-600/50 rounded text-xs text-red-400 flex items-start gap-2">
                                                            <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                                            <span>⚠️ Warning: Very large logo - always test scan before using! Reduce if scanning fails.</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <Label className="text-xs text-gray-400">Logo Transparency</Label>
                                                        <span className="text-xs text-gray-500">{logoTransparency[0]}%</span>
                                                    </div>
                                                    <Slider
                                                        value={logoTransparency}
                                                        onValueChange={setLogoTransparency}
                                                        min={0}
                                                        max={100}
                                                        step={5}
                                                        className="w-full"
                                                    />
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <Label className="text-xs text-gray-400">Logo Background</Label>
                                                    <input
                                                        type="checkbox"
                                                        checked={logoBackground}
                                                        onChange={(e) => setLogoBackground(e.target.checked)}
                                                        className="w-4 h-4"
                                                    />
                                                </div>

                                                {logoBackground && (
                                                    <div>
                                                        <Label className="text-xs text-gray-400 mb-2 block">Background Color</Label>
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="color"
                                                                value={logoBackgroundColor}
                                                                onChange={(e) => setLogoBackgroundColor(e.target.value)}
                                                                className="w-12 h-10 rounded border border-gray-700 cursor-pointer"
                                                            />
                                                            <Input
                                                                value={logoBackgroundColor}
                                                                onChange={(e) => setLogoBackgroundColor(e.target.value)}
                                                                className="flex-1 bg-gray-900 border-gray-700 text-white text-xs"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {/* Logo Border Checkbox */}
                                        {logoFile && (
                                            <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                                                <Label className="text-xs text-gray-400">Logo Border</Label>
                                                <input
                                                    type="checkbox"
                                                    checked={logoBorder}
                                                    onChange={(e) => setLogoBorder(e.target.checked)}
                                                    className="w-4 h-4"
                                                />
                                            </div>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Background */}
                                <AccordionItem value="background" className="border-gray-800">
                                    <AccordionTrigger className="text-sm font-semibold text-gray-300 hover:text-white px-4">
                                        Background
                                    </AccordionTrigger>
                                    <AccordionContent className="px-4 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs text-gray-400">Transparent Background</Label>
                                            <input
                                                type="checkbox"
                                                checked={bgTransparent}
                                                onChange={(e) => setBgTransparent(e.target.checked)}
                                                className="w-4 h-4"
                                            />
                                        </div>
                                        {!bgTransparent && (
                                            <>
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-xs text-gray-400">Use Gradient</Label>
                                                    <input
                                                        type="checkbox"
                                                        checked={bgGradient}
                                                        onChange={(e) => setBgGradient(e.target.checked)}
                                                        className="w-4 h-4"
                                                    />
                                                </div>
                                                {bgGradient ? (
                                                    <>
                                                        <Select value={bgGradientType} onValueChange={(v) => setBgGradientType(v as GradientType)}>
                                                            <SelectTrigger className="text-xs">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="linear">Linear Gradient</SelectItem>
                                                                <SelectItem value="radial">Radial Gradient</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div>
                                                                <Label className="text-xs text-gray-500 mb-1 block">Color 1</Label>
                                                                <input
                                                                    type="color"
                                                                    value={bgGradientColor1}
                                                                    onChange={(e) => setBgGradientColor1(e.target.value)}
                                                                    className="w-full h-10 rounded border border-gray-700 cursor-pointer"
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label className="text-xs text-gray-500 mb-1 block">Color 2</Label>
                                                                <input
                                                                    type="color"
                                                                    value={bgGradientColor2}
                                                                    onChange={(e) => setBgGradientColor2(e.target.value)}
                                                                    className="w-full h-10 rounded border border-gray-700 cursor-pointer"
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div>
                                                        <Label className="text-xs text-gray-400 mb-2 block">Background Color</Label>
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="color"
                                                                value={bgColor}
                                                                onChange={(e) => setBgColor(e.target.value)}
                                                                className="w-12 h-10 rounded border border-gray-700 cursor-pointer"
                                                            />
                                                            <Input
                                                                value={bgColor}
                                                                onChange={(e) => setBgColor(e.target.value)}
                                                                className="flex-1 bg-gray-900 border-gray-700 text-white text-xs"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Advanced Options */}
                                <AccordionItem value="advanced" className="border-gray-800">
                                    <AccordionTrigger className="text-sm font-semibold text-gray-300 hover:text-white px-4">
                                        Advanced Options
                                    </AccordionTrigger>
                                    <AccordionContent className="px-4">
                                        <div>
                                            <Label className="text-xs text-gray-400 mb-2 block">
                                                Error Correction Level
                                            </Label>
                                            <Select
                                                value={errorLevel}
                                                onValueChange={(value: ErrorCorrectionLevel) => setErrorLevel(value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="L">Low (7%)</SelectItem>
                                                    <SelectItem value="M">Medium (15%)</SelectItem>
                                                    <SelectItem value="Q">Quartile (25%)</SelectItem>
                                                    <SelectItem value="H">High (30%)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <p className="text-xs text-gray-500 mt-1.5">
                                                Higher levels allow more damage but increase QR size
                                            </p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </ScrollArea>

                    {/* Right Panel - Preview & Download (35% width) */}
                    <div className="w-[35%] flex flex-col items-center justify-center p-8">
                        {error && (
                            <div className="mb-6 bg-red-900/20 border border-red-900 text-red-200 p-3 rounded-md text-sm flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )
                        }

                        {/* QR Code Preview */}
                        <div className="mb-8">
                            <div className="relative">
                                {overlayText && (
                                    <div
                                        className="text-center mb-2 px-4"
                                        style={{
                                            fontFamily: textFont,
                                            fontSize: `${textSize[0]}px`,
                                            color: textColor,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {overlayText}
                                    </div>
                                )}
                                <div
                                    ref={qrRef}
                                    className="flex items-center justify-center p-4 bg-gray-900 rounded-xl"
                                    style={{
                                        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
                                    }}
                                />
                            </div>
                            <p className="text-gray-500 text-sm mt-4 text-center">
                                Scan to {qrType === "url" ? "visit website" : qrType === "upi" ? "make payment" : `open ${qrType}`}
                            </p>
                        </div>

                        {/* Download Options */}
                        <div className="space-y-3 w-full max-w-md">
                            <Label className="text-sm font-semibold text-gray-300 block text-center">
                                Download Format
                            </Label>
                            <div className="grid grid-cols-5 gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => handleDownload("png")}
                                    className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                                >
                                    <Download className="w-4 h-4 mr-1" />
                                    PNG
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleDownload("jpeg")}
                                    className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                                >
                                    <Download className="w-4 h-4 mr-1" />
                                    JPEG
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleDownload("svg")}
                                    className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                                >
                                    <Download className="w-4 h-4 mr-1" />
                                    SVG
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleDownload("webp")}
                                    className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                                >
                                    <Download className="w-4 h-4 mr-1" />
                                    WEBP
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleDownload("eps")}
                                    className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                                >
                                    <Download className="w-4 h-4 mr-1" />
                                    EPS
                                </Button>
                            </div>
                        </div>
                    </div >
                </div >
            </DialogContent >
        </Dialog >
    )
}
