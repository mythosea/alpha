"use client"

import type React from "react"

import { useAppTheme } from "@/contexts/theme-context"
import { Check } from "lucide-react"
import { Card } from "@/components/ui/card"

interface EffectOption {
  id: string
  name: string
  description: string
  preview: React.ReactNode | string
  previewColor?: string
}

export function BackgroundEffectShowcase() {
  const { backgroundEffect, setBackgroundEffect } = useAppTheme()

  const effectOptions: EffectOption[] = [
    {
      id: "none",
      name: "None",
      description: "Clean interface with no effects",
      preview: "CLEAN",
      previewColor: "var(--tumblr-royal-purple)",
    },
    {
      id: "scanlines",
      name: "Scanlines",
      description: "Classic CRT monitor scan lines",
      preview: "SCAN",
      previewColor: "var(--tumblr-royal-purple)",
    },
    {
      id: "matrix",
      name: "Matrix Rain",
      description: "Digital rain inspired by The Matrix",
      preview: (
        <>
          <div className="text-[6px]">アイウエオカキ</div>
          <div className="text-[6px]">サシスセソタチ</div>
          <div className="text-[6px]">01010101</div>
        </>
      ),
      previewColor: "#00ff41",
    },
    {
      id: "particles",
      name: "Particles",
      description: "Floating particle effect in the background",
      preview: "FLOAT",
      previewColor: "var(--tumblr-royal-purple)",
    },
    {
      id: "crt",
      name: "CRT Effect",
      description: "Old CRT monitor effect with slight flicker",
      preview: "CRT",
      previewColor: "var(--tumblr-royal-purple)",
    },
    {
      id: "glitch",
      name: "Glitch",
      description: "Cyberpunk-inspired digital glitch effect",
      preview: "GLITCH",
      previewColor: "var(--tumblr-royal-purple)",
    },
    {
      id: "stars",
      name: "Stars",
      description: "Twinkling stars in the background",
      preview: "STARS",
      previewColor: "var(--tumblr-royal-purple)",
    },
    {
      id: "static",
      name: "Static",
      description: "TV static noise overlay effect",
      preview: "STATIC",
      previewColor: "var(--tumblr-royal-purple)",
    },
    {
      id: "vaporwave",
      name: "Vaporwave Grid",
      description: "Retro grid in vaporwave style",
      preview: "GRID",
      previewColor: "#ff71ce",
    },
    {
      id: "pixelate",
      name: "Pixelate",
      description: "Pixel art-style distortion effect",
      preview: "PIXELS",
      previewColor: "var(--tumblr-royal-purple)",
    },
    {
      id: "circuit",
      name: "Circuit",
      description: "Digital circuit board pattern",
      preview: "CIRCUIT",
      previewColor: "#00ff7f",
    },
    {
      id: "sburb",
      name: "SBURB Spirograph",
      description: "SBURB logo spirograph animation",
      preview: "SBURB",
      previewColor: "#00ff00",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {effectOptions.map((effect) => (
        <Card
          key={effect.id}
          className={`relative overflow-hidden rounded-md border transition-all cursor-pointer hover:shadow-md ${
            backgroundEffect === effect.id
              ? "border-[hsl(var(--tumblr-royal-purple))] ring-2 ring-[hsl(var(--tumblr-royal-purple))]"
              : "border-[hsl(var(--border))] bg-[hsl(var(--tumblr-darker))]"
          }`}
          onClick={() => setBackgroundEffect(effect.id as any)}
        >
          <div className="p-4">
            <div
              className={`h-20 mb-3 rounded flex items-center justify-center text-center font-mono text-xs`}
              style={{
                backgroundColor: "hsl(var(--tumblr-dark))",
                color: `hsl(${effect.previewColor})`,
                ...(effect.id === "scanlines"
                  ? {
                      backgroundImage:
                        "repeating-linear-gradient(to bottom, transparent, transparent 1px, rgba(0, 0, 0, 0.3) 1px, rgba(0, 0, 0, 0.3) 2px)",
                    }
                  : {}),
                ...(effect.id === "particles" ? { position: "relative" } : {}),
                ...(effect.id === "glitch" ? { animation: "glitch 2s infinite" } : {}),
                ...(effect.id === "static"
                  ? {
                      background:
                        "url('data:image/png;base64,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') no-repeat center center, hsl(var(--tumblr-dark))",
                      backgroundSize: "40px 40px",
                    }
                  : {}),
                ...(effect.id === "vaporwave"
                  ? {
                      background:
                        "linear-gradient(to bottom, #000 0%, rgba(255,0,255,0.5) 100%), linear-gradient(to right, rgba(0,255,255,0.5) 0%, #000 100%), linear-gradient(rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.8) 100%), repeating-linear-gradient(transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)",
                    }
                  : {}),
                ...(effect.id === "pixelate"
                  ? {
                      backgroundSize: "8px 8px",
                      backgroundImage:
                        "linear-gradient(to right, rgba(128,0,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(128,0,255,0.2) 1px, transparent 1px)",
                    }
                  : {}),
                ...(effect.id === "circuit"
                  ? {
                      backgroundSize: "20px 20px",
                      backgroundImage:
                        "radial-gradient(circle at 10px 10px, rgba(0,255,127,0.4) 2px, transparent 2px), linear-gradient(to right, rgba(0,255,127,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,255,127,0.2) 1px, transparent 1px)",
                    }
                  : {}),
                ...(effect.id === "sburb"
                  ? {
                      background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="40" height="40"><circle cx="50" cy="50" r="45" stroke="%2300ff00" strokeWidth="2" fill="none" /><circle cx="50" cy="50" r="35" stroke="%2300ff00" strokeWidth="2" fill="none" /><circle cx="50" cy="50" r="25" stroke="%2300ff00" strokeWidth="2" fill="none" /><path d="M50,5 L50,95 M5,50 L95,50" stroke="%2300ff00" strokeWidth="2" fill="none" /></svg>') no-repeat center center, hsl(var(--tumblr-dark))`,
                    }
                  : {}),
              }}
            >
              {effect.id === "particles" && (
                <>
                  <div
                    className="absolute h-1.5 w-1.5 rounded-full bg-blue-500 opacity-50"
                    style={{ top: "20%", left: "30%" }}
                  ></div>
                  <div
                    className="absolute h-1 w-1 rounded-full bg-purple-500 opacity-50"
                    style={{ top: "50%", left: "70%" }}
                  ></div>
                  <div
                    className="absolute h-1 w-1 rounded-full bg-cyan-500 opacity-50"
                    style={{ top: "70%", left: "40%" }}
                  ></div>
                </>
              )}
              {effect.id === "stars" && (
                <>
                  <div
                    className="absolute h-1 w-1 rounded-full bg-white opacity-70"
                    style={{ top: "20%", left: "30%" }}
                  ></div>
                  <div
                    className="absolute h-1.5 w-1.5 rounded-full bg-white opacity-50"
                    style={{ top: "50%", left: "70%" }}
                  ></div>
                  <div
                    className="absolute h-1 w-1 rounded-full bg-white opacity-60"
                    style={{ top: "70%", left: "40%" }}
                  ></div>
                  <div
                    className="absolute h-1 w-1 rounded-full bg-white opacity-40"
                    style={{ top: "30%", left: "60%" }}
                  ></div>
                </>
              )}
              {effect.preview}
            </div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-mono text-sm font-medium">{effect.name}</h3>
              {backgroundEffect === effect.id && (
                <div className="bg-[hsl(var(--tumblr-royal-purple))] rounded-full p-0.5">
                  <Check className="h-3.5 w-3.5 text-white" />
                </div>
              )}
            </div>
            <p className="text-xs text-[hsl(var(--tumblr-text))] mb-2 line-clamp-2 h-8">{effect.description}</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-2 flex justify-center bg-[hsl(var(--tumblr-dark))] border-t border-[hsl(var(--border))]">
            <button
              className={`text-xs px-3 py-1 rounded-sm font-mono ${
                backgroundEffect === effect.id
                  ? "bg-[hsl(var(--tumblr-royal-purple))] text-white"
                  : "text-[hsl(var(--tumblr-royal-purple))]"
              }`}
            >
              {backgroundEffect === effect.id ? "Active" : "Select"}
            </button>
          </div>
        </Card>
      ))}
    </div>
  )
}

