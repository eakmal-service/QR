"use client"

import { useEffect, useRef } from "react"
import QRCode from "qrcode"

export function AnimatedQRCode() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number>()

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")!
        const particles: Array<{
            x: number
            y: number
            targetX: number
            targetY: number
            size: number
            opacity: number
            speed: number
            isCorner: boolean
        }> = []

        const resizeCanvas = () => {
            const container = canvas.parentElement
            if (container) {
                canvas.width = container.clientWidth
                canvas.height = container.clientHeight
            }
        }

        resizeCanvas()

        // Generate real QR code for akmal.in
        const qr = QRCode.create("https://akmal.in", { errorCorrectionLevel: 'M' })
        const gridSize = qr.modules.size

        // Calculate size to fit nicely in container
        const isDesktop = window.innerWidth > 768
        const targetQRSize = Math.min(canvas.width, canvas.height) * (isDesktop ? 0.6 : 0.5)
        const moduleSize = targetQRSize / gridSize
        const qrSize = gridSize * moduleSize
        const offsetX = (canvas.width - qrSize) / 2
        const offsetY = (canvas.height - qrSize) / 2 - (isDesktop ? canvas.height * 0.1 : 0)

        // Check if a module is in a corner finder pattern (7x7 zones)
        const isCornerModule = (col: number, row: number) => {
            // Top-left
            if (col < 7 && row < 7) return true
            // Top-right
            if (col >= gridSize - 7 && row < 7) return true
            // Bottom-left
            if (col < 7 && row >= gridSize - 7) return true
            return false
        }

        // Create particles for each black module in QR code
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                if (qr.modules.get(col, row)) {
                    const targetX = offsetX + col * moduleSize + moduleSize / 2
                    const targetY = offsetY + row * moduleSize + moduleSize / 2

                    particles.push({
                        x: canvas.width * Math.random(),
                        y: canvas.height * Math.random(),
                        targetX,
                        targetY,
                        size: Math.random() * 3 + 2,
                        opacity: Math.random() * 0.3 + 0.7,
                        speed: Math.random() * 0.05 + 0.03,
                        isCorner: isCornerModule(col, row),
                    })
                }
            }
        }

        let time = 0

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            time += 0.005

            particles.forEach((particle, index) => {
                const dx = particle.targetX - particle.x
                const dy = particle.targetY - particle.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance > 1) {
                    particle.x += dx * particle.speed
                    particle.y += dy * particle.speed
                } else {
                    // Subtle floating animation once settled
                    particle.x = particle.targetX + Math.sin(time + index * 0.1) * 0.5
                    particle.y = particle.targetY + Math.cos(time * 0.7 + index * 0.1) * 0.5
                }

                // Subtle pulse
                const pulseOpacity = particle.opacity * (0.9 + Math.sin(time * 1.5 + index * 0.05) * 0.1)

                // Corner dots: darker silver for highlight, others: lighter silver
                if (particle.isCorner) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${pulseOpacity})`
                } else {
                    ctx.fillStyle = `rgba(180, 180, 190, ${pulseOpacity * 0.8})`
                }
                const half = moduleSize * 0.45
                ctx.fillRect(particle.x - half, particle.y - half, half * 2, half * 2)
            })

            animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        const handleResize = () => {
            resizeCanvas()
        }

        window.addEventListener("resize", handleResize)

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    return (
        <div className="w-full h-full absolute inset-0">
            <canvas ref={canvasRef} className="w-full h-full" style={{ background: "transparent" }} />
        </div>
    )
}
