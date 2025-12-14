import { saveAs } from "file-saver"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export interface UPIParams {
    pa: string // Payee Address (VPA)
    pn?: string // Payee Name
    am?: string // Amount
    cu?: string // Currency (default INR)
}

export const generateUPIString = ({ pa, pn, am, cu = "INR" }: UPIParams): string => {
    if (!pa) return ""

    let upiString = `upi://pay?pa=${pa}&cu=${cu}`

    if (pn) {
        upiString += `&pn=${encodeURIComponent(pn)}`
    }

    if (am && parseFloat(am) > 0) {
        upiString += `&am=${am}`
    }

    return upiString
}

export const downloadQRCode = async (
    elementId: string,
    format: "png" | "jpg" | "svg" | "pdf" | "webp",
    filename: string
) => {
    const element = document.getElementById(elementId)
    if (!element) return

    // For SVG, we can just grab the SVG element directly if it exists
    if (format === "svg") {
        const svgElement = element.querySelector("svg")
        if (svgElement) {
            const svgData = new XMLSerializer().serializeToString(svgElement)
            const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
            saveAs(blob, `${filename}.svg`)
            return
        }
    }

    // For other formats, we use html2canvas
    try {
        const canvas = await html2canvas(element, {
            backgroundColor: "#ffffff",
            scale: 2, // Higher quality
        })

        if (format === "png") {
            canvas.toBlob((blob) => {
                if (blob) saveAs(blob, `${filename}.png`)
            })
        } else if (format === "jpg") {
            const dataUrl = canvas.toDataURL("image/jpeg", 0.9)
            const res = await fetch(dataUrl)
            const blob = await res.blob()
            saveAs(blob, `${filename}.jpg`)
        } else if (format === "webp") {
            const dataUrl = canvas.toDataURL("image/webp", 0.9)
            const res = await fetch(dataUrl)
            const blob = await res.blob()
            saveAs(blob, `${filename}.webp`)
        } else if (format === "pdf") {
            const imgData = canvas.toDataURL("image/png")
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "px",
                format: [canvas.width, canvas.height]
            })
            pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height)
            pdf.save(`${filename}.pdf`)
        }
    } catch (error) {
        console.error("Error downloading QR code:", error)
    }
}

// vCard QR Code Generator
export interface VCardParams {
    firstName: string
    lastName?: string
    organization?: string
    title?: string
    phone?: string
    email?: string
    website?: string
    address?: string
    city?: string
    state?: string
    zip?: string
    country?: string
}

export const generateVCard = (params: VCardParams): string => {
    const lines = ["BEGIN:VCARD", "VERSION:3.0"]

    if (params.firstName || params.lastName) {
        lines.push(`FN:${params.firstName} ${params.lastName || ""}`.trim())
        lines.push(`N:${params.lastName || ""};${params.firstName};;;`)
    }

    if (params.organization) lines.push(`ORG:${params.organization}`)
    if (params.title) lines.push(`TITLE:${params.title}`)
    if (params.phone) lines.push(`TEL:${params.phone}`)
    if (params.email) lines.push(`EMAIL:${params.email}`)
    if (params.website) lines.push(`URL:${params.website}`)

    if (params.address || params.city || params.state || params.zip || params.country) {
        lines.push(`ADR:;;${params.address || ""};${params.city || ""};${params.state || ""};${params.zip || ""};${params.country || ""}`)
    }

    lines.push("END:VCARD")
    return lines.join("\n")
}

// WiFi QR Code Generator
export interface WiFiParams {
    ssid: string
    password?: string
    encryption?: "WPA" | "WEP" | "nopass"
    hidden?: boolean
}

export const generateWiFi = ({ ssid, password, encryption = "WPA", hidden = false }: WiFiParams): string => {
    return `WIFI:T:${encryption};S:${ssid};P:${password || ""};H:${hidden ? "true" : "false"};;`
}

// Email QR Code Generator
export interface EmailParams {
    email: string
    subject?: string
    body?: string
}

export const generateEmail = ({ email, subject, body }: EmailParams): string => {
    let mailto = `mailto:${email}`
    const params = []

    if (subject) params.push(`subject=${encodeURIComponent(subject)}`)
    if (body) params.push(`body=${encodeURIComponent(body)}`)

    if (params.length > 0) {
        mailto += `?${params.join("&")}`
    }

    return mailto
}

// Phone QR Code Generator
export const generatePhone = (phone: string): string => {
    return `tel:${phone}`
}

// SMS QR Code Generator
export interface SMSParams {
    phone: string
    message?: string
}

export const generateSMS = ({ phone, message }: SMSParams): string => {
    return `sms:${phone}${message ? `?body=${encodeURIComponent(message)}` : ""}`
}

// Location QR Code Generator
export interface LocationParams {
    latitude: number
    longitude: number
}

export const generateLocation = ({ latitude, longitude }: LocationParams): string => {
    return `geo:${latitude},${longitude}`
}
