"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export function HeroBackground() {
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

    // Star properties
    const stars: {
      x: number
      y: number
      radius: number
      speed: number
      opacity: number
      hue: number
    }[] = []

    // Create stars
    const createStars = () => {
      const width = canvas.width / (window.devicePixelRatio || 1)
      const height = canvas.height / (window.devicePixelRatio || 1)
      const starCount = Math.floor((width * height) / 10000) // Adjust density

      stars.length = 0 // Clear existing stars
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1 + 0.1,
          speed: Math.random() * 0.05,
          opacity: Math.random() * 0.5 + 0.3,
          hue: Math.random() * 30 + (isDark ? 200 : 210), // Slightly different hues for dark/light mode
        })
      }
    }

    createStars()
    window.addEventListener("resize", createStars)

    // Animation
    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      const gridSize = 50
      const width = canvas.width / (window.devicePixelRatio || 1)
      const height = canvas.height / (window.devicePixelRatio || 1)

      ctx.strokeStyle = isDark ? "rgba(100, 150, 255, 0.05)" : "rgba(0, 80, 180, 0.03)"
      ctx.lineWidth = 1

      // Offset based on time for animation
      const offset = (Date.now() / 100) % gridSize

      // Draw vertical lines
      for (let x = offset; x < width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }

      // Draw horizontal lines
      for (let y = offset; y < height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Draw and update stars
      stars.forEach((star) => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${star.hue}, 80%, 70%, ${star.opacity})`
        ctx.fill()

        // Move star
        star.y -= star.speed

        // Reset star if it goes off screen
        if (star.y < -5) {
          star.y = height + 5
          star.x = Math.random() * width
        }
      })

      // Occasionally create a shooting star
      if (Math.random() < 0.01) {
        const shootingStar = document.createElement("div")
        shootingStar.classList.add("shooting-star")
        shootingStar.style.left = `${Math.random() * 100}%`
        shootingStar.style.top = `${Math.random() * 100}%`
        shootingStar.style.animationDelay = `${Math.random() * 2}s`

        const parent = canvas.parentElement
        if (parent) {
          parent.appendChild(shootingStar)

          // Remove shooting star after animation completes
          setTimeout(() => {
            parent.removeChild(shootingStar)
          }, 6000)
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("resize", createStars)
      cancelAnimationFrame(animationId)
    }
  }, [theme, isDark])

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10" style={{ opacity: 0.8 }} />
      <div className="animated-grid -z-10"></div>
    </>
  )
}
