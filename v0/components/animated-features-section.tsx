"use client"

import type React from "react"
import { motion } from "framer-motion"
import { AnimatedGradient } from "@/components/ui/animated-gradient-with-svg"
import { useTheme } from "next-themes"

interface BentoCardProps {
  title: string
  value: string | number
  subtitle?: string
  colors: string[]
  delay: number
}

const BentoCard: React.FC<BentoCardProps> = ({ title, value, subtitle, colors, delay }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: delay + 0.3 },
    },
  }
  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      className="relative overflow-hidden h-full bg-black rounded-lg border border-border/20 group"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      style={{ filter: "url(#noise)" }}
    >
      <AnimatedGradient colors={colors} speed={0.05} blur="medium" />

      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: "256px 256px",
            mixBlendMode: "overlay",
          }}
        />
      </div>

      {/* Shine sweep */}
      <div className="absolute inset-0 opacity-80 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full animate-[shine_4s_ease-in-out_infinite] w-[200%]" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 p-3 sm:p-5 md:p-8 text-foreground backdrop-blur-sm h-full flex flex-col justify-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.h3 className="text-sm sm:text-base md:text-lg text-foreground mb-2" variants={item}>
          {title}
        </motion.h3>
        <motion.p className="text-2xl sm:text-4xl md:text-5xl font-medium mb-4 text-foreground" variants={item}>
          {value}
        </motion.p>
        {subtitle && (
          <motion.p className="text-sm text-foreground/80" variants={item}>
            {subtitle}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  )
}

export function AnimatedFeaturesSection() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== "light"

  // Light: soft pastels with purple/indigo tones for glassmorphism depth
  // Dark: subtle near-blacks for original look
  const getColors = (baseDark: string[], baseLight: string[]) =>
    isDark ? baseDark : baseLight

  return (
    <section id="features" className="py-20 px-4 bg-transparent transition-colors duration-300">
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="noise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence baseFrequency="0.4" numOctaves="2" result="noise" seed="2" type="fractalNoise" />
            <feColorMatrix in="noise" type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="discrete" tableValues="0.02 0.04 0.06" />
            </feComponentTransfer>
            <feComposite operator="over" in2="SourceGraphic" />
          </filter>
        </defs>
      </svg>
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.p
            className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-3"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Everything you need
          </motion.p>
          <motion.h2
            className="text-4xl font-bold text-foreground mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            Powerful Features
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Everything you need to take your business to the next level
          </motion.p>
        </div>

        {/* Mobile View */}
        <div className="md:hidden grid grid-cols-2 gap-3 w-full pb-6 auto-rows-fr">
          <div className="row-span-2 h-full">
            <BentoCard
              title="BRAND PAGE"
              value="Your page, your way"
              subtitle="Logo, Services, Product — everything on one smart link"
              colors={getColors(["#1a1a1a", "#2a2a2a", "#1f1f1f"], ["#ffffff", "#f5f5f7", "#e8e8ea", "#f0f0f2"])}
              delay={0.1}
            />
          </div>
          <div className="col-span-1 h-full min-h-[140px]">
            <BentoCard
              title="ZERO FRICTION"
              value="1-tap flow"
              subtitle="No login needed"
              colors={getColors(["#151515", "#252525", "#1d1d1d"], ["#ffffff", "#f8f8fa", "#ebebed", "#f2f2f4"])}
              delay={0.2}
            />
          </div>
          <div className="col-span-1 h-full min-h-[140px]">
            <BentoCard
              title="REAL-TIME"
              value="Live stream"
              subtitle="Review appears as it's typed"
              colors={getColors(["#1c1c1c", "#2c2c2c", "#181818"], ["#f5f5f7", "#ffffff", "#e8e8ea", "#f0f0f2"])}
              delay={0.3}
            />
          </div>
          <div className="col-span-2 h-full min-h-[160px]">
            <BentoCard
              title="PHYSICAL PRODUCT"
              value="Standee included"
              subtitle="Pan-India delivery • Table-ready QR stand"
              colors={getColors(["#171717", "#272727", "#1b1b1b"], ["#ffffff", "#f2f2f4", "#e8e8ea", "#f8f8fa"])}
              delay={0.4}
            />
          </div>
          <div className="col-span-1 h-full min-h-[160px]">
            <BentoCard
              title="GOOGLE VERIFIED"
              value="Direct to Maps"
              subtitle="No fake reviews"
              colors={getColors(["#131313", "#232323", "#191919"], ["#f0f0f2", "#e8e8ea", "#f8f8fa", "#ffffff"])}
              delay={0.5}
            />
          </div>
          <div className="col-span-1 h-full min-h-[160px]">
            <BentoCard
              title="GET STARTED"
              value="Starts at ₹499"
              subtitle="One-time trial, no commitment"
              colors={getColors(["#1a1a1a", "#2a2a2a", "#1f1f1f"], ["#f5f5f7", "#ffffff", "#f0f0f2", "#e8e8ea"])}
              delay={0.6}
            />
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:grid grid-cols-3 gap-4 h-[750px]">
          <div className="md:col-span-2">
            <BentoCard
              title="BRAND PAGE"
              value="Your page, your way"
              subtitle="Logo, Services, Product — everything on one smart link"
              colors={getColors(["#1a1a1a", "#2a2a2a", "#1f1f1f"], ["#ffffff", "#f5f5f7", "#e8e8ea", "#f0f0f2"])}
              delay={0.2}
            />
          </div>
          <BentoCard
            title="ZERO FRICTION"
            value="1-tap flow"
            subtitle="No login needed"
            colors={getColors(["#151515", "#252525", "#1d1d1d"], ["#ffffff", "#f8f8fa", "#ebebed", "#f2f2f4"])}
            delay={0.4}
          />
          <BentoCard
            title="REAL-TIME"
            value="Live stream"
            subtitle="Review appears as it's typed"
            colors={getColors(["#1c1c1c", "#2c2c2c", "#181818"], ["#f5f5f7", "#e8e8ea", "#ffffff", "#f0f0f2"])}
            delay={0.6}
          />
          <div className="md:col-span-2">
            <BentoCard
              title="PHYSICAL PRODUCT"
              value="Standee included"
              subtitle="Pan-India delivery • Table-ready QR stand"
              colors={getColors(["#171717", "#272727", "#1b1b1b"], ["#ffffff", "#f2f2f4", "#e8e8ea", "#f8f8fa"])}
              delay={0.8}
            />
          </div>
          <div className="md:col-span-1">
            <BentoCard
              title="GOOGLE VERIFIED"
              value="Direct to Maps"
              subtitle="No fake reviews"
              colors={getColors(["#131313", "#232323", "#191919"], ["#f0f0f2", "#e8e8ea", "#f8f8fa", "#ffffff"])}
              delay={1.0}
            />
          </div>
          <div className="md:col-span-2">
            <BentoCard
              title="GET STARTED"
              value="Starts at ₹499"
              subtitle="One-time trial, no commitment"
              colors={getColors(["#1a1a1a", "#2a2a2a", "#1f1f1f"], ["#f5f5f7", "#ffffff", "#f0f0f2", "#e8e8ea"])}
              delay={1.2}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

