"use client"

import { useEffect, useRef } from "react"

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

        // This is a QR code for akmal.in - simplified 21x21 pattern
        // In a real implementation, you would use a QR library to generate this
        const qrPattern = [
            [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
            [1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
            [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
            [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0],
            [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
            [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0],
            [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1],
        ]

        const gridSize = 21
        const moduleSize = Math.min(canvas.width, canvas.height) * 0.018
        const qrSize = gridSize * moduleSize
        const offsetX = (canvas.width - qrSize) / 2
        const offsetY = (canvas.height - qrSize) / 2

        // Create particles for each black module in QR code
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                if (qrPattern[row][col] === 1) {
                    const targetX = offsetX + col * moduleSize + moduleSize / 2
                    const targetY = offsetY + row * moduleSize + moduleSize / 2

                    for (let i = 0; i < 3; i++) {
                        particles.push({
                            x: canvas.width * Math.random(),
                            y: canvas.height * Math.random(),
                            targetX,
                            targetY,
                            size: Math.random() * 3 + 2,
                            opacity: Math.random() * 0.5 + 0.5,
                            speed: Math.random() * 0.02 + 0.01,
                        })
                    }
                }
            }
        }

        let time = 0

        const animate = () => {
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            time += 0.01

            particles.forEach((particle, index) => {
                const dx = particle.targetX - particle.x
                const dy = particle.targetY - particle.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance > 1) {
                    particle.x += dx * particle.speed
                    particle.y += dy * particle.speed
                } else {
                    const floatX = Math.sin(time + index * 0.1) * 2
                    const floatY = Math.cos(time + index * 0.15) * 2
                    particle.x = particle.targetX + floatX
                    particle.y = particle.targetY + floatY
                }

                const gradient = ctx.createRadialGradient(
                    particle.x,
                    particle.y,
                    0,
                    particle.x,
                    particle.y,
                    particle.size * 2
                )
                gradient.addColorStop(0, `rgba(255, 255, 255, ${particle.opacity})`)
                gradient.addColorStop(0.5, `rgba(255, 255, 255, ${particle.opacity * 0.5})`)
                gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

                ctx.fillStyle = gradient
                ctx.beginPath()
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                ctx.fill()
            })

            const drawCornerMarker = (x: number, y: number) => {
                const markerSize = moduleSize * 7
                const innerSize = moduleSize * 3

                ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(time * 2) * 0.2})`
                ctx.lineWidth = 3
                ctx.strokeRect(x, y, markerSize, markerSize)

                const innerOffset = (markerSize - innerSize) / 2
                ctx.fillStyle = `rgba(255, 255, 255, ${0.6 + Math.sin(time * 2) * 0.3})`
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
