"use client"

import { useEffect, useRef } from "react"
import QRCode from "qrcode"
import { useTheme } from "next-themes"

export function AnimatedQRCode() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number>()
    const { resolvedTheme } = useTheme()
    const themeRef = useRef(resolvedTheme)

    useEffect(() => {
        themeRef.current = resolvedTheme
    }, [resolvedTheme])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")!
        let particles: Array<{
            baseCol: number
            baseRow: number
            x: number
            y: number
            size: number
            opacity: number
            speed: number
            isCorner: boolean
        }> = []

        // Generate real QR code for akmal.in
        const qr = QRCode.create("https://akmal.in", { errorCorrectionLevel: 'M' })
        const gridSize = qr.modules.size

        // Check if a module is in a corner finder pattern (7x7 zones)
        const isCornerModule = (col: number, row: number) => {
            if (col < 7 && row < 7) return true // Top-left
            if (col >= gridSize - 7 && row < 7) return true // Top-right
            if (col < 7 && row >= gridSize - 7) return true // Bottom-left
            return false
        }

        // Initialize particles
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                if (qr.modules.get(col, row)) {
                    particles.push({
                        baseCol: col,
                        baseRow: row,
                        x: window.innerWidth * Math.random(),
                        y: window.innerHeight * Math.random(),
                        size: Math.random() * 3 + 2,
                        opacity: Math.random() * 0.3 + 0.7,
                        speed: Math.random() * 0.05 + 0.03,
                        isCorner: isCornerModule(col, row),
                    })
                }
            }
        }

        let animationId: number
        let time = 0

        const animate = () => {
            // Recalculate dimensions to ensure perfect centering on any screen resize
            const container = canvas.parentElement
            if (container && (canvas.width !== container.clientWidth || canvas.height !== container.clientHeight)) {
                canvas.width = container.clientWidth
                canvas.height = container.clientHeight
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height)
            time += 0.005

            const isDesktop = window.innerWidth > 768
            const targetQRSize = Math.min(canvas.width, canvas.height) * (isDesktop ? 0.6 : 0.7)
            const moduleSize = targetQRSize / gridSize
            const qrSize = gridSize * moduleSize
            
            // Strictly center horizontally
            const offsetX = (canvas.width - qrSize) / 2
            
            // Desktop: shift slightly below center to create space from navbar
            // Mobile: shift up so QR is centered in the empty space above the bottom text
            const offsetY = (canvas.height - qrSize) / 2 - (canvas.height * (isDesktop ? 0.13 : 0.18))

            particles.forEach((particle, index) => {
                const targetX = offsetX + particle.baseCol * moduleSize + moduleSize / 2
                const targetY = offsetY + particle.baseRow * moduleSize + moduleSize / 2

                const dx = targetX - particle.x
                const dy = targetY - particle.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance > 1) {
                    particle.x += dx * particle.speed
                    particle.y += dy * particle.speed
                } else {
                    particle.x = targetX + Math.sin(time + index * 0.1) * 0.5
                    particle.y = targetY + Math.cos(time * 0.7 + index * 0.1) * 0.5
                }

                const pulseOpacity = particle.opacity * (0.9 + Math.sin(time * 1.5 + index * 0.05) * 0.1)

                const isDark = themeRef.current !== "light"
                
                if (particle.isCorner) {
                    ctx.fillStyle = isDark 
                        ? `rgba(255, 255, 255, ${pulseOpacity})`
                        : `rgba(0, 0, 0, ${pulseOpacity})`
                } else {
                    ctx.fillStyle = isDark
                        ? `rgba(180, 180, 190, ${pulseOpacity * 0.8})`
                        : `rgba(80, 80, 90, ${pulseOpacity * 0.8})`
                }
                const half = moduleSize * 0.45
                ctx.fillRect(particle.x - half, particle.y - half, half * 2, half * 2)
            })

            animationId = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId)
            }
        }
    }, [])

    return (
        <div className="w-full h-full absolute inset-0">
            <canvas ref={canvasRef} className="w-full h-full" style={{ background: "transparent" }} />
        </div>
    )
}
