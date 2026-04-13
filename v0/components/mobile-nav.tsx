"use client"

import { Home, Sparkles, Tag, User } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth/auth-provider"
import { useEffect, useState } from "react"

export function MobileNav() {
  const { user, isLoading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 md:hidden">
      <div 
        className="flex items-center justify-around px-4 py-3 rounded-full border border-white/20 bg-background/30 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] transition-all duration-300"
        style={{
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <Link 
          href="#" 
          className="flex flex-col items-center gap-1 text-foreground/70 hover:text-foreground transition-all duration-300 active:scale-95"
        >
          <div className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium tracking-wide">Home</span>
        </Link>
        
        <Link 
          href="#features" 
          className="flex flex-col items-center gap-1 text-foreground/70 hover:text-foreground transition-all duration-300 active:scale-95"
        >
          <div className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium tracking-wide">Features</span>
        </Link>
        
        <Link 
          href="#pricing" 
          className="flex flex-col items-center gap-1 text-foreground/70 hover:text-foreground transition-all duration-300 active:scale-95"
        >
          <div className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
            <Tag className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium tracking-wide">Pricing</span>
        </Link>

        {isLoading ? (
          <div className="flex flex-col items-center gap-1 text-foreground/40">
            <div className="p-1.5">
              <User className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-[10px] font-medium">...</span>
          </div>
        ) : (
          <Link 
            href={user ? (user.email === "hanzalaq63@gmail.com" ? "/admin" : "/dashboard") : "/login"} 
            className="flex flex-col items-center gap-1 text-foreground/70 hover:text-foreground transition-all duration-300 active:scale-95"
          >
            <div className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
              <User className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium tracking-wide">
              {user ? "Profile" : "Login"}
            </span>
          </Link>
        )}
      </div>
    </div>
  )
}
