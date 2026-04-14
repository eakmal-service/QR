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
    period: " / annually",
    description: "Perfect for single-location businesses like restaurants, shops, and cafés",
    popular: true,
    cta: "Get Started",
    groups: [
      {
        label: "Physical Product",
        items: [
          { text: "1 Premium QR Stand", included: true },
          { text: "Free Pan-India delivery (5–7 days)", included: true },
        ],
      },
      {
        label: "Digital Features",
        items: [
          { text: "5,000 AI-generated reviews per month", included: true },
          { text: "10 unique digital QR codes", included: true },
          { text: "Advanced analytics dashboard", included: true },
          { text: "Custom brand page", included: true },
          { text: "Receive PDF reports on WhatsApp", included: true },
          { text: "Support for 4 languages", included: true },
          { text: "Email support", included: true },
        ],
      },
    ],
  },
  {
    name: "Premium",
    price: "₹2,999",
    period: " / annually",
    description: "Perfect for multi-location businesses, agencies, and growing brands",
    popular: false,
    cta: "Get Started",
    groups: [
      {
        label: "Physical Product",
        items: [
          { text: "2 Premium QR Stands", included: true },
          { text: "Free Pan-India delivery (5–7 days)", included: true },
        ],
      },
      {
        label: "Digital Features",
        items: [
          { text: "10,000 AI-generated reviews per month (2× more)", included: true },
          { text: "20 unique digital QR codes (3× more)", included: true },
          { text: "Advanced analytics dashboard", included: true },
          { text: "Custom brand page", included: true },
          { text: "4+ custom language support", included: true },
          { text: "Priority WhatsApp support", included: true },
          { text: "Export reports in PDF format", included: true },
          { text: "Receive PDF reports on WhatsApp", included: true },
        ],
      },
    ],
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-4 bg-transparent transition-colors duration-300">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl font-bold text-foreground mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Choose the perfect plan for your business. No hidden fees, no surprises.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
            className={`glass-card relative rounded-2xl p-8 flex flex-col transition-all duration-300 ${
                plan.popular 
                  ? "ring-2 ring-violet-400/30 dark:ring-white/20 shadow-[0_8px_40px_rgba(147,112,219,0.15)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.4)]"
                  : ""
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-foreground text-background px-4 py-1 rounded-full text-sm font-medium border border-border">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </div>

              <div className="flex flex-col gap-6 mb-8 flex-1">
                {plan.groups.map((group, gi) => (
                  <div key={gi}>
                    {group.label && (
                      <p className="text-xs font-semibold text-muted-foreground/60 dark:text-white/40 uppercase tracking-widest mb-3">
                        {group.label}
                      </p>
                    )}
                    <ul className="space-y-3">
                      {group.items.map((feature, fi) => (
                        <li key={fi} className="flex items-start gap-3">
                          {feature.included ? (
                            <Check className="h-4 w-4 text-foreground mt-0.5 flex-shrink-0" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground/40 dark:text-white/25 mt-0.5 flex-shrink-0" />
                          )}
                          <span className={`text-sm ${feature.included ? "text-foreground/80" : "text-muted-foreground/60"}`}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <Button
                className={`w-full group rounded-xl hover:scale-105 transition-all duration-300 border ${
                  plan.popular 
                    ? "bg-foreground text-background border-transparent hover:bg-foreground/90 shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_4px_12px_rgba(0,0,0,0.2)]" 
                    : "bg-black/5 dark:bg-white/[0.05] text-foreground border-black/10 dark:border-white/20 hover:bg-black/10 dark:hover:bg-white/10 shadow-sm"
                }`}
                size="lg"
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
          <p className="text-muted-foreground mb-4">All plans include pan India delivery on physical products</p>
          <p className="text-sm text-muted-foreground/80">
            Need a custom solution?{" "}
            <a href="#" className="text-foreground hover:underline font-medium">
              Contact our team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
