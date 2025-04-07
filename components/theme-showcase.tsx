"use client"

import { useAppTheme } from "@/contexts/theme-context"
import { Check } from "lucide-react"
import { Card } from "@/components/ui/card"

interface ThemeOption {
  id: string
  name: string
  description: string
  primaryColor: string
  accentColor: string
  baseColor: string
  textColor: string
  screenshot?: string
}

const themeOptions: ThemeOption[] = [
  {
    id: "default",
    name: "Default Dark",
    description: "The classic dark theme with purple accents",
    baseColor: "#121212",
    primaryColor: "hsl(270, 60%, 55%)",
    accentColor: "hsl(270, 60%, 65%)",
    textColor: "hsl(270, 30%, 85%)",
  },
  {
    id: "retro",
    name: "Retro Terminal",
    description: "Green on black like old computer terminals",
    baseColor: "#020",
    primaryColor: "hsl(120, 100%, 50%)",
    accentColor: "hsl(120, 100%, 60%)",
    textColor: "hsl(120, 100%, 80%)",
  },
  {
    id: "synthwave",
    name: "Synthwave",
    description: "Neon pink and purple with a retro 80s feel",
    baseColor: "#170225",
    primaryColor: "hsl(320, 100%, 65%)",
    accentColor: "hsl(280, 100%, 75%)",
    textColor: "hsl(280, 100%, 95%)",
  },
  {
    id: "hacker",
    name: "Hacker",
    description: "Matrix-inspired green on black",
    baseColor: "#020",
    primaryColor: "hsl(110, 100%, 45%)",
    accentColor: "hsl(110, 100%, 55%)",
    textColor: "hsl(110, 100%, 70%)",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "Neon blue and yellow in a dark city",
    baseColor: "#0c1a20",
    primaryColor: "hsl(180, 100%, 55%)",
    accentColor: "hsl(60, 100%, 70%)",
    textColor: "hsl(60, 100%, 80%)",
  },
  {
    id: "vaporwave",
    name: "Vaporwave",
    description: "Pastel pink and teal with retro aesthetics",
    baseColor: "#1a0825",
    primaryColor: "hsl(320, 100%, 75%)",
    accentColor: "hsl(180, 100%, 75%)",
    textColor: "hsl(180, 100%, 90%)",
  },
  {
    id: "trollblood",
    name: "Troll Blood",
    description: "Based on the Homestuck hemospectrum",
    baseColor: "#120505",
    primaryColor: "hsl(0, 80%, 55%)",
    accentColor: "hsl(270, 80%, 55%)",
    textColor: "hsl(0, 0%, 95%)",
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Deep blues and purples for a night-time feel",
    baseColor: "#070720",
    primaryColor: "hsl(220, 100%, 65%)",
    accentColor: "hsl(260, 100%, 75%)",
    textColor: "hsl(220, 100%, 95%)",
  },
  {
    id: "apocalypse",
    name: "Apocalypse",
    description: "Red and orange tones for a post-apocalyptic feel",
    baseColor: "#150505",
    primaryColor: "hsl(20, 100%, 55%)",
    accentColor: "hsl(30, 100%, 65%)",
    textColor: "hsl(30, 100%, 85%)",
  },
  {
    id: "monochrome",
    name: "Monochrome",
    description: "Black and white with grayscale elements",
    baseColor: "#0a0a0a",
    primaryColor: "hsl(0, 0%, 80%)",
    accentColor: "hsl(0, 0%, 85%)",
    textColor: "hsl(0, 0%, 95%)",
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Blues and teals with an underwater theme",
    baseColor: "#051520",
    primaryColor: "hsl(190, 100%, 55%)",
    accentColor: "hsl(210, 100%, 65%)",
    textColor: "hsl(180, 100%, 95%)",
  },
  {
    id: "alternia",
    name: "Alternia",
    description: "Inspired by the Alternian landscape",
    baseColor: "#1c1c15",
    primaryColor: "hsl(45, 80%, 60%)",
    accentColor: "hsl(15, 80%, 60%)",
    textColor: "hsl(45, 30%, 95%)",
  },
  {
    id: "prospit",
    name: "Prospit",
    description: "Golden city of the dreamers",
    baseColor: "#1a1105",
    primaryColor: "hsl(45, 100%, 65%)",
    accentColor: "hsl(40, 100%, 80%)",
    textColor: "hsl(45, 100%, 85%)",
  },
  {
    id: "derse",
    name: "Derse",
    description: "Purple kingdom of the dreamers",
    baseColor: "#190540",
    primaryColor: "hsl(270, 70%, 55%)",
    accentColor: "hsl(275, 80%, 70%)",
    textColor: "hsl(275, 80%, 95%)",
  },
  {
    id: "sburb",
    name: "SBURB",
    description: "Inspired by the game's interface",
    baseColor: "#051207",
    primaryColor: "hsl(120, 100%, 45%)",
    accentColor: "hsl(120, 70%, 60%)",
    textColor: "hsl(120, 100%, 90%)",
  },
  {
    id: "light",
    name: "Light Mode",
    description: "Light theme for better contrast",
    baseColor: "#f8f8f8",
    primaryColor: "hsl(270, 60%, 50%)",
    accentColor: "hsl(270, 60%, 60%)",
    textColor: "hsl(270, 30%, 30%)",
  },
]

export function ThemeShowcase() {
  const { colorTheme, setColorTheme } = useAppTheme()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {themeOptions.map((theme) => (
        <Card
          key={theme.id}
          className={`relative overflow-hidden rounded-md border transition-all cursor-pointer hover:shadow-md ${
            colorTheme === theme.id
              ? "border-[hsl(var(--tumblr-royal-purple))] ring-2 ring-[hsl(var(--tumblr-royal-purple))]"
              : "border-[hsl(var(--border))] bg-[hsl(var(--tumblr-darker))]"
          }`}
          onClick={() => setColorTheme(theme.id as any)}
          data-theme={theme.id}
        >
          <div className="p-4">
            <div
              className="h-24 mb-3 rounded-md overflow-hidden relative"
              style={{
                background: theme.baseColor,
              }}
            >
              {/* Theme preview UI mockup */}
              <div className="absolute top-0 left-0 w-full h-3" style={{ backgroundColor: theme.accentColor }} />
              <div
                className="absolute left-0 top-3 h-[calc(100%-3px)] w-12"
                style={{ backgroundColor: `${theme.baseColor}ee` }}
              >
                <div className="w-8 h-1 mx-auto mt-2 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
                <div className="w-8 h-1 mx-auto mt-1 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
                <div className="w-8 h-1 mx-auto mt-1 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
              </div>
              <div
                className="absolute left-14 top-5 right-2 h-3 rounded-sm"
                style={{ backgroundColor: theme.primaryColor }}
              />
              <div
                className="absolute left-14 top-10 right-8 h-2.5 rounded-sm"
                style={{ backgroundColor: `${theme.accentColor}88` }}
              />
              <div
                className="absolute left-14 top-14 right-4 h-2.5 rounded-sm"
                style={{ backgroundColor: `${theme.accentColor}88` }}
              />
              <div
                className="absolute left-14 top-18 right-10 h-2.5 rounded-sm"
                style={{ backgroundColor: `${theme.accentColor}88` }}
              />

              {/* Text sample for contrast testing */}
              <div className="absolute bottom-1 right-2 text-[8px] font-bold" style={{ color: theme.textColor }}>
                Sample Text
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-mono text-base font-medium" style={{ color: theme.primaryColor }}>
                {theme.name}
              </h3>
              {colorTheme === theme.id && (
                <div className="rounded-full p-0.5" style={{ backgroundColor: theme.primaryColor }}>
                  <Check className="h-3.5 w-3.5 text-white" />
                </div>
              )}
            </div>
            <p className="text-xs mb-3 line-clamp-2 h-8" style={{ color: theme.textColor }}>
              {theme.description}
            </p>
            <div className="flex gap-2 mt-2">
              <div className="h-5 w-full rounded-sm" style={{ backgroundColor: theme.baseColor }} />
              <div className="h-5 w-6 rounded-sm" style={{ backgroundColor: theme.primaryColor }} />
              <div className="h-5 w-6 rounded-sm" style={{ backgroundColor: theme.accentColor }} />
            </div>
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 p-2 flex justify-center border-t"
            style={{
              backgroundColor: theme.baseColor,
              borderColor: theme.primaryColor,
            }}
          >
            <button
              className={`text-xs px-3 py-1 rounded-sm font-mono transition-colors`}
              style={{
                backgroundColor: colorTheme === theme.id ? theme.primaryColor : "transparent",
                color: colorTheme === theme.id ? "#fff" : theme.primaryColor,
                border: `1px solid ${theme.primaryColor}`,
              }}
            >
              {colorTheme === theme.id ? "Active" : "Select"}
            </button>
          </div>
        </Card>
      ))}
    </div>
  )
}

