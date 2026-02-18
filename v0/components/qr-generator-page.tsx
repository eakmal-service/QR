"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Link as LinkIcon, FileText, Image as ImageIcon, Smartphone,
  Type, MessageSquare, Youtube, Instagram, User, MapPin,
  Wifi, Music, Facebook, Send, Mail, Calendar, Phone,
  Globe, Search, ChevronDown, Check, ArrowRight, X,
  HelpCircle, MoreHorizontal, ShoppingCart, Ticket,
  Laptop
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Footer } from "@/components/footer"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

// Custom Icon for Snapchat - User Provided Filled Image
const SnapchatIcon = ({ className }: { className?: string }) => (
  <div className={`${className} relative flex items-center justify-center`}>
    <img
      src="/snapchat-filled.png"
      alt="Snapchat"
      className="w-full h-full object-contain invert opacity-60 group-hover:opacity-100 transition-opacity"
    />
  </div>
)

// Custom Icon for WhatsApp - User Provided Filled Image
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <div className={`${className} relative flex items-center justify-center`}>
    <img
      src="/whatsapp-filled.png"
      alt="WhatsApp"
      className="w-full h-full object-contain invert opacity-60 group-hover:opacity-100 transition-opacity"
    />
  </div>
)

// Google Suite Data - Kept for reference or filtering logic if needed
const googleTypes = [
  { id: "gforms", label: "Forms", icon: FileText },
  { id: "gdoc", label: "Example Doc", icon: FileText },
  { id: "gsheets", label: "Sheets", icon: FileText },
  { id: "greview", label: "Review", icon: MessageSquare },
]

// QR Types - Featured Layout Data
const featuredTypes = [
  // Row 1
  { id: "url", label: "URL / Link", icon: LinkIcon, colSpan: "col-span-2 md:col-span-6", type: "wide" },
  { id: "pdf", label: "PDF", icon: FileText, colSpan: "col-span-1 md:col-span-3", type: "standard" },
  { id: "image", label: "Image", icon: ImageIcon, colSpan: "col-span-1 md:col-span-3", type: "standard" },

  // Row 2
  { id: "app", label: "Play Market / App Store", icon: Smartphone, colSpan: "col-span-2 md:col-span-3", type: "standard" },
  { id: "text", label: "Text", icon: Type, colSpan: "col-span-1 md:col-span-2", type: "standard" },
  { id: "snapchat", label: "Snapchat", icon: SnapchatIcon, colSpan: "col-span-1 md:col-span-1", type: "icon-only" },
  { id: "whatsapp", label: "WhatsApp", icon: WhatsAppIcon, colSpan: "col-span-2 md:col-span-2 row-span-2", type: "featured" }, // Centerpiece

  { id: "youtube", label: "YouTube", icon: Youtube, colSpan: "col-span-1 md:col-span-1", type: "icon-only" },
  { id: "instagram", label: "Instagram", icon: Instagram, colSpan: "col-span-1 md:col-span-1", type: "icon-only" },
  { id: "vcard", label: "vCard", icon: User, colSpan: "col-span-1 md:col-span-2", type: "standard" },

  // Row 3 (WhatsApp continues here)
  { id: "map", label: "Map", icon: MapPin, colSpan: "col-span-1 md:col-span-2", type: "standard" },
  { id: "wifi", label: "Wi-Fi", icon: Wifi, colSpan: "col-span-1 md:col-span-2", type: "standard" },
  { id: "audio", label: "Audio", icon: Music, colSpan: "col-span-1 md:col-span-2", type: "standard" },

  { id: "facebook", label: "Facebook", icon: Facebook, colSpan: "col-span-1 md:col-span-1", type: "icon-only" },
  { id: "telegram", label: "Telegram", icon: Send, colSpan: "col-span-1 md:col-span-1", type: "icon-only" },
  { id: "email", label: "E-mail", icon: Mail, colSpan: "col-span-1 md:col-span-2", type: "standard" },

  // Row 4
  { id: "booking", label: "Booking", icon: Calendar, colSpan: "col-span-1 md:col-span-3", type: "standard" },
  { id: "phone", label: "Phone Call", icon: Phone, colSpan: "col-span-1 md:col-span-3", type: "standard" },
  { id: "ppt", label: "PPTX", icon: FileText, colSpan: "col-span-1 md:col-span-3", type: "standard" },
  { id: "custom", label: "Custom URL", icon: Globe, colSpan: "col-span-1 md:col-span-3", type: "standard" },
]

// Remaining types (flat list)
const otherTypes = [
  { id: "links", label: "List of Links", icon: LinkIcon },
  { id: "twitter", label: "X (Twitter)", icon: MessageSquare },
  { id: "sms", label: "SMS", icon: MessageSquare },
  { id: "logo", label: "Logo", icon: ImageIcon },
  { id: "office365", label: "Office 365", icon: FileText },
  { id: "shaped", label: "Shaped", icon: ImageIcon },
  { id: "png", label: "PNG", icon: ImageIcon },
  { id: "linkedin", label: "LinkedIn", icon: User },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "social", label: "Social Media", icon: MessageSquare },
  { id: "reddit", label: "Reddit", icon: MessageSquare },
  { id: "file", label: "File", icon: FileText },
  { id: "excel", label: "Excel", icon: FileText },
  { id: "amazon", label: "Amazon", icon: ShoppingCart },
  { id: "barcode", label: "2D-Barcode", icon: FileText },
  { id: "upi", label: "UPI", icon: ShoppingCart },
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
    <div className="min-h-screen bg-black font-sans text-gray-300">

      {/* Top Navbar */}
      <header className="bg-black border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm bg-opacity-80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold text-white">
                ME<span className="text-gray-400">QR</span>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
              <Link href="#" className="hover:text-white transition-colors">About Me-QR</Link>
              <Link href="#" className="hover:text-white transition-colors">QR Scanner</Link>
              <Link href="#" className="hover:text-white transition-colors">Pricing</Link>
              <Link href="#" className="hover:text-white transition-colors">Compare</Link>
              <Link href="#" className="hover:text-white transition-colors">Industries</Link>
              <Link href="#" className="hover:text-white transition-colors">Support</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button className="bg-gray-200 hover:bg-white text-black rounded-md px-6 border border-transparent font-medium transition-all">
              Create QR Code
            </Button>
            <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-900">
              Login
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              EN <ChevronDown className="ml-1 w-3 h-3" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">

        {/* Choose Type Section */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-white">All Types Of QR Codes</h1>

            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Insert Type"
                className="pl-9 pr-24 w-full md:w-80 bg-zinc-900 text-gray-200 border border-gray-800 h-11 rounded-lg focus-visible:ring-1 focus-visible:ring-gray-500 placeholder:text-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button className="absolute right-1 top-1 bottom-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md px-4 h-auto border border-gray-700">Search</Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-12 gap-4 auto-rows-[minmax(80px,auto)]">

            {/* Show featured grid only if not searching, or filter them */}
            {(!isSearching ? featuredTypes : [...featuredTypes, ...otherTypes].filter(t => t.label.toLowerCase().includes(searchQuery.toLowerCase()))).map((type) => (
              <motion.button
                key={type.id}
                whileHover={{ y: -2 }}
                onClick={() => router.push(`/generate/${type.id}`)}
                className={`
                  relative group overflow-hidden rounded-xl border bg-black text-left transition-all hover:bg-zinc-900 border-gray-800
                  ${(type as any).colSpan || 'col-span-1 md:col-span-3'} 
                  ${(type as any).rowSpan || ''}
                  ${(type as any).type === 'featured' ? 'bg-zinc-900 border-none flex flex-col items-center justify-center p-6 gap-4 h-full' : ''}
                  ${(type as any).type === 'google-grid' ? 'bg-zinc-950 border-gray-800 flex flex-col p-4' : ''}
                  ${(type as any).type === 'standard' || (type as any).type === 'wide' ? 'p-4 flex items-center justify-between h-20' : ''}
                  ${(type as any).type === 'icon-only' ? 'flex items-center justify-center p-4 h-20' : ''}
                  ${(type as any).type === 'vertical' ? 'flex flex-col items-center justify-center p-4 gap-2 h-full' : ''}
                `}
              >
                {(type as any).type === 'featured' ? (
                  // WhatsApp / Featured Layout (Centerpiece)
                  <>
                    <div className="bg-[#25D366] p-4 rounded-full text-white shadow-lg mb-2 group-hover:scale-110 transition-transform">
                      <type.icon className="w-10 h-10 text-white" />
                    </div>
                    <span className="font-semibold text-gray-200 text-lg">{type.label}</span>
                  </>
                ) : (type as any).type === 'google-grid' ? (
                  // Google Suite 2x2 Grid
                  <div className="w-full h-full flex flex-col">
                    <div className="text-gray-400 font-semibold mb-3 text-sm flex items-center gap-2">
                      <type.icon className="w-4 h-4 text-gray-500" />
                      {type.label}
                    </div>
                    <div className="grid grid-cols-2 gap-2 flex-grow">
                      {googleTypes.map(gType => (
                        <div key={gType.id} className="bg-zinc-900 rounded-lg flex flex-col items-center justify-center p-2 gap-1 hover:bg-zinc-800 transition-colors border border-gray-800">
                          <gType.icon className="w-5 h-5 text-gray-400" />
                          <span className="text-[10px] text-gray-500 text-center">{gType.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (type as any).type === 'vertical' ? (
                  // Vertical Icon + Label (Standard 1x1)
                  <>
                    <type.icon className="w-8 h-8 text-gray-500 group-hover:scale-110 group-hover:text-white transition-all" />
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white">{type.label}</span>
                  </>
                ) : (type as any).type === 'icon-only' ? (
                  // Small Social Card (Square)
                  <type.icon className="w-8 h-8 text-gray-500 group-hover:scale-110 group-hover:text-white transition-all" />
                ) : (
                  // Standard Card (Horizontal)
                  <>
                    <div className="flex items-center gap-3">
                      <type.icon className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                      <span className="font-medium text-gray-300 group-hover:text-white transition-colors whitespace-nowrap">{type.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-gray-800 group-hover:text-gray-600 transition-colors" />
                      <div className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
                        <ArrowRight className="w-3 h-3 text-gray-500 group-hover:text-white" />
                      </div>
                    </div>
                  </>
                )}
              </motion.button>
            ))}

            {/* View More Expander */}
            {!isSearching && !showAllTypes && (
              <div className="col-span-2 md:col-span-12 flex justify-center mt-8">
                <Button
                  variant="ghost"
                  onClick={() => setShowAllTypes(true)}
                  className="text-gray-500 hover:text-white hover:bg-transparent gap-2"
                >
                  View More Types <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Expanded List */}
            {showAllTypes && !isSearching && otherTypes.map((type) => (
              <motion.button
                key={type.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ y: -2 }}
                onClick={() => router.push(`/generate/${type.id}`)}
                className="col-span-2 md:col-span-3 rounded-xl border border-gray-800 bg-black p-4 h-20 flex items-center justify-between hover:bg-zinc-900 hover:border-gray-600 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <type.icon className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                  <span className="font-medium text-gray-300 group-hover:text-white transition-colors">{type.label}</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
                  <ArrowRight className="w-3 h-3 text-gray-500 group-hover:text-white" />
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* QR Code Landing Page Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">QR Code landing page</h2>
            <div className="flex gap-4">
              <div className="bg-black border border-gray-800 rounded-md px-4 py-2 flex items-center gap-2 text-sm text-gray-400 min-w-[200px] justify-between cursor-pointer hover:border-gray-500 transition-colors">
                <span>Same Funky Templates</span>
                <X className="w-3 h-3 text-gray-600" />
              </div>
              <Button className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700">Search</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="bg-zinc-950 p-6 rounded-2xl border border-gray-800 hover:shadow-lg hover:shadow-gray-900/50 transition-all hover:border-gray-600">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-200">{template.title}</h3>
                  <ArrowRight className="w-4 h-4 text-gray-500" />
                </div>
                <div className={`aspect-[2/3] rounded-xl overflow-hidden relative group ${template.color}`}>
                  <img
                    src={template.image}
                    alt={template.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" className="w-full bg-gray-200 text-black hover:bg-white border-none font-medium">
                      Use Template
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-white' : 'bg-gray-800'}`} />
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16 bg-zinc-950 rounded-3xl p-8 md:p-12 shadow-sm border border-gray-800">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>

          <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-xl px-4 data-[state=open]:bg-zinc-900 border-gray-800">
                <AccordionTrigger className="text-lg font-medium py-6 hover:no-underline text-gray-200 hover:text-white transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Support & Promo Cards */}
        <section className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-zinc-950 p-8 rounded-2xl flex items-center justify-between border border-gray-800 group hover:border-gray-600 transition-colors">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-black rounded-full shadow-sm border border-gray-800">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Need Help?</h3>
                <p className="text-gray-400 text-sm max-w-[250px]">
                  Get help choosing the types of QR Code if you don't know which one to use?
                </p>
              </div>
            </div>
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-white hover:text-black transition-all">
              Contact Us
            </Button>
          </div>

          <div className="bg-zinc-950 p-8 rounded-2xl flex items-center justify-between border border-gray-800 group hover:border-gray-600 transition-colors">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-black rounded-full shadow-sm border border-gray-800">
                <MoreHorizontal className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Different QR Code Types</h3>
                <p className="text-gray-400 text-sm max-w-[300px]">
                  A QR code is a matrix barcode readable by mobile devices.
                </p>
              </div>
            </div>
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-white hover:text-black transition-all">
              Read More
            </Button>
          </div>
        </section>

        {/* Business Promo Section */}
        <section className="grid md:grid-cols-2 gap-8 mb-20">
          {/* Me-Pos Card */}
          <div className="bg-zinc-950 rounded-3xl p-8 border border-gray-800 shadow-sm overflow-hidden relative">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-3 rounded-full border border-white flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
                <span className="font-bold text-gray-200">Me-Pos</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4 leading-tight">
                Me-Pos: Run Your Business Easy and Free
              </h3>
              <p className="text-gray-400 mb-8 max-w-sm">
                Our vision is to build solutions for businesses of sales, retail, no one personnel in usage fees.
              </p>
              <div className="flex gap-4 mb-12">
                <Button className="bg-white hover:bg-gray-200 px-8 text-black font-semibold">Try For Free</Button>
                <Button variant="link" className="text-white underline decoration-gray-500 hover:decoration-white">Generate QR for Menu</Button>
              </div>
            </div>

            <div className="mt-8 border border-gray-800 rounded-t-xl bg-black shadow-xl mx-auto max-w-[90%] overflow-hidden">
              <div className="h-4 bg-zinc-900 border-b border-gray-800 flex items-center gap-1 px-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
              </div>
              <div className="p-4 grid grid-cols-3 gap-2 bg-black">
                {/* Mock UI Elements */}
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-zinc-900 h-20 rounded shadow-sm border border-gray-800"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Ticket Card */}
          <div className="bg-zinc-950 rounded-3xl p-8 border border-gray-800 shadow-sm overflow-hidden relative">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 text-white">
                <Ticket className="w-5 h-5" />
                <span className="font-bold">ME-TICKET</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4 leading-tight">
                Upgrade Your Tickets with QR Code for Easy Check-in
              </h3>
              <p className="text-gray-400 mb-8 max-w-sm">
                ME-Ticket is a platform for selling tickets. Create an event, generate tickets with QR codes and enjoy refunds.
              </p>
              <div className="flex gap-4 mb-12">
                <Button className="bg-white hover:bg-gray-200 px-8 text-black font-semibold">Create Event</Button>
                <Button variant="link" className="text-white underline decoration-gray-500 hover:decoration-white">Generate QR for Ticket</Button>
              </div>
            </div>

            <div className="mt-8 border border-gray-800 rounded-t-xl bg-black shadow-xl mx-auto max-w-[90%] overflow-hidden">
              <div className="h-4 bg-zinc-900 border-b border-gray-800 flex items-center leading-none px-2 text-[8px] text-gray-500">
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
          <div className="bg-zinc-950 p-6 rounded-xl border border-gray-800 flex gap-4 hover:border-gray-500 transition-colors cursor-pointer group">
            <div className="w-12 h-16 border border-gray-800 rounded bg-black flex-shrink-0 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
              <FileText className="text-gray-500 group-hover:text-black" />
            </div>
            <div>
              <h4 className="font-bold text-white">Landing Page</h4>
              <p className="text-sm text-gray-500 mt-1">Make landing page for apps, sites, blog, etc. Add hosting with QR Code</p>
              <span className="text-gray-300 font-medium text-sm mt-2 block group-hover:underline">Create Landing Page</span>
            </div>
          </div>

          <div className="bg-zinc-950 p-6 rounded-xl border border-gray-800 flex gap-4 hover:border-gray-500 transition-colors cursor-pointer group">
            <div className="w-12 h-16 border border-gray-800 rounded bg-black flex-shrink-0 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
              <span className="text-2xl font-bold text-gray-500 group-hover:text-black">%</span>
            </div>
            <div>
              <h4 className="font-bold text-white">Frames</h4>
              <p className="text-sm text-gray-500 mt-1">Save money on designing, using community tested frames</p>
              <span className="text-gray-300 font-medium text-sm mt-2 block group-hover:underline">Add Your Frame</span>
            </div>
          </div>

          <div className="bg-zinc-950 p-6 rounded-xl border border-gray-800 flex gap-4 hover:border-gray-500 transition-colors cursor-pointer group">
            <div className="w-12 h-16 border border-gray-800 rounded bg-black flex-shrink-0 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
              <LinkIcon className="text-gray-500 group-hover:text-black" />
            </div>
            <div>
              <h4 className="font-bold text-white">Short Link</h4>
              <p className="text-sm text-gray-500 mt-1">Free tool for creating short links for any URL</p>
              <span className="text-gray-300 font-medium text-sm mt-2 block group-hover:underline">Create Short Link</span>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
