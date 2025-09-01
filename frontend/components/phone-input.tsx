"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface PhoneInputProps {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function PhoneInput({ id, value, onChange, placeholder = "+1 (555) 000-0000", className }: PhoneInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [focused, setFocused] = useState(false)

  // Format phone number as user types
  const formatPhoneNumber = (input: string) => {
    // Remove all non-digit characters
    const digits = input.replace(/\D/g, "")

    // Format the phone number
    let formatted = ""

    if (digits.length === 0) {
      formatted = ""
    } else if (digits.length <= 3) {
      formatted = `+${digits}`
    } else if (digits.length <= 6) {
      formatted = `+${digits.slice(0, 3)} (${digits.slice(3)})`
    } else if (digits.length <= 10) {
      formatted = `+${digits.slice(0, 3)} (${digits.slice(3, 6)}) ${digits.slice(6)}`
    } else {
      formatted = `+${digits.slice(0, 3)} (${digits.slice(3, 6)}) ${digits.slice(6, 9)}-${digits.slice(9, 13)}`
    }

    return formatted
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    const formatted = formatPhoneNumber(input)
    onChange(formatted)
  }

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "absolute inset-y-0 left-3 flex items-center transition-colors",
          focused ? "text-primary" : "text-muted-foreground",
        )}
      >
        <Phone className="h-4 w-4" />
      </div>
      <Input
        id={id}
        ref={inputRef}
        type="tel"
        value={value}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="pl-10"
      />
    </div>
  )
}
