"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export function JourneyBackground() {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDark = theme === "dark"

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Particle properties
    const particles: {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
      color: string
    }[] = []

    // Create particles
    const createParticles = () => {
      const width = canvas.width / (window.devicePixelRatio || 1)
      const height = canvas.height / (window.devicePixelRatio || 1)
      const particleCount = Math.floor((width * height) / 15000) // Adjust density

      particles.length = 0 // Clear existing particles

      // Colors based on theme
      const colors = isDark
        ? ["rgba(100, 150, 255, 0.3)", "rgba(100, 200, 255, 0.2)", "rgba(150, 200, 255, 0.25)"]
        : ["rgba(0, 100, 200, 0.1)", "rgba(0, 150, 200, 0.15)", "rgba(50, 150, 200, 0.1)"]

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 4 + 1,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.1,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }
    }

    createParticles()
    window.addEventListener("resize", createParticles)

    // Animation
    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw and update particles
      particles.forEach((particle) => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity * (0.5 + Math.sin(Date.now() / 3000) * 0.2)
        ctx.fill()

        // Move particle
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Bounce off edges
        const width = canvas.width / (window.devicePixelRatio || 1)
        const height = canvas.height / (window.devicePixelRatio || 1)

        if (particle.x < 0 || particle.x > width) {
          particle.speedX *= -1
        }

        if (particle.y < 0 || particle.y > height) {
          particle.speedY *= -1
        }
      })

      // Draw connections between nearby particles
      particles.forEach((particle, i) => {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particle.x - particles[j].x
          const dy = particle.y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = isDark
              ? `rgba(100, 150, 255, ${0.05 * (1 - distance / 100)})`
              : `rgba(0, 100, 200, ${0.03 * (1 - distance / 100)})`
            ctx.stroke()
          }
        }
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("resize", createParticles)
      cancelAnimationFrame(animationId)
    }
  }, [theme, isDark])

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-gradient-shift -z-20"></div>
    </>
  )
}
