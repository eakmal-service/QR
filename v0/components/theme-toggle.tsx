"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
    const { theme, setTheme, systemTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)
    const pathname = usePathname()

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null
    if (pathname?.startsWith('/visit/')) return null

    // Resolve current theme
    const currentTheme = theme === "system" ? systemTheme : theme
    const isDark = currentTheme === "dark"

    return (
        <div
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center pointer-events-auto"
            suppressHydrationWarning
        >
            <div className="relative" style={{ transform: 'scale(0.35)', transformOrigin: 'bottom right' }}>
                <svg className="hidden">
                    <filter id="lens-distortion">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                    </filter>
                </svg>

                <div
                    onClick={() => setTheme(isDark ? "light" : "dark")}
                    className={`relative w-[320px] h-[110px] rounded-[55px] cursor-pointer flex items-center transition-all duration-700 ${isDark
                            ? 'bg-[#1e1e22] shadow-[inset_0_10px_20px_rgba(0,0,0,0.6),0_1px_2px_rgba(255,255,255,0.05)]'
                            : 'bg-[#e2e8f0] shadow-[inset_0_10px_20px_rgba(0,0,0,0.1),0_1px_2px_rgba(255,255,255,0.8)]'
                        }`}
                >
                    {/* Background Text */}
                    <div className="absolute inset-0 flex items-center justify-between px-12 select-none">
                        <span className={`text-2xl font-bold tracking-tight transition-all duration-700 ${isDark ? 'text-white opacity-100 scale-110 translate-x-0' : 'text-gray-400 opacity-20 -translate-x-4'
                            }`}>
                            Dark
                        </span>
                        <span className={`text-2xl font-bold tracking-tight transition-all duration-700 ${!isDark ? 'text-slate-800 opacity-100 scale-110 translate-x-0' : 'text-gray-500 opacity-20 translate-x-4'
                            }`}>
                            Light
                        </span>
                    </div>

                    {/* The "Glass Sphere" Thumb */}
                    <div
                        className={`absolute z-20 w-[100px] h-[100px] rounded-full transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-center ${isDark ? 'translate-x-[210px]' : 'translate-x-[10px]'
                            } hover:scale-105`}
                        style={{
                            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
                            backdropFilter: 'blur(12px) brightness(1.1) saturate(120%)',
                            WebkitBackdropFilter: 'blur(12px) brightness(1.1) saturate(120%)',
                            boxShadow: isDark
                                ? '0 20px 40px rgba(0,0,0,0.7), inset 0 0 15px rgba(255,255,255,0.15), inset 0 2px 5px rgba(255,255,255,0.3)'
                                : '0 20px 40px rgba(0,0,0,0.15), inset 0 0 15px rgba(255,255,255,0.4), inset 0 2px 5px rgba(255,255,255,0.6)',
                            border: '0.5px solid rgba(255, 255, 255, 0.4)'
                        }}
                    >
                        {/* Edge Refraction / Caustics Effect */}
                        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                            <div className="absolute -top-2 -left-2 w-full h-full bg-gradient-to-br from-white/30 to-transparent blur-[4px]" />
                            <div className="absolute -bottom-2 -right-2 w-full h-full bg-gradient-to-tl from-black/20 to-transparent blur-[4px]" />
                        </div>

                        {/* Central Icon with Glow */}
                        <div className="relative z-30 transition-transform duration-500 pointer-events-none">
                            <div className={`transition-all duration-700 ${isDark ? 'rotate-180 scale-0 opacity-0' : 'rotate-0 scale-125 opacity-100'}`}>
                                <Sun size={38} className="text-white fill-white/10" strokeWidth={1.5} />
                            </div>
                            <div className={`absolute top-0 left-0 transition-all duration-700 ${isDark ? 'rotate-0 scale-125 opacity-100' : '-rotate-180 scale-0 opacity-0'}`}>
                                <Moon size={38} className="text-white fill-white/10" strokeWidth={1.5} />
                            </div>
                        </div>

                        {/* Lens Specular Reflection */}
                        <div className="absolute top-[10%] left-[20%] w-[35%] h-[20%] bg-white/40 rounded-[100%] blur-[1px] rotate-[-25deg] pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    )
}
