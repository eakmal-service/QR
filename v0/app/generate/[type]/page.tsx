"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import QRCodeStyling, {
    Options as QRCodeOptions,
    DrawType,
    TypeNumber,
    Mode,
    ErrorCorrectionLevel,
    DotType,
    CornerSquareType,
    CornerDotType
} from "qr-code-styling"
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
    ArrowLeft,
    Star,
    Monitor,
    ChevronRight,
    Loader2,
    Palette,
    Frame,
    Grid3X3,
    Eye,
    Image as ImageIcon,
    Check,
    LayoutTemplate,
    Shield,
    ShieldCheck,
    Layers,
    Minimize,
    Maximize,
    Scaling
} from "lucide-react"
import html2canvas from "html2canvas"
import { saveAs } from "file-saver"
import { jsPDF } from "jspdf"
import { FRAMES, getFrameComponent } from "@/components/qr-frames"
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
import { useRouter } from "next/navigation"
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
import Link from "next/link"
import { AIGeneratorButton } from "@/components/ai-generator-button"
import { CustomQRRenderer } from "@/components/custom-qr-renderer"
import { CUSTOM_PATTERNS, QRPattern, CORNER_SQUARE_PATHS, CORNER_DOT_PATHS } from "@/lib/qr-patterns"

type QRType = "url" | "upi" | "vcard" | "email" | "wifi" | "location" | "phone" | "sms" | "text" | "whatsapp" | "pdf"
type GradientType = "linear" | "radial"
type GradientRotation = number

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
    ...CUSTOM_PATTERNS.map(p => ({ value: p.id, label: p.label })),
]

const CORNER_SQUARE_PATTERNS = [
    { value: "square", label: "Square" },
    ...CORNER_SQUARE_PATHS.map(p => ({ value: p.id, label: p.label })),
]

const CORNER_DOT_PATTERNS = [
    { value: "square", label: "Square" },
    ...CORNER_DOT_PATHS.map(p => ({ value: p.id, label: p.label })),
]

// 4x4 Matrix for Preview (Mock QR)
const PREVIEW_MATRIX = [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 1, 0],
    [1, 1, 0, 1]
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

const CUSTOMIZE_TABS = [
    { id: "templates", label: "Templates", icon: LayoutTemplate },
    { id: "themes", label: "Themes", icon: Palette },
    { id: "frames", label: "Frames", icon: Frame },
    { id: "colors", label: "Colors", icon: Palette },
    { id: "shapes", label: "Shapes", icon: Grid3X3 },
    { id: "eyes", label: "Eyes", icon: Eye },
    { id: "logo", label: "Logo", icon: ImageIcon },
]

const PRESET_TEMPLATES = [
    { id: "classic", label: "Classic", color: "#000000", bg: "#ffffff", dots: "square" },
    { id: "modern", label: "Modern", color: "#2563eb", bg: "#ffffff", dots: "dots" },
    { id: "warm", label: "Warm", color: "#e11d48", bg: "#fff1f2", dots: "rounded" },
    { id: "eco", label: "Eco", color: "#059669", bg: "#ecfdf5", dots: "classy" },
    { id: "dark", label: "Dark", color: "#ffffff", bg: "#000000", dots: "square" },
    { id: "luxury", label: "Luxury", color: "#d97706", bg: "#fffbeb", dots: "extra-rounded" },
]

const ERROR_LEVELS = [
    { value: "H", label: "Best", desc: "Max damage-resistant", icon: ShieldCheck },
    { value: "Q", label: "High", desc: "Optimal damage-resistant", icon: Shield },
    { value: "M", label: "Medium", desc: "Balanced pattern", icon: Layers },
    { value: "L", label: "Smallest", desc: "Less cluttered pattern", icon: Minimize },
]

export default function QRGeneratorPage({ params }: { params: { type: string } }) {
    const router = useRouter()
    const [qrType, setQRType] = useState<QRType>((params.type as QRType) || "url")
    const [step, setStep] = useState<"content" | "customize">("content")

    // Customize Tabs State
    const [activeTab, setActiveTab] = useState("templates")
    const [selectedFrame, setSelectedFrame] = useState("none")
    const [frameColor, setFrameColor] = useState("#000000")
    const [frameText, setFrameText] = useState("SCAN ME")
    const [selectedFrameCategory, setSelectedFrameCategory] = useState("All")
    const [isDownloading, setIsDownloading] = useState(false)

    // Check if type changed via URL
    useEffect(() => {
        if (params.type && QR_TYPES.some(t => t.value === params.type)) {
            setQRType(params.type as QRType)
        }
    }, [params.type])

    // Update URL when type changes in UI
    const handleTypeChange = (newType: QRType) => {
        setQRType(newType)
        router.push(`/generate/${newType}`)
    }

    const [errorLevel, setErrorLevel] = useState<ErrorCorrectionLevel>("H")
    const [selectedErrorLevel, setSelectedErrorLevel] = useState<ErrorCorrectionLevel | null>(null)

    // Text Overlay States
    const [overlayText, setOverlayText] = useState("")
    const [textFont, setTextFont] = useState("Arial")
    const [textSize, setTextSize] = useState([20])
    const [textColor, setTextColor] = useState("#000000")

    // URL State
    const [protocol, setProtocol] = useState("https://")
    const [url, setUrl] = useState("")

    // UPI State
    const [upiId, setUpiId] = useState("")
    const [upiName, setUpiName] = useState("")
    const [upiAmount, setUpiAmount] = useState("")

    // vCard State
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

    // Email State
    const [emailData, setEmailData] = useState<EmailParams>({ email: "", subject: "", body: "" })

    // WiFi State
    const [wifi, setWifi] = useState<WiFiParams>({ ssid: "", password: "", encryption: "WPA" })

    // Location State
    const [location, setLocation] = useState<{ latitude: string; longitude: string; searchType: "maps" | "address"; query: string; address: string }>({
        latitude: "",
        longitude: "",
        searchType: "maps",
        query: "",
        address: ""
    })

    // Phone / SMS / Text / WhatsApp / PDF States
    const [phoneNumber, setPhoneNumber] = useState("")
    const [sms, setSms] = useState<SMSParams>({ phone: "", message: "" })
    const [text, setText] = useState("")
    const [whatsapp, setWhatsapp] = useState({ phone: "", message: "" })
    const [pdfFile, setPdfFile] = useState<string | null>(null)

    // Styling States
    const [dotsType, setDotsType] = useState<DotType | string>("square")
    // Keep dotOptions for backward compatibility if needed, or replace usages. 
    // We will replace usage of `dotOptions` with `dotsType` in the new UI.
    const [dotOptions, setDotOptions] = useState<DotType>("square")
    const [dotColor, setDotColor] = useState("#000000")
    const [dotsGradientType, setDotsGradientType] = useState<"none" | GradientType>("none")
    const [dotsGradientColor1, setDotsGradientColor1] = useState("#000000")
    const [dotsGradientColor2, setDotsGradientColor2] = useState("#000000")
    const [dotsGradientRotation, setDotsGradientRotation] = useState<number>(0)

    const [cornerSquareType, setCornerSquareType] = useState<CornerSquareType>("square")
    const [cornerSquareColor, setCornerSquareColor] = useState("#000000")
    const [cornerDotType, setCornerDotType] = useState<CornerDotType>("square")
    const [cornerDotColor, setCornerDotColor] = useState("#000000")
    const [bgColor, setBgColor] = useState("#ffffff")
    const [bgTransparent, setBgTransparent] = useState(true)
    const [bgGradient, setBgGradient] = useState(false)
    const [bgGradientType, setBgGradientType] = useState<GradientType>("linear")
    const [bgGradientColor1, setBgGradientColor1] = useState("#ffffff")
    const [bgGradientColor2, setBgGradientColor2] = useState("#f0f0f0")

    // Logo States
    const [logoFile, setLogoFile] = useState<string | null>(null)
    const [logoSize, setLogoSize] = useState([20])
    const [logoMargin, setLogoMargin] = useState([0])
    const [logoTransparency, setLogoTransparency] = useState([0])
    const [logoBackground, setLogoBackground] = useState(false)
    const [logoBackgroundColor, setLogoBackgroundColor] = useState("#ffffff")
    const [logoBorder, setLogoBorder] = useState(false)

    // Download States
    const [downloadFormat, setDownloadFormat] = useState<"png" | "jpeg" | "svg" | "pdf" | "eps">("png")
    const [downloadSize, setDownloadSize] = useState("1000")

    // Refs and Error
    const qrCodeRef = useRef<QRCodeStyling | null>(null)
    const qrRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [error, setError] = useState<string | null>(null)

    // --- Effects & Logic ---

    // Dynamic Error Correction
    useEffect(() => {
        if (selectedErrorLevel) {
            setErrorLevel(selectedErrorLevel)
            return
        }
        let newLevel: ErrorCorrectionLevel = "M"
        if (logoFile) {
            if (logoSize[0] > 30) newLevel = "H"
            else if (logoSize[0] > 20) newLevel = "Q"
        }
        if (qrType === "vcard" || qrType === "wifi") newLevel = "Q"
        setErrorLevel(newLevel)
    }, [qrType, logoFile, logoSize, selectedErrorLevel])

    // Generate Data based on Type
    const qrData = useMemo(() => {
        try {
            switch (qrType) {
                case "url":
                    return protocol + url
                case "upi":
                    return generateUPIString({ pa: upiId, pn: upiName, am: upiAmount })
                case "vcard":
                    return generateVCard(vcard)
                case "email":
                    return generateEmail(emailData)
                case "wifi":
                    return generateWiFi(wifi)
                case "location":
                    if (location.searchType === "maps") {
                        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.query)}`
                    } else {
                        return generateLocation({ latitude: parseFloat(location.latitude), longitude: parseFloat(location.longitude) })
                    }
                case "phone":
                    return generatePhone(phoneNumber)
                case "sms":
                    return generateSMS(sms)
                case "text":
                    return text
                case "whatsapp":
                    return `https://wa.me/${whatsapp.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(whatsapp.message)}`
                case "pdf":
                    if (pdfFile) return pdfFile
                    break
            }
        } catch (err) {
            console.error("Error generating QR data", err)
        }
        return "https://me-qr.com" // Default placeholder
    }, [qrType, protocol, url, upiId, upiName, upiAmount, vcard, emailData, wifi, location, phoneNumber, sms, text, whatsapp, pdfFile])

    useEffect(() => {
        const qrOptions: QRCodeOptions = {
            width: 300,
            height: 300,
            image: logoFile || undefined,

            dotsOptions: {
                type: (CUSTOM_PATTERNS.some(p => p.id === dotsType) ? "square" : dotsType) as DotType,
                ...(dotsGradientType !== "none" ? {
                    gradient: {
                        type: dotsGradientType,
                        rotation: dotsGradientRotation * (Math.PI / 180),
                        colorStops: [
                            { offset: 0, color: dotsGradientColor1 },
                            { offset: 1, color: dotsGradientColor2 }
                        ]
                    }
                } : {
                    color: dotColor
                })
            },
            cornersSquareOptions: {
                color: cornerSquareColor,
                type: cornerSquareType,
            },
            cornersDotOptions: {
                color: cornerDotColor,
                type: cornerDotType,
            },
            backgroundOptions: {
                color: bgTransparent ? "transparent" : (bgGradient ? "transparent" : bgColor),
            },
            imageOptions: {
                crossOrigin: "anonymous",
                margin: logoMargin[0],
                imageSize: logoSize[0] / 100,
                hideBackgroundDots: logoBackground,
            },
            qrOptions: {
                errorCorrectionLevel: errorLevel,
            },
        }

        qrOptions.data = qrData

        if (!qrCodeRef.current) {
            qrCodeRef.current = new QRCodeStyling(qrOptions)
        } else {
            qrCodeRef.current.update(qrOptions)
        }

        if (qrRef.current) {
            qrRef.current.innerHTML = ""
            qrCodeRef.current.append(qrRef.current)
        }

    }, [
        qrType, qrData, // Depend on qrData instead of all individual fields
        dotColor, dotsType, dotOptions, cornerSquareColor, cornerSquareType, cornerDotColor, cornerDotType,
        dotsGradientType, dotsGradientColor1, dotsGradientColor2, dotsGradientRotation,
        bgColor, bgTransparent, bgGradient, bgGradientColor1, bgGradientColor2,
        logoFile, logoSize, logoMargin, logoTransparency, logoBackground, logoBackgroundColor, logoBorder,
        errorLevel, selectedFrame, frameColor, frameText
    ])

    const handleDownload = async () => {
        // if (!qrRef.current) return; // Removed this check as it blocks download when CustomQRRenderer is active

        setIsDownloading(true);
        try {
            const size = parseInt(downloadSize);
            const format = downloadFormat;

            // If no frame and using native library features (except PDF which needs special handling)
            const isCustomPattern = CUSTOM_PATTERNS.some(p => p.id === dotsType);
            const isCustomCorner = CORNER_SQUARE_PATHS.some(p => p.id === cornerSquareType);
            const isCustomDot = CORNER_DOT_PATHS.some(p => p.id === cornerDotType);
            const hasFrame = selectedFrame !== "none";

            // 1. PDF Download
            if (format === "pdf") {
                // For PDF, we generally capture as image then put in PDF
                const element = document.getElementById("qr-preview-container");
                if (element) {
                    const canvas = await html2canvas(element, {
                        backgroundColor: null,
                        scale: size / 300, // Approximate scale
                        logging: false,
                        useCORS: true
                    });

                    const imgData = canvas.toDataURL("image/png");
                    const pdf = new jsPDF({
                        orientation: "portrait",
                        unit: "px",
                        format: [size, size]
                    });

                    pdf.addImage(imgData, "PNG", 0, 0, size, size);
                    pdf.save(`qr-${qrType}.${format}`);
                }
                return;
            }

            // 2. SVG Download (Native only if no frame/custom patterns that break it, otherwise unsupported/fallback)
            if (format === "svg" && !hasFrame) {
                if (qrCodeRef.current) {
                    // The library supports SVG export natively
                    await qrCodeRef.current.download({ name: `qr-${qrType}`, extension: "svg" });
                }
                return;
            } else if (format === "svg" && hasFrame) {
                alert("SVG export is not supported with Frames. Downloading as PNG.");
                // Fallthrough to PNG
            }


            // 4. EPS Download (Raster via Backend)
            if (format === "eps") {
                const element = document.getElementById("qr-preview-container");
                if (element) {
                    // Scale up for high quality EPS
                    const currentWidth = element.offsetWidth;
                    // Target size for EPS should be high res
                    const targetSize = size < 1000 ? 1000 : size;
                    const scaleFactor = targetSize / currentWidth;

                    const canvas = await html2canvas(element, {
                        backgroundColor: null,
                        scale: scaleFactor,
                        logging: false,
                        useCORS: true
                    });

                    const imgData = canvas.toDataURL("image/png");

                    // Send to backend via proxy (handled by next.config.js rewrite)
                    const response = await fetch("/api/convert/image-to-eps", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ image: imgData })
                    });

                    if (!response.ok) throw new Error("EPS conversion failed");

                    const blob = await response.blob();
                    saveAs(blob, `qr-${qrType}.eps`);
                }
                return;
            }

            // 5. Image Download (PNG/JPEG via html2canvas fallback or native)
            // If using standard styles (no frame, no custom patterns, no logo which forces custom renderer), use native lib
            if (!hasFrame && !isCustomPattern && !isCustomCorner && !isCustomDot && !logoFile) {
                // Use library native download for pure QR
                if (qrCodeRef.current) {
                    // Update size temporarily
                    qrCodeRef.current.update({ width: size, height: size, imageOptions: { ...qrCodeRef.current._options.imageOptions, imageSize: logoSize[0] / 100, margin: logoMargin[0] } });
                    await qrCodeRef.current.download({ name: `qr-${qrType}`, extension: format as "png" | "jpeg" });
                    // Revert size
                    qrCodeRef.current.update({ width: 300, height: 300 });
                }
            } else {
                // Use html2canvas for Frames or Custom Renders
                const element = document.getElementById("qr-preview-container");
                if (element) {
                    // Current display is 300px approx. We need to scale.
                    // Note: html2canvas scale allows high res capture.
                    // Scale = Desired / Rendered (approx 300 or element.offsetWidth)
                    const currentWidth = element.offsetWidth;
                    const scaleFactor = size / currentWidth;

                    const canvas = await html2canvas(element, {
                        backgroundColor: null,
                        scale: scaleFactor,
                        logging: false,
                        useCORS: true
                    });

                    canvas.toBlob((blob) => {
                        if (blob) {
                            saveAs(blob, `qr-${qrType}-framed.${format === "jpeg" ? "jpg" : "png"}`);
                        }
                    }, format === "jpeg" ? "image/jpeg" : "image/png");
                }
            }
        } catch (err) {
            console.error("Download failed", err);
            alert(`Download failed: ${err instanceof Error ? err.message : "Unknown error"}`);
        } finally {
            setIsDownloading(false);
        }
    }

    const applyTemplate = (t: any) => {
        setDotColor(t.color)
        setCornerSquareColor(t.color)
        setCornerDotColor(t.color)
        setBgColor(t.bg)
        setDotsType(t.dots as DotType | string)
        setBgTransparent(false)
    }

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                setError("Logo size too large. Max 2MB.")
                return
            }
            const reader = new FileReader()
            reader.onload = () => {
                setLogoFile(reader.result as string)
                setError(null)
            }
            reader.readAsDataURL(file)
        }
    }

    // --- Styling Helpers ---
    // --- Styling Helpers ---
    const inputBg = step === "content" ? "bg-zinc-900" : "bg-gray-900"
    const inputBorder = step === "content" ? "border-zinc-800 focus:border-white" : "border-gray-700 focus:border-gray-500"
    const inputText = step === "content" ? "text-white" : "text-white"
    const labelText = step === "content" ? "text-gray-300 font-medium" : "text-gray-300"
    const placeholderText = step === "content" ? "placeholder:text-gray-500" : "placeholder:text-gray-600"

    const inputClasses = `mt-1.5 w-full px-3 py-2 rounded-md outline-none border transition-all ${inputBg} ${inputBorder} ${inputText} ${placeholderText}`
    const labelClasses = `block text-sm mb-1 ${labelText}`
    const infoBoxClasses = step === "content" ? "bg-zinc-900 border-zinc-800" : "bg-zinc-900 border-zinc-700"
    const infoTextClasses = step === "content" ? "text-gray-400" : "text-gray-400"

    const renderContentFields = () => {
        switch (qrType) {
            case "url":
                return (
                    <div className="space-y-3">.
                        <Label className={labelClasses}>Website URL</Label>
                        <div className={`relative flex items-center rounded-lg border transition-all ${inputBg} ${inputBorder} focus-within:ring-1 focus-within:ring-black`}>
                            <select
                                className={`text-sm outline-none rounded-l-lg h-10 px-3 cursor-pointer border-r ${step === "content" ? "bg-gray-50 text-gray-900 border-gray-200 hover:bg-gray-100" : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"}`}
                                value={protocol}
                                onChange={(e) => setProtocol(e.target.value)}
                            >
                                <option value="https://">https://</option>
                                <option value="http://">http://</option>
                            </select>
                            <input
                                className={`flex-1 px-3 py-2 bg-transparent outline-none ${inputText} ${placeholderText}`}
                                placeholder="example.com"
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                        </div>
                    </div>
                )
            // ... [Duplicate other cases from modal here, keeping dynamic classes]
            case "upi":
                return (
                    <div className="space-y-3">
                        <div>
                            <Label className={labelClasses}>
                                UPI ID <span className="text-red-500">*</span>
                            </Label>
                            <Input placeholder="username@bank" value={upiId} onChange={(e) => setUpiId(e.target.value)} className={inputClasses} />
                        </div>
                        <div>
                            <Label className={labelClasses}>Payee Name</Label>
                            <Input placeholder="John Doe" value={upiName} onChange={(e) => setUpiName(e.target.value)} className={inputClasses} />
                        </div>
                        <div>
                            <Label className={labelClasses}>Amount (₹)</Label>
                            <Input type="number" placeholder="0" value={upiAmount} onChange={(e) => setUpiAmount(e.target.value)} className={inputClasses} />
                        </div>
                    </div>
                )
            case "vcard":
                return (
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div><Label className={labelClasses}>First Name *</Label><Input placeholder="John" value={vcard.firstName} onChange={(e) => setVcard({ ...vcard, firstName: e.target.value })} className={inputClasses} /></div>
                            <div><Label className={labelClasses}>Last Name</Label><Input placeholder="Doe" value={vcard.lastName} onChange={(e) => setVcard({ ...vcard, lastName: e.target.value })} className={inputClasses} /></div>
                        </div>
                        <div><Label className={labelClasses}>Email</Label><Input type="email" value={vcard.email} onChange={(e) => setVcard({ ...vcard, email: e.target.value })} className={inputClasses} /></div>
                        <div><Label className={labelClasses}>Phone</Label><Input value={vcard.phone} onChange={(e) => setVcard({ ...vcard, phone: e.target.value })} className={inputClasses} /></div>
                    </div>
                )
            case "email":
                return (
                    <div className="space-y-3">
                        <div><Label className={labelClasses}>Email Address *</Label><Input type="email" value={emailData.email} onChange={(e) => setEmailData({ ...emailData, email: e.target.value })} className={inputClasses} /></div>
                        <div><Label className={labelClasses}>Subject</Label><Input value={emailData.subject} onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })} className={inputClasses} /></div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <Label className={labelClasses}>Body</Label>
                                <AIGeneratorButton
                                    context="email body"
                                    onContentGenerated={(content) => setEmailData({ ...emailData, body: content })}
                                />
                            </div>
                            <textarea
                                value={emailData.body}
                                onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                                rows={4}
                                className={inputClasses + " min-h-[100px]"}
                            />
                        </div>
                    </div>
                )
            case "wifi":
                return (
                    <div className="space-y-3">
                        <div><Label className={labelClasses}>Network Name (SSID) *</Label><Input value={wifi.ssid} onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })} className={inputClasses} /></div>
                        <div><Label className={labelClasses}>Password</Label><Input type="password" value={wifi.password} onChange={(e) => setWifi({ ...wifi, password: e.target.value })} className={inputClasses} /></div>
                    </div>
                )
            case "text":
                return (
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <Label className={labelClasses}>Text Content *</Label>
                                <AIGeneratorButton
                                    context="text message"
                                    onContentGenerated={(content) => setText(content)}
                                />
                            </div>
                            <textarea placeholder="Enter any text..." value={text} onChange={(e) => setText(e.target.value)} rows={4} className={inputClasses + " min-h-[100px]"} />
                        </div>
                    </div>
                )
            case "whatsapp":
                return (
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <div><Label className={labelClasses}>Phone Number *</Label><Input placeholder="+1234567890" value={whatsapp.phone} onChange={(e) => setWhatsapp({ ...whatsapp, phone: e.target.value })} className={inputClasses} /><p className="text-xs text-gray-500 mt-1">Include country code without +</p></div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <Label className={labelClasses}>Message</Label>
                                    <AIGeneratorButton
                                        context="whatsapp message"
                                        onContentGenerated={(content) => setWhatsapp({ ...whatsapp, message: content })}
                                    />
                                </div>
                                <textarea placeholder="Hi..." value={whatsapp.message} onChange={(e) => setWhatsapp({ ...whatsapp, message: e.target.value })} rows={3} className={inputClasses + " min-h-[80px]"} />
                            </div>
                        </div>
                    </div>
                )
            case "pdf":
                return (
                    <div className="space-y-3">
                        <div className={`p-3 border rounded-md ${infoBoxClasses}`}><p className={`text-xs ${infoTextClasses}`}>ℹ️ Use cloud storage link for PDF.</p></div>
                        <div><Label className={labelClasses}>PDF URL *</Label><Input placeholder="https://..." value={pdfFile || ""} onChange={(e) => setPdfFile(e.target.value)} className={inputClasses} /></div>
                    </div>
                )
            // Add other cases as needed (phone, sms, location) - simplistic versions for brevity in this initial write
            default:
                return <div className={step === "content" ? "text-gray-500" : "text-gray-400"}>Coming soon...</div>
        }
    }


    const renderCustomizeStep = () => {
        const FrameComponent = getFrameComponent(selectedFrame)
        const frameData = FRAMES.find(f => f.id === selectedFrame)
        const isFluidFrame = frameData?.id.startsWith('frame') || frameData?.category === 'Mr. QR' || false

        return (
            <div className="flex flex-col lg:flex-row gap-8 max-w-[1200px] mx-auto px-4 py-8">

                {/* Left Column - Scrollable Settings */}
                <div className="flex-1 space-y-8">

                    {/* Header & Back */}
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="ghost" className="text-white hover:text-gray-300 hover:bg-zinc-900 -ml-2" onClick={() => setStep("content")}>
                            <ArrowLeft className="w-5 h-5 mr-2" /> Back
                        </Button>
                        <h1 className="text-2xl font-bold text-white">Customize your QR code</h1>
                    </div>

                    {/* Pre-Made Templates */}
                    <section className="bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-800">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg text-white">Pre-Made Templates</h3>
                            <Button variant="link" className="text-white font-medium">View All</Button>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {PRESET_TEMPLATES.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => applyTemplate(t)}
                                    className="flex flex-col items-center gap-2 group min-w-[80px]"
                                >
                                    <div className="w-16 h-16 rounded-xl border border-zinc-700 group-hover:border-white group-hover:ring-2 group-hover:ring-zinc-600 transition-all flex items-center justify-center bg-zinc-800">
                                        <div className="w-8 h-8 rounded" style={{ backgroundColor: t.color }}></div>
                                    </div>
                                    <span className="text-xs font-medium text-white group-hover:text-gray-200">{t.label}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Frames */}
                    <section className="bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-800">
                        <h3 className="font-semibold text-lg text-white mb-6">Frames</h3>

                        <div className="flex gap-4 mb-6 overflow-x-auto border-b border-zinc-800">
                            {['All', 'Basic'].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedFrameCategory(cat)}
                                    className={`text-sm font-medium pb-2 px-2 whitespace-nowrap transition-colors ${selectedFrameCategory === cat
                                        ? 'text-white border-b-2 border-white'
                                        : 'text-zinc-400 hover:text-zinc-200'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-4 md:grid-cols-6 gap-4 mb-6 max-h-96 overflow-y-auto pr-2">
                            {FRAMES.filter(f => selectedFrameCategory === 'All' || f.category === selectedFrameCategory).map(frame => (
                                <button
                                    key={frame.id}
                                    onClick={() => setSelectedFrame(frame.id)}
                                    className={`aspect-square rounded-xl border-2 flex items-center justify-center transition-all p-2 ${selectedFrame === frame.id ? 'border-white bg-zinc-800' : 'border-zinc-800 hover:border-zinc-600 bg-zinc-900'}`}
                                >
                                    <div className="w-full h-full border-2 border-dashed border-zinc-700 rounded flex items-center justify-center">
                                        <span className="text-[10px] text-white font-medium">{frame.label}</span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {selectedFrame !== 'none' && (
                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-white">Frame Text</Label>
                                        <Input
                                            value={frameText}
                                            onChange={(e) => setFrameText(e.target.value)}
                                            className="bg-zinc-950 border-zinc-800 text-white focus:ring-white focus:border-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-white">Frame Color</Label>
                                        <div className="flex gap-2">
                                            <div className="relative w-10 h-10 overflow-hidden rounded-lg border border-zinc-800 shadow-sm cursor-pointer">
                                                <input type="color" value={frameColor} onChange={(e) => setFrameColor(e.target.value)} className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer p-0 border-0" />
                                            </div>
                                            <Input value={frameColor} onChange={(e) => setFrameColor(e.target.value)} className="flex-1 bg-zinc-950 border-zinc-800 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Body Patterns */}
                    <section className="bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-800">
                        <h3 className="font-semibold text-lg text-white mb-4">Body Patterns</h3>
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                            {DOTS_PATTERNS.map((pattern) => (
                                <button
                                    key={pattern.value}
                                    onClick={() => setDotsType(pattern.value as DotType | string)}
                                    className={`aspect-square rounded-xl border-2 flex items-center justify-center transition-all p-2 ${dotsType === pattern.value ? "border-black bg-white ring-2 ring-white" : "border-zinc-700 hover:border-zinc-500 bg-white"}`}
                                    title={pattern.label}
                                >
                                    <div className="w-10 h-10 flex items-center justify-center">
                                        <svg viewBox="0 0 500 500" className="w-full h-full text-black">
                                            {PREVIEW_MATRIX.map((row, r) => (
                                                row.map((active, c) => (
                                                    active ? (
                                                        <g key={`${r}-${c}`} transform={`translate(${c * 100}, ${r * 100})`}>
                                                            <path d={CUSTOM_PATTERNS.find(cp => cp.id === pattern.value)?.path || "M0 0h100v100H0z"} fill="currentColor" />
                                                        </g>
                                                    ) : null
                                                ))
                                            ))}
                                        </svg>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Eye Patterns (Split) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <section className="bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-800">
                            <h3 className="font-semibold text-lg text-white mb-4">External Eye Patterns</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {CORNER_SQUARE_PATTERNS.map(p => (
                                    <button
                                        key={p.value}
                                        onClick={() => setCornerSquareType(p.value as CornerSquareType)}
                                        className={`aspect-square rounded-xl border-2 flex items-center justify-center transition-all ${cornerSquareType === p.value ? 'border-black bg-white ring-2 ring-white' : 'border-zinc-700 hover:border-zinc-500 bg-white'}`}
                                        title={p.label}
                                    >
                                        <div className={`w-8 h-8 flex items-center justify-center`}>
                                            {/* Preview for corner patterns */}
                                            {CORNER_SQUARE_PATHS.find(cp => cp.id === p.value) ? (
                                                <svg viewBox={CORNER_SQUARE_PATHS.find(cp => cp.id === p.value)!.viewBox} width="24" height="24">
                                                    {CORNER_SQUARE_PATHS.find(cp => cp.id === p.value)!.isStroke ? (
                                                        <path
                                                            d={CORNER_SQUARE_PATHS.find(cp => cp.id === p.value)!.path}
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth={CORNER_SQUARE_PATHS.find(cp => cp.id === p.value)!.strokeWidth || 5}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="text-black"
                                                        />
                                                    ) : (
                                                        <path d={CORNER_SQUARE_PATHS.find(cp => cp.id === p.value)!.path} fill="currentColor" className="text-black" />
                                                    )}
                                                </svg>
                                            ) : (
                                                <div className={`w-8 h-8 border-4 border-black ${p.value === 'dot' ? 'rounded-full' : (p.value === 'extra-rounded' ? 'rounded-lg' : '')}`}></div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section className="bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-800">
                            <h3 className="font-semibold text-lg text-white mb-4">Internal Eye Patterns</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {CORNER_DOT_PATTERNS.map(p => {
                                    const dotPattern = CORNER_DOT_PATHS.find(cp => cp.id === p.value);
                                    const path = dotPattern?.path;
                                    const viewBox = dotPattern?.viewBox || "0 0 33 33";
                                    const isStroke = dotPattern?.isStroke;

                                    return (
                                        <button
                                            key={p.value}
                                            onClick={() => setCornerDotType(p.value as CornerDotType)}
                                            className={`aspect-square rounded-xl border-2 flex items-center justify-center transition-all ${cornerDotType === p.value ? 'border-black bg-white ring-2 ring-white' : 'border-zinc-700 hover:border-zinc-500 bg-white'}`}
                                            title={p.label}
                                        >
                                            <div className="w-8 h-8 flex items-center justify-center">
                                                {path ? (
                                                    <svg viewBox={viewBox} className="w-full h-full relative" fill="none">
                                                        <rect x="3" y="3" width="27" height="27" stroke="black" strokeWidth="4.5" rx="3" />
                                                        <path
                                                            d={path}
                                                            fill={isStroke ? 'none' : 'currentColor'}
                                                            stroke={isStroke ? 'currentColor' : 'none'}
                                                            strokeWidth={isStroke ? (dotPattern?.strokeWidth || 1.5) : "0"}
                                                            className="text-black"
                                                        />
                                                    </svg>
                                                ) : (
                                                    <div className={`w-4 h-4 bg-black ${p.value === 'dot' ? 'rounded-full' : ''}`}></div>
                                                )}
                                            </div>
                                        </button>
                                    )

                                })}
                            </div>
                        </section>
                    </div>

                    {/* Colors & Background */}
                    <section className="bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-800">
                        <h3 className="font-semibold text-lg text-white mb-4">Colors</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <Label className="text-sm font-medium text-white">QR Code Color</Label>

                                {/* Color Mode Selection */}
                                <div className="flex bg-zinc-800 p-1 rounded-lg border border-zinc-700">
                                    <button
                                        onClick={() => setDotsGradientType("none")}
                                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${dotsGradientType === "none" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-200"}`}
                                    >
                                        Solid
                                    </button>
                                    <button
                                        onClick={() => setDotsGradientType("linear")}
                                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${dotsGradientType !== "none" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-200"}`}
                                    >
                                        Gradient
                                    </button>
                                </div>

                                {dotsGradientType === "none" ? (
                                    <div className="flex gap-3">
                                        <div className="relative w-12 h-12 overflow-hidden rounded-xl border border-zinc-200 shadow-sm cursor-pointer">
                                            <input type="color" value={dotColor} onChange={(e) => { setDotColor(e.target.value); setCornerSquareColor(e.target.value); setCornerDotColor(e.target.value); }} className="absolute -top-4 -left-4 w-20 h-20 cursor-pointer p-0 border-0" />
                                        </div>
                                        <Input value={dotColor} onChange={(e) => { setDotColor(e.target.value); setCornerSquareColor(e.target.value); setCornerDotColor(e.target.value); }} className="h-12 bg-white border-zinc-200 text-black" />
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex gap-2">
                                            <Select value={dotsGradientType} onValueChange={(v: any) => setDotsGradientType(v)}>
                                                <SelectTrigger className="bg-white border-zinc-200 text-black h-9 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="linear">Linear</SelectItem>
                                                    <SelectItem value="radial">Radial</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex gap-3">
                                            <div className="flex-1 space-y-1">
                                                <Label className="text-xs text-white">Start Color</Label>
                                                <div className="flex gap-2">
                                                    <div className="relative w-8 h-8 overflow-hidden rounded-lg border border-zinc-200 shadow-sm cursor-pointer shrink-0">
                                                        <input type="color" value={dotsGradientColor1} onChange={(e) => setDotsGradientColor1(e.target.value)} className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer p-0 border-0" />
                                                    </div>
                                                    <Input value={dotsGradientColor1} onChange={(e) => setDotsGradientColor1(e.target.value)} className="h-8 text-xs bg-white border-zinc-200 text-black px-2" />
                                                </div>
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <Label className="text-xs text-white">End Color</Label>
                                                <div className="flex gap-2">
                                                    <div className="relative w-8 h-8 overflow-hidden rounded-lg border border-zinc-200 shadow-sm cursor-pointer shrink-0">
                                                        <input type="color" value={dotsGradientColor2} onChange={(e) => setDotsGradientColor2(e.target.value)} className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer p-0 border-0" />
                                                    </div>
                                                    <Input value={dotsGradientColor2} onChange={(e) => setDotsGradientColor2(e.target.value)} className="h-8 text-xs bg-white border-zinc-200 text-black px-2" />
                                                </div>
                                            </div>
                                        </div>

                                        {dotsGradientType === "linear" && (
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <Label className="text-xs text-white">Rotation</Label>
                                                    <span className="text-xs text-white">{dotsGradientRotation}°</span>
                                                </div>
                                                <Slider
                                                    value={[dotsGradientRotation]}
                                                    onValueChange={(vals) => setDotsGradientRotation(vals[0])}
                                                    max={360}
                                                    step={15}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium text-white">Background Color</Label>
                                    <div className="flex items-center gap-2">
                                        <Label className="text-xs text-white">Transparent</Label>
                                        <input type="checkbox" checked={bgTransparent} onChange={(e) => setBgTransparent(e.target.checked)} className="accent-white w-4 h-4" />
                                    </div>
                                </div>
                                {!bgTransparent && (
                                    <div className="flex gap-3">
                                        <div className="relative w-12 h-12 overflow-hidden rounded-xl border border-zinc-200 shadow-sm cursor-pointer">
                                            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="absolute -top-4 -left-4 w-20 h-20 cursor-pointer p-0 border-0" />
                                        </div>
                                        <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-12 bg-white border-zinc-200 text-black" />
                                    </div>
                                )}
                                {bgTransparent && (
                                    <div className="h-12 rounded-xl border border-dashed border-gray-300 flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
                                        Transparent
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Scannability Level */}
                    <section className="bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-800">
                        <h3 className="font-semibold text-lg text-white mb-4">Scannability Level <span className="text-sm font-normal text-white">(Error Correction)</span></h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {ERROR_LEVELS.map((level) => (
                                <button
                                    key={level.value}
                                    onClick={() => setSelectedErrorLevel(level.value as ErrorCorrectionLevel)}
                                    className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all text-center ${errorLevel === level.value ? "border-black bg-white ring-2 ring-white" : "border-zinc-700 hover:border-zinc-500 bg-white"}`}
                                >
                                    <level.icon className={`w-8 h-8 mb-2 ${errorLevel === level.value ? "text-black" : "text-black"}`} />
                                    <div className={`font-bold ${errorLevel === level.value ? "text-black" : "text-black"}`}>{level.label}</div>
                                    <div className="text-[10px] text-zinc-500 mt-1 leading-tight">{level.desc}</div>
                                    {errorLevel === level.value && <div className="absolute top-2 right-2 w-2 h-2 bg-black rounded-full"></div>}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Logo */}
                    <section className="bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-800">
                        <h3 className="font-semibold text-lg text-white mb-4">Logo</h3>
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-6">
                                <div
                                    className="w-32 h-32 border-2 border-dashed border-zinc-400 bg-white rounded-xl flex flex-col items-center justify-center text-center hover:border-black hover:bg-zinc-50 transition-colors cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="w-6 h-6 text-black mb-2" />
                                    <span className="text-xs text-black font-medium">Upload Logo</span>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleLogoUpload}
                                    />
                                </div>
                                {logoFile && (
                                    <div className="relative group">
                                        <div className="w-32 h-32 rounded-xl border border-gray-200 bg-white shadow-sm flex items-center justify-center p-4">
                                            <img src={logoFile} alt="Logo" className="max-w-full max-h-full object-contain" />
                                        </div>
                                        <button
                                            onClick={() => setLogoFile(null)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {logoFile && (
                                <div className="space-y-4 pt-4 border-t border-zinc-800">
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <Label className="text-sm font-medium text-white">Logo Size</Label>
                                            <span className="text-xs text-white">{logoSize[0]}%</span>
                                        </div>
                                        <Slider
                                            value={logoSize}
                                            onValueChange={setLogoSize}
                                            max={100}
                                            step={1}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <Label className="text-sm font-medium text-white">Logo Padding</Label>
                                            <span className="text-xs text-white">{logoMargin[0]}px</span>
                                        </div>
                                        <Slider
                                            value={logoMargin}
                                            onValueChange={setLogoMargin}
                                            max={50}
                                            step={1}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* FAQ Section (Mockup) */}
                    <div className="py-8">
                        <h3 className="text-xl font-bold text-white mb-6 text-center">Frequently Asked Questions about Customize your QR code</h3>
                        <div className="space-y-4">
                            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 shadow-sm hover:shadow-md transition-all cursor-pointer">
                                <div className="flex justify-between items-center font-medium text-gray-300">
                                    What are QR code frames and why should I use them?
                                    <ChevronRight className="w-5 h-5 text-gray-500" />
                                </div>
                            </div>
                            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 shadow-sm hover:shadow-md transition-all cursor-pointer">
                                <div className="flex justify-between items-center font-medium text-gray-300">
                                    Do decorative designs affect QR code scannability?
                                    <ChevronRight className="w-5 h-5 text-gray-500" />
                                </div>
                            </div>
                            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 shadow-sm hover:shadow-md transition-all cursor-pointer">
                                <div className="flex justify-between items-center font-medium text-gray-300">
                                    How do body patterns and shapes improve QR code performance?
                                    <ChevronRight className="w-5 h-5 text-gray-500" />
                                </div>
                            </div>
                            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 shadow-sm hover:shadow-md transition-all cursor-pointer">
                                <div className="flex justify-between items-center font-medium text-gray-300">
                                    Which colors work best for custom QR codes?
                                    <ChevronRight className="w-5 h-5 text-gray-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                </div >

                {/* Right Column - Sticky Preview */}
                < div className="w-full lg:w-[380px] relative" >
                    <div className="sticky top-8 space-y-6">

                        {/* Preview Card */}
                        <h2 className="text-2xl font-bold text-white text-center">Preview</h2>
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-black/10 border border-zinc-200 flex flex-col items-center">
                            <div className="relative group" id="qr-preview-container" style={isFluidFrame ? { width: '300px' } : {}}>
                                <FrameComponent color={frameColor} textColor={"#fff"} text={frameText}>
                                    {(CUSTOM_PATTERNS.some(p => p.id === dotsType) || CORNER_SQUARE_PATHS.some(p => p.id === cornerSquareType) || CORNER_DOT_PATHS.some(p => p.id === cornerDotType) || logoFile) ? (
                                        <CustomQRRenderer
                                            data={qrData}
                                            pattern={CUSTOM_PATTERNS.find(p => p.id === dotsType) || CUSTOM_PATTERNS.find(p => p.id === "pattern-squares")!}
                                            width={isFluidFrame ? "100%" : 220}
                                            height={isFluidFrame ? "100%" : 220}
                                            color={dotColor}
                                            bgColor={bgColor}
                                            bgTransparent={bgTransparent}
                                            logo={logoFile}
                                            logoSize={logoSize[0]}
                                            logoMargin={logoMargin[0]}
                                            errorCorrectionLevel={errorLevel}
                                            cornerSquareType={cornerSquareType}
                                            cornerSquareColor={cornerSquareColor}
                                            cornerDotType={cornerDotType}
                                            cornerDotColor={cornerDotColor}
                                            dotsGradientType={dotsGradientType}
                                            dotsGradientColor1={dotsGradientColor1}
                                            dotsGradientColor2={dotsGradientColor2}
                                            dotsGradientRotation={dotsGradientRotation}
                                        />
                                    ) : (
                                        <div ref={qrRef} className="rounded-lg overflow-hidden bg-transparent" />
                                    )}
                                </FrameComponent>
                            </div>
                            <p className="mt-8 text-sm text-gray-500 font-medium">
                                Generated QR for: <span className="text-purple-600">{QR_TYPES.find(t => t.value === qrType)?.label}</span>
                            </p>
                            <div className="flex gap-2 mt-4">
                                <Button variant="outline" size="sm" className="h-8 text-xs text-gray-500 border-gray-200"><LayoutTemplate className="w-3 h-3 mr-1" /> Template</Button>
                                <Button variant="outline" size="sm" className="h-8 text-xs text-gray-500 border-gray-200"><Grid3X3 className="w-3 h-3 mr-1" /> Pattern</Button>
                            </div>
                        </div>

                        {/* Download Actions */}
                        <div className="bg-zinc-900 rounded-2xl p-6 text-white shadow-lg shadow-black/50 border border-zinc-800">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-400 mb-1.5">Format</div>
                                    <Select value={downloadFormat} onValueChange={(v: any) => setDownloadFormat(v)}>
                                        <SelectTrigger className="bg-zinc-950 border-zinc-800 text-white h-10">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="png">PNG</SelectItem>
                                            <SelectItem value="jpeg">JPG</SelectItem>
                                            <SelectItem value="svg">SVG</SelectItem>
                                            <SelectItem value="pdf">PDF</SelectItem>
                                            <SelectItem value="eps">EPS</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-300 mb-1.5">Size (px)</div>
                                    <Select value={downloadSize} onValueChange={setDownloadSize}>
                                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-10">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="200">200 x 200</SelectItem>
                                            <SelectItem value="500">500 x 500</SelectItem>
                                            <SelectItem value="1000">1000 x 1000</SelectItem>
                                            <SelectItem value="1500">1500 x 1500</SelectItem>
                                            <SelectItem value="2000">2000 x 2000</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Button
                                className="w-full h-14 bg-white hover:bg-gray-200 text-black rounded-xl text-lg font-bold shadow-lg shadow-white/5 transition-all hover:scale-[1.02]"
                                onClick={handleDownload}
                                disabled={isDownloading}
                            >
                                {isDownloading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <Download className="w-6 h-6 mr-2" />}
                                Download QR Code
                            </Button>
                        </div>

                    </div>
                </div >

            </div >
        )
    }

    return (
        <div className={step === "content" ? "min-h-screen bg-black text-white" : "min-h-screen bg-black text-white font-sans"}>
            {/* Step 1: Content Input View */}
            {step === "content" && (
                <div className="min-h-screen flex flex-col items-center">
                    {/* Header */}
                    <div className="w-full bg-black border-b border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                        <div className="flex items-center gap-4">
                            <Link href="/">
                                <Button variant="ghost" size="icon" className="hover:bg-zinc-900 rounded-full h-8 w-8">
                                    <ArrowLeft className="w-5 h-5 text-white" />
                                </Button>
                            </Link>
                            <div className="text-sm font-medium text-white flex items-center gap-2">
                                <span className="opacity-60 text-gray-400">ME-QR</span>
                                <ChevronRight className="w-4 h-4 opacity-40 text-gray-400" />
                                <span className="opacity-60 text-gray-400">Type</span>
                                <ChevronRight className="w-4 h-4 opacity-40 text-gray-400" />
                                <span className="font-semibold text-white">{QR_TYPES.find(t => t.value === qrType)?.label}</span>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-black border-b border-zinc-800 flex justify-center py-8">
                        <div className="flex items-center gap-2">
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold shadow-sm ring-2 ring-zinc-800">1</div>
                                <span className="text-xs mt-1.5 font-semibold text-white">Type</span>
                            </div>
                            <div className="w-20 h-1 bg-black rounded-full mx-2"></div>
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold shadow-lg ring-4 ring-zinc-900">2</div>
                                <span className="text-xs mt-1.5 font-bold text-white">Content</span>
                            </div>
                            <div className="w-20 h-1 bg-zinc-800 rounded-full mx-2"></div>
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-zinc-800 text-gray-500 flex items-center justify-center font-bold">3</div>
                                <span className="text-xs mt-1.5 text-gray-400 font-medium">Customize</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="w-full max-w-4xl p-6">
                        <h1 className="text-3xl font-bold text-center mb-10 text-white">Enter Content</h1>

                        <div className="bg-zinc-950 rounded-3xl shadow-xl shadow-black/50 border border-zinc-800 p-8">
                            {/* Tabs / Type Selector */}
                            <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide mb-6 border-b border-zinc-800">
                                {QR_TYPES.map(t => (
                                    <button
                                        key={t.value}
                                        onClick={() => handleTypeChange(t.value as QRType)}
                                        className={`px-5 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2.5 border ${qrType === t.value ? 'bg-white text-black border-white shadow-lg shadow-zinc-900' : 'bg-zinc-900 text-gray-400 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700'}`}
                                    >
                                        <t.icon className={`w-4 h-4 ${qrType === t.value ? 'text-black' : 'text-gray-400'}`} />
                                        {t.label}
                                    </button>
                                ))}
                            </div>

                            {/* Form Fields */}
                            <div className="py-4 px-2">
                                {renderContentFields()}
                            </div>

                            {/* Action Button */}
                            <div className="mt-8 pt-6 border-t border-zinc-800 flex justify-end">
                                <Button
                                    size="lg"
                                    className="bg-white hover:bg-gray-200 text-black px-8 h-12 text-base shadow-lg shadow-black/20 hover:shadow-xl transition-all rounded-xl"
                                    onClick={() => setStep("customize")}
                                >
                                    Customize & Download QR
                                    <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
                                </Button>
                            </div>
                        </div>

                        <div className="mt-10 text-center">
                            <Button variant="outline" className="border-zinc-800 text-white hover:bg-zinc-900 rounded-full px-8 py-6 h-auto text-base">
                                <Star className="w-5 h-5 mr-2 fill-gray-500 text-gray-400" /> Try Pro Version*
                            </Button>
                            <p className="text-xs text-gray-400 mt-4 font-medium">*All QR Codes Ads-free</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 2: Customize View (Dark Theme) */}
            {/* Customization View handled by renderCustomizeStep */}
            {step === "customize" && renderCustomizeStep()}
        </div>
    )
}

