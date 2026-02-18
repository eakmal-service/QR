"use client"

import { useState, useEffect, useRef } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Download, Copy, Check, Share2 } from "lucide-react"

interface QRBuilderDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    type: string
    typeLabel: string
}

export function QRBuilderDialog({ open, onOpenChange, type, typeLabel }: QRBuilderDialogProps) {
    const [value, setValue] = useState("")
    const [fields, setFields] = useState<Record<string, string>>({})
    const [copied, setCopied] = useState(false)

    // Reset when type changes
    useEffect(() => {
        setFields({})
        setValue("")
    }, [type, open])

    // Update generated value based on fields and type
    useEffect(() => {
        let generated = ""

        switch (type) {
            case "url":
            case "link":
            case "custom":
            case "google":
            case "facebook":
            case "instagram":
            case "twitter":
            case "linkedin":
            case "youtube":
            case "pinterest":
            case "tiktok":
            case "snapchat":
            case "reddit":
            case "amazon":
            case "gforms":
            case "gdoc":
            case "gsheets":
            case "greview":
            case "booking":
            case "office365":
            case "calendar": // Simple URL calendar for now
            case "calendar": // Simple URL calendar for now
            case "links":
            case "survey":
            case "app": // Usually a smart link, treating as URL for now
                generated = fields.url || ""
                break

            case "text":
                generated = fields.text || ""
                break

            case "email":
                if (fields.email) {
                    generated = `mailto:${fields.email}?subject=${encodeURIComponent(fields.subject || "")}&body=${encodeURIComponent(fields.body || "")}`
                }
                break

            case "sms":
                if (fields.phone) {
                    generated = `smsto:${fields.phone}:${fields.message || ""}`
                }
                break

            case "whatsapp":
                if (fields.phone) {
                    generated = `https://wa.me/${fields.phone.replace(/\D/g, '')}?text=${encodeURIComponent(fields.message || "")}`
                }
                break

            case "phone":
                if (fields.phone) {
                    generated = `tel:${fields.phone}`
                }
                break

            case "wifi":
                if (fields.ssid) {
                    generated = `WIFI:T:${fields.encryption || 'WPA'};S:${fields.ssid};P:${fields.password || ''};;`
                }
                break

            case "vcard":
                if (fields.firstName || fields.lastName) {
                    generated = `BEGIN:VCARD\nVERSION:3.0\nN:${fields.lastName || ""};${fields.firstName || ""};;;\nFN:${fields.firstName || ""} ${fields.lastName || ""}\nORG:${fields.organization || ""}\nTEL:${fields.phone || ""}\nEMAIL:${fields.email || ""}\nEND:VCARD`
                }
                break

            case "map":
                if (fields.lat && fields.lng) {
                    generated = `geo:${fields.lat},${fields.lng}`
                    // OR google maps link: `https://www.google.com/maps/search/?api=1&query=${fields.lat},${fields.lng}` 
                    // geo: is more standard for QRs to open map app directly
                }
                break

            // File types - Request URL
            case "pdf":
            case "image":
            case "ppt":
            case "file":
            case "excel":
            case "png":
            case "logo":
            case "barcode": // Treating as content for now
                generated = fields.url || ""
                break

            case "upi":
                if (fields.vpa) {
                    generated = `upi://pay?pa=${fields.vpa}&pn=${encodeURIComponent(fields.name || "")}&am=${fields.amount || ""}&cu=INR`
                }
                break

            default:
                generated = fields.content || ""
        }

        setValue(generated)
    }, [fields, type])

    const handleDownload = () => {
        const svg = document.getElementById("qr-generator-svg")
        if (!svg) return

        const svgData = new XMLSerializer().serializeToString(svg)
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        const img = new Image()

        img.onload = () => {
            canvas.width = 250
            canvas.height = 250 // High res
            if (ctx) {
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height); // White background
                ctx.drawImage(img, 0, 0, 250, 250)
            }

            const pngFile = canvas.toDataURL("image/png")
            const downloadLink = document.createElement("a")
            downloadLink.download = `me-qr-${type}-${Date.now()}.png`
            downloadLink.href = pngFile
            downloadLink.click()
        }

        img.src = "data:image/svg+xml;base64," + btoa(svgData)
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const renderFields = () => {
        // Shared change handler
        const handleChange = (key: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            setFields(prev => ({ ...prev, [key]: e.target.value }))
        }

        if (["url", "link", "custom", "app", "gforms", "gdoc", "gsheets", "greview", "booking", "office365", "calendar", "links", "facebook", "instagram", "twitter", "linkedin", "youtube", "tiktok", "snapchat", "reddit", "amazon", "survey"].includes(type)) {
            return (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Website URL</Label>
                        <Input
                            placeholder="https://example.com"
                            value={fields.url || ""}
                            onChange={(e) => handleChange("url", e)}
                        />
                        <p className="text-xs text-gray-500">Enter the link you want the QR code to open.</p>
                    </div>
                </div>
            )
        }

        // File types - fallback to URL for now
        if (["pdf", "image", "ppt", "file", "excel", "png", "logo"].includes(type)) {
            return (
                <div className="space-y-4">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-md">
                        <p className="text-sm text-yellow-500">File upload is simulated. Please verify by entering a public URL to your file.</p>
                    </div>
                    <div className="space-y-2">
                        <Label>File URL</Label>
                        <Input
                            placeholder="https://example.com/my-file.pdf"
                            value={fields.url || ""}
                            onChange={(e) => handleChange("url", e)}
                        />
                    </div>
                </div>
            )
        }

        if (type === "text" || type === "barcode") {
            return (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Your Text</Label>
                        <Textarea
                            placeholder="Enter your text here..."
                            className="min-h-[100px]"
                            value={fields.text || ""}
                            onChange={(e) => handleChange("text", e)}
                        />
                    </div>
                </div>
            )
        }

        if (type === "email") {
            return (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Email Address</Label>
                        <Input placeholder="support@example.com" value={fields.email || ""} onChange={(e) => handleChange("email", e)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Subject</Label>
                        <Input placeholder="Inquiry" value={fields.subject || ""} onChange={(e) => handleChange("subject", e)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Message</Label>
                        <Textarea placeholder="Hello..." value={fields.body || ""} onChange={(e) => handleChange("body", e)} />
                    </div>
                </div>
            )
        }

        if (type === "sms") {
            return (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input placeholder="+1 234 567 8900" value={fields.phone || ""} onChange={(e) => handleChange("phone", e)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Message</Label>
                        <Textarea placeholder="Hello..." value={fields.message || ""} onChange={(e) => handleChange("message", e)} />
                    </div>
                </div>
            )
        }

        if (type === "whatsapp") {
            return (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>WhatsApp Number</Label>
                        <Input placeholder="+1 234 567 8900" value={fields.phone || ""} onChange={(e) => handleChange("phone", e)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Pre-filled Message</Label>
                        <Textarea placeholder="I'm interested in..." value={fields.message || ""} onChange={(e) => handleChange("message", e)} />
                    </div>
                </div>
            )
        }

        if (type === "phone") {
            return (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input placeholder="+1 234 567 8900" value={fields.phone || ""} onChange={(e) => handleChange("phone", e)} />
                    </div>
                </div>
            )
        }

        if (type === "wifi") {
            return (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Network Name (SSID)</Label>
                        <Input placeholder="MyWiFi" value={fields.ssid || ""} onChange={(e) => handleChange("ssid", e)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Password</Label>
                        <Input type="password" placeholder="Password" value={fields.password || ""} onChange={(e) => handleChange("password", e)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Encryption</Label>
                        <select
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            value={fields.encryption || "WPA"}
                            onChange={(e) => handleChange("encryption", e)}
                        >
                            <option value="WPA">WPA/WPA2</option>
                            <option value="WEP">WEP</option>
                            <option value="nopass">No Password</option>
                        </select>
                    </div>
                </div>
            )
        }

        if (type === "vcard") {
            return (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>First Name</Label>
                            <Input placeholder="John" value={fields.firstName || ""} onChange={(e) => handleChange("firstName", e)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Last Name</Label>
                            <Input placeholder="Doe" value={fields.lastName || ""} onChange={(e) => handleChange("lastName", e)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Organization</Label>
                        <Input placeholder="Company Inc." value={fields.organization || ""} onChange={(e) => handleChange("organization", e)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input placeholder="+1 234..." value={fields.phone || ""} onChange={(e) => handleChange("phone", e)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input placeholder="john@example.com" value={fields.email || ""} onChange={(e) => handleChange("email", e)} />
                    </div>
                </div>
            )
        }

        if (type === "map") {
            return (
                <div className="space-y-4">
                    <p className="text-sm text-gray-400">Enter coordinates to pinpoint a location.</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Latitude</Label>
                            <Input placeholder="40.7128" value={fields.lat || ""} onChange={(e) => handleChange("lat", e)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Longitude</Label>
                            <Input placeholder="-74.0060" value={fields.lng || ""} onChange={(e) => handleChange("lng", e)} />
                        </div>
                    </div>
                </div>
            )
        }

        if (type === "upi") {
            return (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>UPI ID (VPA)</Label>
                        <Input placeholder="merchant@upi" value={fields.vpa || ""} onChange={(e) => handleChange("vpa", e)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Payee Name</Label>
                        <Input placeholder="Merchant Name" value={fields.name || ""} onChange={(e) => handleChange("name", e)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Amount (Optional)</Label>
                        <Input placeholder="100.00" type="number" value={fields.amount || ""} onChange={(e) => handleChange("amount", e)} />
                    </div>
                </div>
            )
        }

        return (
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Content</Label>
                    <Input
                        placeholder="Enter content"
                        value={fields.content || ""}
                        onChange={(e) => handleChange("content", e)}
                    />
                </div>
            </div>
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl bg-black border-gray-800 text-gray-200">
                <DialogHeader>
                    <DialogTitle className="text-white text-xl">Generate {typeLabel} QR Code</DialogTitle>
                    <DialogDescription>
                        Enter the details below to generate your QR code.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                    {/* Left: Input Form */}
                    <div className="bg-zinc-900/50 p-6 rounded-xl border border-gray-800">
                        {renderFields()}
                    </div>

                    {/* Right: Preview */}
                    <div className="flex flex-col items-center justify-center space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-lg border-4 border-white">
                            <QRCodeSVG
                                id="qr-generator-svg"
                                value={value || "https://me-qr.com"}
                                size={200}
                                level="H"
                                includeMargin={true}
                                imageSettings={{
                                    src: "",
                                    height: 24,
                                    width: 24,
                                    excavate: true,
                                }}
                            />
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-gray-500 mb-4 break-all max-w-xs mx-auto">
                                {value ? (value.length > 50 ? value.substring(0, 50) + "..." : value) : "Enter data to generate"}
                            </p>

                            <div className="flex gap-2 justify-center">
                                <Button onClick={handleDownload} className="bg-white text-black hover:bg-gray-200">
                                    <Download className="w-4 h-4 mr-2" /> Download
                                </Button>
                                <Button variant="outline" onClick={handleCopy} className="border-gray-700 hover:bg-zinc-900 text-gray-300">
                                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                    {copied ? "Copied" : "Copy"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
