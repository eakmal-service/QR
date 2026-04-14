"use client"

import { useState, useEffect } from "react"
import { LeLoLogo } from "./lelo-logo"
import { Button } from "./ui/button"
import Link from "next/link"
import { useAuth } from "@/components/auth/auth-provider"

export function Header() {
    const [mounted, setMounted] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const { user, isLoading, logout } = useAuth()

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
                        ? "border-black/10 dark:border-white/30 bg-black/5 dark:bg-white/15 shadow-black/5 dark:shadow-black/20"
                        : "border-black/5 dark:border-white/20 bg-black/[0.02] dark:bg-white/10 shadow-transparent dark:shadow-black/10"
                    }
        `}
            >
                <div className="transform transition-transform duration-200 hover:scale-105">
                    <LeLoLogo />
                </div>

                <nav className="hidden md:flex items-center gap-1">
                    <a
                        href="#features"
                        className="relative text-foreground/70 hover:text-foreground transition-all duration-300 px-4 py-2 rounded-xl hover:scale-110 border-0 outline-none bg-black/5 dark:bg-white/[0.06] hover:bg-black/10 dark:hover:bg-white/[0.15]"
                    >
                        Features
                    </a>
                    <a
                        href="#pricing"
                        className="relative text-foreground/70 hover:text-foreground transition-all duration-300 px-4 py-2 rounded-xl hover:scale-110 border-0 outline-none bg-black/5 dark:bg-white/[0.06] hover:bg-black/10 dark:hover:bg-white/[0.15]"
                    >
                        Pricing
                    </a>
                    <a
                        href="#about"
                        className="relative text-foreground/70 hover:text-foreground transition-all duration-300 px-4 py-2 rounded-xl hover:scale-110 border-0 outline-none bg-black/5 dark:bg-white/[0.06] hover:bg-black/10 dark:hover:bg-white/[0.15]"
                    >
                        About
                    </a>
                    <a
                        href="#about"
                        className="relative text-foreground/70 hover:text-foreground transition-all duration-300 px-4 py-2 rounded-xl hover:scale-110 border-0 outline-none bg-black/5 dark:bg-white/[0.06] hover:bg-black/10 dark:hover:bg-white/[0.15]"
                    >
                        Testimonials
                    </a>
                </nav>

                <div className="flex items-center gap-3">
                    {!isLoading && (
                        user ? (
                            <>
                                {user.email === "hanzalaq63@gmail.com" && (
                                    <Link href="/admin">
                                        <Button
                                            size="sm"
                                            className="bg-primary hover:bg-primary/90 text-primary-foreground transform transition-all duration-200 hover:scale-105 hover:shadow-lg rounded-xl border-0 mr-2"
                                        >
                                            Dashboard
                                        </Button>
                                    </Link>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => logout()}
                                    className="text-foreground/80 hover:text-foreground hover:bg-foreground/10 transition-all duration-200 rounded-xl border-0"
                                >
                                    Log Out
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-foreground/80 hover:text-foreground hover:bg-foreground/10 transition-all duration-200 rounded-xl border-0"
                                    >
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button
                                        size="sm"
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground transform transition-all duration-200 hover:scale-105 hover:shadow-lg rounded-xl border-0"
                                    >
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )
                    )}
                </div>
            </div>
        </header>
    )
}
