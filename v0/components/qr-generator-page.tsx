"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Home, ArrowLeft, ArrowRight, Check, ChevronDown, Sparkles, Zap, Shield, Download, Palette, QrCode } from "lucide-react"
import { QRGeneratorModal } from "@/components/qr-generator-modal"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"

// QR Code Examples for Gallery
const qrExamples = [
    { id: 1, title: "Restaurant Menu", color: "from-purple-500/20 to-pink-500/20" },
    { id: 2, title: "Business Card", color: "from-blue-500/20 to-cyan-500/20" },
    { id: 3, title: "Event Ticket", color: "from-green-500/20 to-emerald-500/20" },
    { id: 4, title: "Product Link", color: "from-orange-500/20 to-red-500/20" },
    { id: 5, title: "WiFi Access", color: "from-indigo-500/20 to-purple-500/20" },
    { id: 6, title: "Payment UPI", color: "from-yellow-500/20 to-orange-500/20" },
]

// Features
const features = [
    {
        icon: Palette,
        title: "Full Customization",
        description: "Customize colors, add logos, choose frames, and create unique QR codes that match your brand perfectly."
    },
    {
        icon: Download,
        title: "Multiple Formats",
        description: "Download your QR codes in JPG, PNG, SVG, or PDF formats for any use case."
    },
    {
        icon: Zap,
        title: "Instant Generation",
        description: "Create professional QR codes in seconds with our lightning-fast generator."
    },
    {
        icon: Shield,
        title: "Secure & Reliable",
        description: "Your data is safe with us. All QR codes are generated securely and reliably."
    },
]

// Pricing Plans
const pricingPlans = [
    {
        name: "Free",
        price: "₹0",
        period: "/month",
        description: "Perfect for trying out",
        features: ["5 QR codes/month", "Basic customization", "PNG & JPG downloads", "Standard support"],
        popular: false,
    },
    {
        name: "Pro",
        price: "₹499",
        period: "/month",
        description: "Best for businesses",
        features: ["Unlimited QR codes", "Full customization", "All formats (PNG, JPG, SVG, PDF)", "Priority support", "Analytics dashboard", "Custom branding"],
        popular: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        period: "",
        description: "For large organizations",
        features: ["Everything in Pro", "API access", "White-label solution", "Dedicated support", "Custom integrations", "SLA guarantee"],
        popular: false,
    },
]

// FAQs
const faqs = [
    {
        question: "What types of QR codes can I create?",
        answer: "You can create QR codes for websites, UPI payments, WiFi access, business cards, event tickets, and much more. Our generator supports all standard QR code types."
    },
    {
        question: "Can I customize the design of my QR codes?",
        answer: "Yes! You can customize colors, add your logo, choose different frames, adjust corner styles, and more to create QR codes that perfectly match your brand."
    },
    {
        question: "What formats can I download QR codes in?",
        answer: "You can download your QR codes in JPG, PNG, SVG, and PDF formats. SVG and PDF are perfect for printing at any size without quality loss."
    },
    {
        question: "Are the QR codes permanent?",
        answer: "Yes, all generated QR codes are permanent and will work forever. They contain the data directly, so they don't rely on our servers."
    },
    {
        question: "Can I track scans of my QR codes?",
        answer: "With our Pro and Enterprise plans, you get access to analytics that show you how many times your QR codes have been scanned, when, and from where."
    },
]

export function QRGeneratorPage() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

    const toggleFAQ = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index)
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2 hover:text-gray-300 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                            <span className="text-sm">Back to Home</span>
                        </Link>
                        <div className="h-6 w-px bg-gray-700" />
                        <h1 className="text-2xl font-bold">QR Code Generator</h1>
                    </div>
                    <Link href="/" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                        <Home className="w-5 h-5" />
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                    </div>
                </div>

                <div className="relative z-10 container mx-auto text-center max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
                            Create Stunning QR Codes
                            <br />
                            <span className="text-gray-400">In Seconds</span>
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            Generate professional, customizable QR codes for your business. Add logos, choose colors, and download in multiple formats.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                className="bg-white text-black hover:bg-white/90 group"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <Sparkles className="mr-2 h-5 w-5" />
                                Generate QR Code Now
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                                View Examples
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 bg-black">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <motion.h2
                            className="text-4xl font-bold mb-4"
                            style={{ fontFamily: "var(--font-playfair)" }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            Powerful Features
                        </motion.h2>
                        <motion.p
                            className="text-xl text-gray-300 max-w-2xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            Everything you need to create professional QR codes
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="bg-card/50 border border-border/20 rounded-lg p-6 hover:bg-white/5 transition-all hover:scale-105"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <feature.icon className="w-12 h-12 mb-4 text-white" />
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-gray-400">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* QR Gallery Section */}
            <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <motion.h2
                            className="text-4xl font-bold mb-4"
                            style={{ fontFamily: "var(--font-playfair)" }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            QR Code Gallery
                        </motion.h2>
                        <motion.p
                            className="text-xl text-gray-300 max-w-2xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            See what's possible with our QR code generator
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {qrExamples.map((example, index) => (
                            <motion.div
                                key={example.id}
                                className="relative group"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className={`aspect-square rounded-lg bg-gradient-to-br ${example.color} border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform`}>
                                    <QrCode className="w-16 h-16 text-white/80" />
                                </div>
                                <p className="text-center mt-2 text-sm text-gray-400">{example.title}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-20 px-4 bg-black">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <motion.h2
                            className="text-4xl font-bold mb-4"
                            style={{ fontFamily: "var(--font-playfair)" }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            Simple, Transparent Pricing
                        </motion.h2>
                        <motion.p
                            className="text-xl text-gray-300 max-w-2xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            Choose the perfect plan for your needs
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {pricingPlans.map((plan, index) => (
                            <motion.div
                                key={plan.name}
                                className={`relative bg-card border rounded-lg p-8 ${plan.popular ? "border-white/30 bg-white/5 scale-105" : "border-border/20 bg-background/50"
                                    }`}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5 }}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-white text-black px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
                                    </div>
                                )}

                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                    <div className="mb-4">
                                        <span className="text-4xl font-bold">{plan.price}</span>
                                        <span className="text-gray-400">{plan.period}</span>
                                    </div>
                                    <p className="text-gray-300">{plan.description}</p>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center text-gray-300">
                                            <Check className="h-5 w-5 text-white mr-3 flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    className={`w-full ${plan.popular
                                            ? "bg-white text-black hover:bg-white/90"
                                            : "bg-transparent border border-white/20 text-white hover:bg-white/10"
                                        } group`}
                                    size="lg"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-16">
                        <motion.h2
                            className="text-4xl font-bold mb-4"
                            style={{ fontFamily: "var(--font-playfair)" }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            Frequently Asked Questions
                        </motion.h2>
                        <motion.p
                            className="text-xl text-gray-300 max-w-2xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            Everything you need to know about our QR code generator
                        </motion.p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                className="border border-border/20 rounded-lg bg-card/50 backdrop-blur-sm"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <button
                                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors rounded-lg"
                                    onClick={() => toggleFAQ(index)}
                                >
                                    <span className="text-lg font-medium pr-4">{faq.question}</span>
                                    <ChevronDown
                                        className={`h-5 w-5 text-gray-400 transition-transform flex-shrink-0 ${openFaqIndex === index ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                <motion.div
                                    initial={false}
                                    animate={{
                                        height: openFaqIndex === index ? "auto" : 0,
                                        opacity: openFaqIndex === index ? 1 : 0,
                                    }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-6 pb-4">
                                        <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                    </div>
                </div>

                <div className="relative z-10 container mx-auto text-center">
                    <motion.h2
                        className="text-4xl font-bold mb-4"
                        style={{ fontFamily: "var(--font-playfair)" }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        Ready to Create Your QR Code?
                    </motion.h2>
                    <motion.p
                        className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        Join thousands of businesses using our QR code generator to grow their reach
                    </motion.p>
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <Button
                            size="lg"
                            className="bg-white text-black hover:bg-white/90 group"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Start Generating Free
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                            Contact Sales
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <Footer />

            {/* QR Generator Modal */}
            <QRGeneratorModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
        </div>
    )
}
