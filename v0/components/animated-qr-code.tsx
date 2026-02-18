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

        // Create particles for each black module in QR code
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                if (qr.modules.get(col, row)) {
                    const targetX = offsetX + col * moduleSize + moduleSize / 2
                    const targetY = offsetY + row * moduleSize + moduleSize / 2

                    // Optimized: Reduced from 3 particles to 1 per module
                    particles.push({
                        x: canvas.width * Math.random(),
                        y: canvas.height * Math.random(),
                        targetX,
                        targetY,
                        size: Math.random() * 3 + 2,
                        opacity: Math.random() * 0.5 + 0.5,
                        speed: Math.random() * 0.15 + 0.1,
                    })
                }
            }
        }

        let time = 0

        const animate = () => {
            // Use clearRect for sharp frames, no trails
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Optional: Draw a subtle background for contrast if needed, but transparent is fine if parent is black
            // ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
            // ctx.fillRect(0, 0, canvas.width, canvas.height)

            time += 0.01

            particles.forEach((particle, index) => {
                const dx = particle.targetX - particle.x
                const dy = particle.targetY - particle.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance > 1) {
                    particle.x += dx * particle.speed
                    particle.y += dy * particle.speed
                } else {
                    // Snap to grid for perfect scannability
                    particle.x = particle.targetX
                    particle.y = particle.targetY
                }

                // Draw solid square for scannability
                ctx.fillStyle = `rgba(255, 255, 255, 1)` // Maximum opacity for scanning
                // Add slight padding to avoid touching modules if desired, or full size for robustness
                // Using full moduleSize for standard QR look
                ctx.fillRect(
                    particle.x - moduleSize / 2,
                    particle.y - moduleSize / 2,
                    moduleSize + 0.5, // Slight overlap to prevent subpixel gaps 
                    moduleSize + 0.5
                )
            })

            const drawCornerMarker = (x: number, y: number) => {
                const markerSize = moduleSize * 7
                const innerSize = moduleSize * 3

                // Solid white stroke for outer box
                ctx.strokeStyle = "rgba(255, 255, 255, 1)"
                ctx.lineWidth = moduleSize
                // Adjust for stroke width centering
                ctx.strokeRect(x + moduleSize / 2, y + moduleSize / 2, markerSize - moduleSize, markerSize - moduleSize)

                const innerOffset = (markerSize - innerSize) / 2
                // Solid white fill for inner box
                ctx.fillStyle = "rgba(255, 255, 255, 1)"
                ctx.fillRect(x + innerOffset, y + innerOffset, innerSize, innerSize)
            }

            drawCornerMarker(offsetX, offsetY)
            drawCornerMarker(offsetX + qrSize - moduleSize * 7, offsetY)
            drawCornerMarker(offsetX, offsetY + qrSize - moduleSize * 7)

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
            <canvas ref={canvasRef} className="w-full h-full" style={{ background: "black" }} />
        </div>
    )
}
