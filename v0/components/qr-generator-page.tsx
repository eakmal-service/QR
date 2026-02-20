"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Link as LinkIcon, FileText, Image as ImageIcon, Smartphone,
  Type, MessageSquare, User, MapPin,
  Music, Calendar, Phone,
  Globe, Search, ChevronDown, ArrowRight, X,
  HelpCircle, MoreHorizontal, Ticket,
} from "lucide-react"
// Brand icons from react-icons
import { FaWhatsapp, FaSnapchatGhost, FaTelegram, FaLinkedinIn, FaFacebookF, FaInstagram, FaYoutube, FaRedditAlien, FaAmazon, FaFilePdf, FaFileExcel, FaFilePowerpoint, FaCalendarAlt, FaLink, FaImage, FaQrcode, FaShapes, FaFileAlt, FaMicrosoft, FaBarcode } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"

import { MdEmail, MdWifi, MdSms, MdAudiotrack, MdContactPhone, MdInstallMobile } from "react-icons/md"
import { SiGooglemaps } from "react-icons/si"
import { IoLogoGoogle } from "react-icons/io"
import { HiMiniGlobeAlt } from "react-icons/hi2"
import { TbWorldWww } from "react-icons/tb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"



// Google Suite Data - Kept for reference or filtering logic if needed
const googleTypes = [
  { id: "gforms", label: "Forms", icon: FileText },
  { id: "gdoc", label: "Example Doc", icon: FileText },
  { id: "gsheets", label: "Sheets", icon: FileText },
  { id: "greview", label: "Review", icon: MessageSquare },
]

// QR Types - Each card has its own accent color for visual variety
const featuredTypes: Array<{
  id: string; label: string; icon: any; accent: string;
  span?: string; size: 'hero' | 'tall' | 'wide' | 'normal' | 'social';
  description?: string;
}> = [
    // Row 1
    { id: "url", label: "URL / Link", icon: TbWorldWww, accent: "#0066CC", span: "col-span-2", size: "hero", description: "Any website or link" },
    { id: "app", label: "App Store", icon: MdInstallMobile, accent: "#1C8EF9", span: "", size: "normal" },
    { id: "whatsapp", label: "WhatsApp", icon: FaWhatsapp, accent: "#25D366", span: "row-span-2", size: "tall" },

    // Row 2
    { id: "phone", label: "Phone", icon: Phone, accent: "#34A853", span: "", size: "normal" },
    { id: "vcard", label: "vCard", icon: MdContactPhone, accent: "#7D7D7D", span: "", size: "normal" },
    { id: "email", label: "E-mail", icon: MdEmail, accent: "#EA4335", span: "", size: "normal" },

    // Row 3
    { id: "gbusiness", label: "Google Business", icon: IoLogoGoogle, accent: "#4285F4", span: "col-span-2", size: "wide", description: "Reviews & Profile" },
    { id: "instagram", label: "Instagram", icon: FaInstagram, accent: "#E1306C", span: "", size: "social" },
    { id: "facebook", label: "Facebook", icon: FaFacebookF, accent: "#1877F2", span: "", size: "social" },

    // Row 4
    { id: "youtube", label: "YouTube", icon: FaYoutube, accent: "#FF0000", span: "", size: "social" },
    { id: "snapchat", label: "Snapchat", icon: FaSnapchatGhost, accent: "#FFFC00", span: "", size: "social" },
    { id: "telegram", label: "Telegram", icon: FaTelegram, accent: "#0088CC", span: "", size: "social" },
    { id: "linkedin", label: "LinkedIn", icon: FaLinkedinIn, accent: "#0A66C2", span: "", size: "social" },

    // Row 5
    { id: "pdf", label: "PDF", icon: FaFilePdf, accent: "#F40F02", span: "", size: "normal" },
    { id: "image", label: "Image", icon: FaImage, accent: "#0078D4", span: "", size: "normal" },
    { id: "text", label: "Text", icon: Type, accent: "#34C759", span: "", size: "normal" },
    { id: "wifi", label: "Wi-Fi", icon: MdWifi, accent: "#0078D4", span: "", size: "normal" },

    // Row 6
    { id: "map", label: "Map", icon: SiGooglemaps, accent: "#34A853", span: "", size: "normal" },
    { id: "audio", label: "Audio", icon: MdAudiotrack, accent: "#FF6B35", span: "", size: "normal" },
    { id: "twitter", label: "X (Twitter)", icon: FaXTwitter, accent: "#ffffff", span: "", size: "social" },
    { id: "sms", label: "SMS", icon: MdSms, accent: "#34C759", span: "", size: "normal" },
  ]

// Remaining types (shown after View More)
const otherTypes: Array<{ id: string; label: string; icon: any; accent?: string }> = [
  { id: "booking", label: "Booking", icon: FaCalendarAlt, accent: "#003580" },
  { id: "calendar", label: "Calendar", icon: Calendar, accent: "#1A73E8" },
  { id: "ppt", label: "PPTX", icon: FaFilePowerpoint, accent: "#D24726" },
  { id: "custom", label: "Custom URL", icon: HiMiniGlobeAlt, accent: "#0066CC" },
  { id: "links", label: "List of Links", icon: FaLink, accent: "#0066CC" },
  { id: "logo", label: "Logo", icon: FaImage, accent: "#ec4899" },
  { id: "office365", label: "Office 365", icon: FaMicrosoft, accent: "#D83B01" },
  { id: "shaped", label: "Shaped", icon: FaShapes, accent: "#a855f7" },
  { id: "png", label: "PNG", icon: FaImage, accent: "#a855f7" },
  { id: "social", label: "Social Media", icon: FaInstagram, accent: "#E1306C" },
  { id: "reddit", label: "Reddit", icon: FaRedditAlien, accent: "#FF4500" },
  { id: "file", label: "File", icon: FaFileAlt, accent: "#0078D4" },
  { id: "excel", label: "Excel", icon: FaFileExcel, accent: "#217346" },
  { id: "amazon", label: "Amazon", icon: FaAmazon, accent: "#FF9900" },
  { id: "barcode", label: "2D-Barcode", icon: FaBarcode, accent: "#ffffff" },
  { id: "upi", label: "UPI", icon: FaQrcode, accent: "#5F259F" },
]

// Landing Page Templates - Dark Mode
const templates = [
  {
    id: 1,
    title: "PDF",
    image: "https://placehold.co/200x300/111/ccc?text=PDF",
    color: "bg-zinc-900"
  },
  {
    id: 2,
    title: "List Of Links",
    image: "https://placehold.co/200x300/222/ccc?text=Links",
    color: "bg-zinc-800"
  },
  {
    id: 3,
    title: "Website",
    image: "https://placehold.co/200x300/333/ccc?text=Web",
    color: "bg-zinc-900"
  },
  {
    id: 4,
    title: "Apps",
    image: "https://placehold.co/200x300/444/ccc?text=Apps",
    color: "bg-zinc-800"
  },
]

// FAQs
const faqs = [
  {
    question: "What types of QR codes can I create with ME-QR?",
    answer: "You can generate URL, PDF, Image, Text, WiFi, WhatsApp, vCard, Email, Audio, App Store links, Booking, Maps, Phone Call, PPTX, Custom URL, and many other QR code types."
  },
  {
    question: "Are the QR code templates free to use?",
    answer: "Yes, our basic templates are free to use. Premium templates with advanced customization options are available in our paid plans."
  },
  {
    question: "Can I edit my QR code after it's created?",
    answer: "Yes, if you create a dynamic QR code (available for all types except pure text), you can edit the content securely without changing the QR code itself."
  },
  {
    question: "Do I need an account to create a QR code?",
    answer: "No, you don't need an account to create basic QR codes. However, creating an account allows you to save, manage, and track your QR codes."
  },
  {
    question: "Does ME-QR support business and enterprise use?",
    answer: "Absolutely. We offer tailored plans for businesses and potential enterprise solutions with features like bulk generation, advanced analytics, and team management."
  },
]

import { useRouter } from "next/navigation"

export function QRGeneratorPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("choose-type")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAllTypes, setShowAllTypes] = useState(false)



  // Filter logic
  const filteredFeatured = featuredTypes.filter(t => t.label.toLowerCase().includes(searchQuery.toLowerCase()))
  const filteredOther = otherTypes.filter(t => t.label.toLowerCase().includes(searchQuery.toLowerCase()))

  const isSearching = searchQuery.length > 0

  return (
    <div className="min-h-screen bg-background font-sans text-gray-300">

      {/* Shared Header from Home Page */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-8 max-w-6xl" style={{ paddingTop: '120px' }}>

        {/* Choose Type Section */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-white">All Types Of QR Codes</h1>

            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <Input
                placeholder="Insert Type"
                className="pl-9 pr-24 w-full md:w-80 text-gray-200 h-11 rounded-xl focus-visible:ring-1 focus-visible:ring-white/30 placeholder:text-gray-500"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(12px)',
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="absolute right-1 top-1 bottom-1 rounded-lg px-4 h-auto text-sm font-medium text-white transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
              >Search</button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

            {/* Featured Grid */}
            {(!isSearching ? featuredTypes : [...featuredTypes, ...otherTypes].filter(t => t.label.toLowerCase().includes(searchQuery.toLowerCase()))).map((type) => {
              const accent = (type as any).accent || '#6366f1'
              const size = (type as any).size || 'normal'

              return (
                <motion.button
                  key={type.id}
                  whileHover={{ y: -4, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push(`/generate/${type.id}`)}
                  className={`
                  qr-card relative group overflow-hidden rounded-2xl text-left transition-all duration-300
                  ${(type as any).span || ''}
                  ${size === 'hero' ? 'p-5 min-h-[100px]' : ''}
                  ${size === 'tall' ? 'p-5 min-h-[100px]' : ''}
                  ${size === 'wide' ? 'p-5 min-h-[80px]' : ''}
                  ${size === 'normal' ? 'p-4 min-h-[76px]' : ''}
                  ${size === 'social' ? 'p-4 min-h-[76px]' : ''}
                `}
                  style={{
                    '--accent': accent,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(8px)',
                  } as React.CSSProperties}
                >
                  {/* Accent glow line at bottom — silver by default, colored on hover */}
                  <div className="qr-glow absolute bottom-0 left-0 right-0 h-[2px] opacity-40 group-hover:opacity-100 group-hover:h-1" />
                  {/* Colored hover background tint */}
                  <div className="qr-tint absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {size === 'tall' ? (
                    /* WhatsApp tall centerpiece — silver icon, brand color on hover */
                    <div className="flex flex-col items-center justify-center h-full gap-3">
                      <div className="qr-badge w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110">
                        <type.icon className="qr-badge-icon w-8 h-8" />
                      </div>
                      <span className="font-medium text-gray-300 group-hover:text-white transition-colors text-base">{type.label}</span>
                    </div>
                  ) : size === 'hero' ? (
                    /* Hero card — silver icon badge, brand color on hover */
                    <div className="flex items-center gap-4">
                      <div className="qr-badge w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110">
                        <type.icon className="qr-badge-icon w-6 h-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-white text-base block">{type.label}</span>
                        {(type as any).description && (
                          <p className="text-sm text-gray-500 mt-0.5">{(type as any).description}</p>
                        )}
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                  ) : size === 'social' ? (
                    /* Social card — silver icon, brand color on hover */
                    <div className="flex items-center gap-3 h-full">
                      <div className="qr-badge w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110">
                        <type.icon className="qr-badge-icon w-5 h-5" />
                      </div>
                      <span className="font-medium text-gray-300 group-hover:text-white transition-colors text-sm">{type.label}</span>
                    </div>
                  ) : (
                    /* Standard / Wide card — silver icon, brand color on hover */
                    <div className="flex items-center justify-between h-full">
                      <div className="flex items-center gap-3">
                        <div className="qr-badge w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110">
                          <type.icon className="qr-badge-icon w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-medium text-gray-200 group-hover:text-white transition-colors block truncate text-sm">{type.label}</span>
                          {(type as any).description && (
                            <p className="text-xs text-gray-500 mt-0.5 truncate">{(type as any).description}</p>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-700 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                    </div>
                  )}
                </motion.button>
              )
            })}

            {/* View More */}
            {!isSearching && !showAllTypes && (
              <div className="col-span-2 md:col-span-4 flex justify-center mt-4">
                <button
                  onClick={() => setShowAllTypes(true)}
                  className="text-gray-400 hover:text-white flex items-center gap-2 text-sm px-8 py-2.5 rounded-full transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  View More Types <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Expanded */}
            {showAllTypes && !isSearching && otherTypes.map((type) => {
              const accent = type.accent || '#6366f1'
              return (
                <motion.button
                  key={type.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push(`/generate/${type.id}`)}
                  className="qr-card relative group overflow-hidden rounded-2xl p-4 min-h-[76px] text-left transition-all duration-300"
                  style={{
                    '--accent': accent,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(8px)',
                  } as React.CSSProperties}
                >
                  <div className="qr-glow absolute bottom-0 left-0 right-0 h-[2px] opacity-40 group-hover:opacity-100 group-hover:h-1" />
                  <div className="qr-tint absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="flex items-center justify-between h-full relative">
                    <div className="flex items-center gap-3">
                      <div className="qr-badge w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110">
                        <type.icon className="qr-badge-icon w-5 h-5" />
                      </div>
                      <span className="font-medium text-gray-300 group-hover:text-white transition-colors text-sm">{type.label}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-700 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                </motion.button>
              )
            })}
          </div>
        </section>

        {/* QR Code Landing Page Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">QR Code landing page</h2>
            <div className="flex gap-4">
              <div
                className="rounded-xl px-4 py-2 flex items-center gap-2 text-sm text-gray-400 min-w-[200px] justify-between cursor-pointer transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <span>Same Funky Templates</span>
                <X className="w-3 h-3 text-gray-500" />
              </div>
              <button
                className="rounded-xl px-4 py-2 text-sm font-medium text-white transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
              >Search</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="p-6 rounded-2xl transition-all duration-300 group"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(8px)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-white">{template.title}</h3>
                  <ArrowRight className="w-4 h-4 text-gray-500" />
                </div>
                <div className="aspect-[2/3] rounded-xl overflow-hidden relative bg-black">
                  <img
                    src={template.image}
                    alt={template.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="w-full py-2 rounded-xl text-sm font-medium text-black transition-all"
                      style={{ background: 'rgba(255,255,255,0.9)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#fff' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.9)' }}
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-white' : 'bg-white/15'}`} />
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          className="mb-16 rounded-3xl p-8 md:p-12"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>

          <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-xl px-4 transition-colors"
                style={{
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <AccordionTrigger className="text-lg font-medium py-6 hover:no-underline text-gray-300 hover:text-white transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-500 pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Support & Promo Cards */}
        <section className="grid md:grid-cols-2 gap-8 mb-16">
          <div
            className="p-8 rounded-2xl flex items-center justify-between group transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(8px)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Need Help?</h3>
                <p className="text-gray-500 text-sm max-w-[250px]">
                  Get help choosing the types of QR Code if you don't know which one to use?
                </p>
              </div>
            </div>
            <button
              className="rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.9)'; e.currentTarget.style.color = '#000' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
            >
              Contact Us
            </button>
          </div>

          <div
            className="p-8 rounded-2xl flex items-center justify-between group transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(8px)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <MoreHorizontal className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Different QR Code Types</h3>
                <p className="text-gray-500 text-sm max-w-[300px]">
                  A QR code is a matrix barcode readable by mobile devices.
                </p>
              </div>
            </div>
            <button
              className="rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.9)'; e.currentTarget.style.color = '#000' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
            >
              Read More
            </button>
          </div>
        </section>

        {/* Business Promo Section */}
        <section className="grid md:grid-cols-2 gap-8 mb-20">
          {/* Me-Pos Card */}
          <div
            className="rounded-3xl p-8 overflow-hidden relative"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-3 rounded-full border border-white/40 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
                <span className="font-bold text-gray-300">Me-Pos</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4 leading-tight">
                Me-Pos: Run Your Business Easy and Free
              </h3>
              <p className="text-gray-500 mb-8 max-w-sm">
                Our vision is to build solutions for businesses of sales, retail, no one personnel in usage fees.
              </p>
              <div className="flex gap-4 mb-12">
                <button
                  className="px-8 py-2.5 rounded-xl font-semibold text-black transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.9)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'scale(1.05)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.9)'; e.currentTarget.style.transform = 'scale(1)' }}
                >Try For Free</button>
                <button className="text-white underline decoration-gray-500 hover:decoration-white transition-colors text-sm">Generate QR for Menu</button>
              </div>
            </div>

            <div className="mt-8 rounded-t-xl mx-auto max-w-[90%] overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="h-4 flex items-center gap-1 px-2" style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              </div>
              <div className="p-4 grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-20 rounded" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}></div>
                ))}
              </div>
            </div>
          </div>

          {/* Ticket Card */}
          <div
            className="rounded-3xl p-8 overflow-hidden relative"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 text-white">
                <Ticket className="w-5 h-5" />
                <span className="font-bold">ME-TICKET</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4 leading-tight">
                Upgrade Your Tickets with QR Code for Easy Check-in
              </h3>
              <p className="text-gray-500 mb-8 max-w-sm">
                ME-Ticket is a platform for selling tickets. Create an event, generate tickets with QR codes and enjoy refunds.
              </p>
              <div className="flex gap-4 mb-12">
                <button
                  className="px-8 py-2.5 rounded-xl font-semibold text-black transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.9)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'scale(1.05)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.9)'; e.currentTarget.style.transform = 'scale(1)' }}
                >Create Event</button>
                <button className="text-white underline decoration-gray-500 hover:decoration-white transition-colors text-sm">Generate QR for Ticket</button>
              </div>
            </div>

            <div className="mt-8 rounded-t-xl mx-auto max-w-[90%] overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="h-4 flex items-center leading-none px-2 text-[8px] text-gray-500" style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                Smart Ticket Sales
              </div>
              <img
                src="https://placehold.co/500x300/111/444?text=Ticket+UI"
                alt="Ticket Dashboard"
                className="w-full opacity-80"
              />
            </div>
          </div>
        </section>

        {/* Bottom Feature Links */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div
            className="p-6 rounded-xl flex gap-4 cursor-pointer group transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(8px)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
          >
            <div className="w-12 h-16 rounded-lg flex-shrink-0 flex items-center justify-center transition-all duration-300" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <FileText className="text-gray-500 group-hover:text-white transition-colors" />
            </div>
            <div>
              <h4 className="font-bold text-white">Landing Page</h4>
              <p className="text-sm text-gray-500 mt-1">Make landing page for apps, sites, blog, etc. Add hosting with QR Code</p>
              <span className="text-gray-400 font-medium text-sm mt-2 block group-hover:text-white group-hover:underline transition-colors">Create Landing Page</span>
            </div>
          </div>

          <div
            className="p-6 rounded-xl flex gap-4 cursor-pointer group transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(8px)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
          >
            <div className="w-12 h-16 rounded-lg flex-shrink-0 flex items-center justify-center transition-all duration-300" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span className="text-2xl font-bold text-gray-500 group-hover:text-white transition-colors">%</span>
            </div>
            <div>
              <h4 className="font-bold text-white">Frames</h4>
              <p className="text-sm text-gray-500 mt-1">Save money on designing, using community tested frames</p>
              <span className="text-gray-400 font-medium text-sm mt-2 block group-hover:text-white group-hover:underline transition-colors">Add Your Frame</span>
            </div>
          </div>

          <div
            className="p-6 rounded-xl flex gap-4 cursor-pointer group transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(8px)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
          >
            <div className="w-12 h-16 rounded-lg flex-shrink-0 flex items-center justify-center transition-all duration-300" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <LinkIcon className="text-gray-500 group-hover:text-white transition-colors" />
            </div>
            <div>
              <h4 className="font-bold text-white">Short Link</h4>
              <p className="text-sm text-gray-500 mt-1">Free tool for creating short links for any URL</p>
              <span className="text-gray-400 font-medium text-sm mt-2 block group-hover:text-white group-hover:underline transition-colors">Create Short Link</span>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
