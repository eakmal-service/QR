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
    <section className="relative overflow-hidden min-h-screen flex items-end justify-center pb-24 md:pb-32">
      {/* QR Code Background - covers entire section */}
      <div className="absolute inset-0">
        <AnimatedQRCode />
      </div>

      {/* Content on top of QR background - at bottom */}
      <div className="relative z-20 container mx-auto text-center max-w-4xl px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-balance drop-shadow-2xl">
          You built something great. <span className="text-muted-foreground">Don't let zero reviews be the reason they walked away.</span>
        </h2>

        <div className="flex flex-row gap-2 sm:gap-4 justify-center items-center w-full max-w-full">
          <GenerateQRButton />
          <Link href="/smart-review">
            <button
              className="relative flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all duration-300 backdrop-blur-[20px] bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/25 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_16px_rgba(0,0,0,0.3)] hover:scale-105 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_0_0_0.375rem_rgba(0,0,0,0.05)] dark:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_0_0_0.375rem_rgba(255,255,255,0.3)]"
            >
              Smart Review QR
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
