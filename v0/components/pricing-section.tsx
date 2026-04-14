"use client"

import { motion } from "framer-motion"
import { Button } from "./ui/button"
import { Check, X, ArrowRight } from "lucide-react"

type Feature = { text: string; included: boolean }
type FeatureGroup = { label?: string; items: Feature[] }

const pricingPlans: {
  name: string
  price: string
  period: string
  description: string
  groups: FeatureGroup[]
  popular: boolean
  cta: string
}[] = [
  {
    name: "Trial",
    price: "₹499",
    period: " (One-time, 3 months)",
    description: "Perfect for testing the platform, small businesses, temporary campaigns",
    popular: false,
    cta: "Get Started",
    groups: [
      {
        items: [
          { text: "250 AI reviews (valid for 3 months)", included: true },
          { text: "5 digital QR codes", included: true },
          { text: "Basic analytics", included: true },
          { text: "4 languages (English, Hindi, Gujarati, Hinglish)", included: true },
          { text: "Email support", included: true },
          { text: "Physical QR stand", included: false },
          { text: "Custom Page", included: false },
        ],
      },
    ],
  },
  {
    name: "Base",
    price: "₹999",
    period: "/annually",
    description: "Perfect for single-location businesses, restaurants, shops, cafes",
    popular: true,
    cta: "Get Started",
    groups: [
      {
        label: "Physical Product",
        items: [
          { text: "1 Premium QR Stand", included: true },
          { text: "Free pan India delivery (5–7 days)", included: true },
        ],
      },
      {
        label: "Digital Features",
        items: [
          { text: "5,000 AI reviews per month", included: true },
          { text: "10 unique digital QR codes", included: true },
          { text: "Advanced analytics dashboard", included: true },
          { text: "Custom Brand Page", included: true },
          { text: "Get reports (PDF) on WhatsApp", included: true },
          { text: "4 languages support", included: true },
          { text: "Email support", included: true },
        ],
      },
    ],
  },
  {
    name: "Premium",
    price: "₹2,999",
    period: "/annually",
    description: "Perfect for multi-location businesses, agencies, growing brands",
    popular: false,
    cta: "Get Started",
    groups: [
      {
        label: "Physical Product",
        items: [
          { text: "2 Premium QR Stands", included: true },
        ],
      },
      {
        label: "Digital Features",
        items: [
          { text: "Free pan India delivery (5–7 days)", included: true },
          { text: "10,000 AI reviews per month (2× more)", included: true },
          { text: "20 unique digital QR codes (3× more)", included: true },
          { text: "Advanced analytics dashboard", included: true },
          { text: "Custom brand Page", included: true },
          { text: "WhatsApp support (priority)", included: true },
          { text: "Export reports (PDF)", included: true },
          { text: "Get reports (PDF) on WhatsApp", included: true },
        ],
      },
    ],
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-4 bg-black">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl font-bold text-white mb-4"
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
            Choose the perfect plan for your business. No hidden fees, no surprises.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative rounded-2xl p-8 backdrop-blur-xl flex flex-col ${
                plan.popular ? "border border-white/30" : "border border-white/15"
              }`}
              style={{
                background: plan.popular
                  ? "linear-gradient(135deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.08))"
                  : "linear-gradient(135deg, rgba(255, 255, 255, 0.10), rgba(255, 255, 255, 0.04))",
                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 4px 24px rgba(0,0,0,0.2)",
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-white text-black px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 text-sm">{plan.period}</span>
                </div>
                <p className="text-gray-300 text-sm">{plan.description}</p>
              </div>

              <div className="flex flex-col gap-6 mb-8 flex-1">
                {plan.groups.map((group, gi) => (
                  <div key={gi}>
                    {group.label && (
                      <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
                        {group.label}
                      </p>
                    )}
                    <ul className="space-y-3">
                      {group.items.map((feature, fi) => (
                        <li key={fi} className="flex items-start gap-3">
                          {feature.included ? (
                            <Check className="h-4 w-4 text-white mt-0.5 flex-shrink-0" />
                          ) : (
                            <X className="h-4 w-4 text-white/25 mt-0.5 flex-shrink-0" />
                          )}
                          <span className={`text-sm ${feature.included ? "text-gray-300" : "text-gray-600"}`}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <Button
                className="w-full text-white border-0 group rounded-xl hover:scale-105 transition-all duration-300"
                size="lg"
                style={{
                  background: plan.popular
                    ? "linear-gradient(135deg, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.10))"
                    : "linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.05))",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 4px 12px rgba(0,0,0,0.2)",
                }}
              >
                {plan.cta}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 mb-4">All plans include pan India delivery on physical products</p>
          <p className="text-sm text-gray-500">
            Need a custom solution?{" "}
            <a href="#" className="text-white hover:underline">
              Contact our team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
