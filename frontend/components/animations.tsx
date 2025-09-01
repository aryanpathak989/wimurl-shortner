"use client"

import React from "react"

import { useEffect, useState } from "react"
import { motion, useAnimation, useInView } from "framer-motion"

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
  direction?: "up" | "down" | "left" | "right" | "none"
  distance?: number
  once?: boolean
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  className = "",
  direction = "up",
  distance = 20,
  once = true,
}: FadeInProps) {
  const controls = useAnimation()
  const ref = React.useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  const directionMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  }

  const initial = {
    opacity: 0,
    ...directionMap[direction],
  }

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration,
          delay,
          ease: "easeOut",
        },
      })
    }
  }, [controls, inView, delay, duration])

  return (
    <motion.div ref={ref} initial={initial} animate={controls} className={className}>
      {children}
    </motion.div>
  )
}

interface StaggerContainerProps {
  children: React.ReactNode
  delay?: number
  staggerDelay?: number
  className?: string
  once?: boolean
}

export function StaggerContainer({
  children,
  delay = 0,
  staggerDelay = 0.1,
  className = "",
  once = true,
}: StaggerContainerProps) {
  const controls = useAnimation()
  const ref = React.useRef(null)
  const inView = useInView(ref, { once, amount: 0.1 })

  useEffect(() => {
    if (inView) {
      controls.start((i) => ({
        opacity: 1,
        y: 0,
        transition: {
          delay: delay + i * staggerDelay,
          duration: 0.5,
          ease: "easeOut",
        },
      }))
    }
  }, [controls, inView, delay, staggerDelay])

  return (
    <motion.div ref={ref} className={className}>
      {React.Children.map(children, (child, i) => (
        <motion.div custom={i} initial={{ opacity: 0, y: 20 }} animate={controls}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

export function CountUp({
  end,
  start = 0,
  duration = 2,
  prefix = "",
  suffix = "",
  className = "",
}: {
  end: number
  start?: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}) {
  const [count, setCount] = useState(start)
  const ref = React.useRef(null)
  const inView = useInView(ref, { once:true, amount: 0.1 })

  useEffect(() => {
    if (!inView) return

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      const currentCount = Math.floor(progress * (end - start) + start)

      setCount(currentCount)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [end, start, duration, inView])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export function AnimatedButton({ children, ...props }: React.ComponentProps<typeof motion.button>) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}
