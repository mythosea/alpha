"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, X, Camera } from "lucide-react"
import { ZodiacSymbol, bloodColorToZodiac } from "@/components/zodiac-symbol"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  bloodColor?: string
  name?: string
}

export function ImageUpload({ value, onChange, bloodColor = "human", name = "" }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const bloodColorMap: Record<string, { color: string; textColor: string }> = {
    burgundy: { color: "#a10000", textColor: "white" },
    bronze: { color: "#a15000", textColor: "white" },
    gold: { color: "#a1a100", textColor: "black" },
    lime: { color: "#01a100", textColor: "white" },
    olive: { color: "#416600", textColor: "white" },
    jade: { color: "#008141", textColor: "white" },
    teal: { color: "#008282", textColor: "white" },
    cerulean: { color: "#005682", textColor: "white" },
    indigo: { color: "#000056", textColor: "white" },
    purple: { color: "#2b0057", textColor: "white" },
    violet: { color: "#6a006a", textColor: "white" },
    fuchsia: { color: "#a1004f", textColor: "white" },
    human: { color: "#ff0000", textColor: "white" },
  }

  const bloodStyle = bloodColorMap[bloodColor] || { color: "#333333", textColor: "white" }
  const zodiacSign = bloodColorToZodiac[bloodColor] || "unknown"

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setError(null)

    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB")
      return
    }

    if (!file.type.startsWith("image/")) {
      setError("File must be an image")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setPreview(result)
      onChange(result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreview(null)
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div onClick={handleClick} className="relative cursor-pointer group">
        <Avatar className="h-24 w-24 border-4" style={{ borderColor: bloodStyle.color }}>
          {preview ? (
            <AvatarImage src={preview} alt="Character image" />
          ) : (
            <AvatarFallback
              className="text-2xl"
              style={{
                backgroundColor: bloodStyle.color,
                color: bloodStyle.textColor,
              }}
            >
              {name ? getInitials(name) : <ZodiacSymbol sign={zodiacSign} color={bloodStyle.textColor} />}
            </AvatarFallback>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-8 w-8 text-white" />
          </div>
        </Avatar>
        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <input type="file" ref={fileInputRef} onChange={handleChange} accept="image/*" className="hidden" />

      <Button type="button" variant="ghost" size="sm" onClick={handleClick} className="mt-2">
        <Upload className="h-4 w-4 mr-2" />
        {preview ? "Change Image" : "Upload Image"}
      </Button>

      {error && <p className="text-destructive text-sm mt-1">{error}</p>}
    </div>
  )
}

