"use client"

import { useState, useEffect } from "react"
import { LeLoLogo } from "./lelo-logo"
import { Button } from "./ui/button"

export function Header() {
    const [mounted, setMounted] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        const handleScroll = () => {
            const currentScrollY = window.scrollY

            setIsScrolled(currentScrollY > 50)

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false)
            } else {
                setIsVisible(true)
            }

            setLastScrollY(currentScrollY)
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [lastScrollY, mounted])

    return (
        <header
            className={`
        fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out
        ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
      `}
        >
            <div
                className={`
          flex items-center justify-center gap-6 px-6 py-3 rounded-2xl border transition-all duration-300
          backdrop-blur-xl shadow-2xl
          ${isScrolled
                        ? "border-white/25 shadow-black/20"
                        : "border-white/20 shadow-black/10"
                    }
        `}
                style={{
                    background: isScrolled
                        ? "linear-gradient(135deg, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.20))"
                        : "linear-gradient(135deg, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0.15))",
                    boxShadow: isScrolled
                        ? "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.25), inset 0 -1px 0 rgba(255, 255, 255, 0.05)"
                        : "0 4px 24px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(255, 255, 255, 0.03)",
                    borderColor: isScrolled ? "rgba(200, 200, 220, 0.35)" : "rgba(200, 200, 220, 0.25)",
                }}
            >
                <div className="transform transition-transform duration-200 hover:scale-105">
                    <LeLoLogo />
                </div>

                <nav className="hidden md:flex items-center gap-1">
                    <a
                        href="#features"
                        className="relative text-foreground/70 hover:text-white transition-all duration-300 px-4 py-2 rounded-xl hover:scale-110 border-0 outline-none"
                        style={{ background: "rgba(255, 255, 255, 0.06)" }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)"
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)"
                        }}
                    >
                        Features
                    </a>
                    <a
                        href="#pricing"
                        className="relative text-foreground/70 hover:text-white transition-all duration-300 px-4 py-2 rounded-xl hover:scale-110"
                        style={{ background: "rgba(255, 255, 255, 0.06)" }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)"
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)"
                        }}
                    >
                        Pricing
                    </a>
                    <a
                        href="#about"
                        className="relative text-foreground/70 hover:text-white transition-all duration-300 px-4 py-2 rounded-xl hover:scale-110"
                        style={{ background: "rgba(255, 255, 255, 0.06)" }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)"
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)"
                        }}
                    >
                        About
                    </a>
                    <a
                        href="#about"
                        className="relative text-foreground/70 hover:text-white transition-all duration-300 px-4 py-2 rounded-xl hover:scale-110"
                        style={{ background: "rgba(255, 255, 255, 0.06)" }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)"
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)"
                        }}
                    >
                        Testimonials
                    </a>
                </nav>

                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-foreground/80 hover:text-foreground hover:bg-foreground/10 transition-all duration-200 rounded-xl border-0"
                    >
                        Sign In
                    </Button>
                    <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground transform transition-all duration-200 hover:scale-105 hover:shadow-lg rounded-xl border-0"
                    >
                        Get Started
                    </Button>
                </div>
            </div>
        </header>
    )
}
