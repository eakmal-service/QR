"use client"

import { useRef, useState } from "react"
import { Button } from "./ui/button"
import { ArrowRight } from "lucide-react"
import { BackgroundPaths } from "./ui/floating-paths"
import Link from "next/link"

export function AnimatedCTASection() {
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      <div className="absolute inset-0">
        <div className="h-full w-full bg-gradient-to-br from-background via-card to-muted">
          <BackgroundPaths />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-zinc-500/10 rounded-full blur-3xl animate-pulse" />
            <div
              className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-500/10 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            />
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "2s" }}
            />
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-background/20" />

      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.4) 70%)",
        }}
      />

      <div className="relative z-10 container mx-auto">
        <div
          className="rounded-2xl p-12 text-center animate-fade-in-up"
          ref={contentRef}
          style={{ animationDelay: "0.3s" }}
        >
          <h2
            className="text-4xl font-bold text-foreground mb-4 drop-shadow-lg animate-fade-in-up"
            style={{ fontFamily: "var(--font-playfair)", animationDelay: "0.5s" }}
          >
            Ready to Transform Your Business?
          </h2>
          <p
            className="text-xl text-foreground/90 mb-8 max-w-2xl mx-auto drop-shadow-md animate-fade-in-up"
            style={{ animationDelay: "0.7s" }}
          >
            Join thousands of companies already using QR.Akmal to streamline their reputation building and getting more reviews.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
            style={{ animationDelay: "0.9s" }}
          >
            <Link href="/generate/url">
              <Button
                size="lg"
                className="relative flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all duration-300 backdrop-blur-[20px] bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/25 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_16px_rgba(0,0,0,0.3)] hover:scale-105 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_0_0_0.375rem_rgba(0,0,0,0.05)] dark:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_0_0_0.375rem_rgba(255,255,255,0.3)]"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="relative flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all duration-300 backdrop-blur-[20px] bg-black/[0.02] dark:bg-white/[0.05] border border-black/5 dark:border-white/20 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_4px_16px_rgba(0,0,0,0.02)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_4px_16px_rgba(0,0,0,0.2)] hover:scale-105 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_0_0_0.375rem_rgba(0,0,0,0.02)] dark:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_0_0.375rem_rgba(255,255,255,0.2)]"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(24px);
            filter: blur(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0px);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  )
}
