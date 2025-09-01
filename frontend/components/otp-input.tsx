"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface OtpInputProps {
  value: string
  valueLength: number
  onChange: (value: string) => void
  className?: string
}

export function OtpInput({ value, valueLength, onChange, className }: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = e.target.value

    // Only allow digits
    if (newValue && !/^\d+$/.test(newValue)) {
      return
    }

    // Get the last character if multiple characters are pasted
    const digit = newValue.slice(-1)

    // Create a new value string by replacing the digit at the current index
    const newOtpValue = value.split("")
    newOtpValue[index] = digit
    const updatedValue = newOtpValue.join("")

    onChange(updatedValue)

    // Auto-focus next input if a digit was entered
    if (digit && index < valueLength - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move focus to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !value[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus()
    }

    // Move focus to next input on right arrow key
    if (e.key === "ArrowRight" && index < valueLength - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus()
    }

    // Move focus to previous input on left arrow key
    if (e.key === "ArrowLeft" && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // Only allow digits
    if (!/^\d+$/.test(pastedData)) {
      return
    }

    // Take only the first valueLength digits
    const pastedOtp = pastedData.slice(0, valueLength)

    if (pastedOtp) {
      onChange(pastedOtp.padEnd(valueLength, ""))

      // Focus the last filled input or the next empty one
      const focusIndex = Math.min(pastedOtp.length, valueLength - 1)
      inputRefs.current[focusIndex]?.focus()
    }
  }

  return (
    <div className={cn("flex justify-center gap-2", className)}>
      {Array.from({ length: valueLength }, (_, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={value[index] || ""}
          ref={(el) => { inputRefs.current[index] = el }}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className={cn(
            "h-14 w-14 rounded-md border border-input bg-background px-3 py-2 text-center text-xl shadow-sm transition-all",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  )
}
