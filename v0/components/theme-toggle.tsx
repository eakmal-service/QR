"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
    const { theme, setTheme, systemTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    // Resolve current theme
    const currentTheme = theme === "system" ? systemTheme : theme
    const isDark = currentTheme === "dark"

    return (
        <div
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center"
            suppressHydrationWarning
        >
            <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className={`
          relative flex items-center w-[120px] h-[48px] rounded-full p-1 
          transition-colors duration-500 ease-in-out overflow-hidden
          ${isDark
                        ? "bg-[#1f2023] border border-black/40 shadow-[inset_0_4px_8px_rgba(0,0,0,0.6)]"
                        : "bg-gray-300 border border-gray-400 shadow-[inset_0_3px_6px_rgba(0,0,0,0.15)]"
                    }
        `}
                aria-label="Toggle theme"
            >
                {/* Background Text Labels */}
                <div className="absolute inset-0 flex justify-between items-center px-4 pointer-events-none font-medium text-[15px] tracking-wide">
                    <span
                        className={`transition-all duration-500 transform ${isDark ? "opacity-0 -translate-x-2" : "opacity-100 translate-x-0 text-gray-500"}`}
                    >
                        Light
                    </span>
                    <span
                        className={`transition-all duration-500 transform ${isDark ? "opacity-100 translate-x-0 text-gray-400" : "opacity-0 translate-x-2"}`}
                    >
                        Dark
                    </span>
                </div>

                {/* The Glass Knob */}
                <div
                    className={`
            absolute top-[4px] bottom-[4px] w-[40px] rounded-full flex items-center justify-center z-20
            transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] 
            bg-white/10 backdrop-blur-xl border border-white/30
            shadow-[0_8px_16px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(255,255,255,0.4)]
            ${isDark ? "translate-x-[72px]" : "translate-x-0"}
          `}
                >
                    {/* Specular Highlights */}
                    <div className="absolute top-1 left-1 w-2.5 h-1.5 rounded-full bg-white/70 blur-[1px] rotate-[-20deg]"></div>
                    <div className="absolute bottom-1 right-2 w-3 h-1 rounded-full bg-black/20 blur-[1px]"></div>

                    {/* Active Icon */}
                    <div className={`transition-opacity duration-300 ${isDark ? 'opacity-100' : 'opacity-0'} absolute inset-0 flex items-center justify-center`}>
                        <Moon className="w-4 h-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] fill-white/20" />
                    </div>
                    <div className={`transition-opacity duration-300 ${!isDark ? 'opacity-100' : 'opacity-0'} absolute inset-0 flex items-center justify-center`}>
                        <Sun className="w-4 h-4 text-yellow-600 drop-shadow-[0_0_4px_rgba(255,200,0,0.4)]" />
                    </div>
                </div>

                {/* Halo Refraction Effect behind the Knob */}
                <div
                    className={`
             absolute top-1/2 -translate-y-1/2 w-[70px] h-[70px] rounded-full bg-white/5 backdrop-blur-[2px] pointer-events-none z-10
             transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
             ${isDark ? "translate-x-[55px]" : "-translate-x-[15px]"}
           `}
                />
            </button>
        </div>
    )
}
