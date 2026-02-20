"use client"

import { Button } from "./ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { AnimatedQRCode } from "./animated-qr-code"
import { GenerateQRButton } from "./ui/generate-qr-button"
import { InfiniteSlider } from "./ui/infinite-slider"
import { ProgressiveBlur } from "./ui/progressive-blur"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-end justify-center pb-8">
      {/* QR Code Background - covers entire section */}
      <div className="absolute inset-0">
        <AnimatedQRCode />
      </div>

      {/* Content on top of QR background - at bottom */}
      <div className="relative z-20 container mx-auto text-center max-w-4xl px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-balance drop-shadow-2xl">
          Jab sabka business grow ho raha hai, toh aap kyun rukhe? <span className="text-gray-300">Aaj hi free trial ke saath apna business grow karein!</span>
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <GenerateQRButton />
          <Link href="/smart-review">
            <button
              className="smart-review-btn"
              style={{
                cursor: "pointer",
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.625rem 1.5rem",
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.08))",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                borderRadius: "0.75rem",
                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 4px 16px rgba(0,0,0,0.3)",
                color: "white",
                fontSize: "1rem",
                fontWeight: 500,
                transition: "all 0.3s ease-in-out",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)"
                e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 0 0 0.375rem rgba(255, 255, 255, 0.3)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)"
                e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 4px 16px rgba(0,0,0,0.3)"
              }}
            >
              Smart Review QR
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
