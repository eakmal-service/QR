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
            <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 bg-transparent backdrop-blur-sm shadow-2xl">
              Smart Review QR
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
