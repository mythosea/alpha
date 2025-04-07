"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useTheme } from "next-themes"

type ColorTheme =
  | "default"
  | "retro"
  | "synthwave"
  | "hacker"
  | "cyberpunk"
  | "vaporwave"
  | "trollblood"
  | "midnight"
  | "apocalypse"
  | "monochrome"
  | "ocean"
  | "alternia"
  | "prospit"
  | "derse"
  | "sburb"
  | "light"

type BackgroundEffect =
  | "none"
  | "scanlines"
  | "crt"
  | "glitch"
  | "matrix"
  | "stars"
  | "static"
  | "vaporwave"
  | "pixelate"
  | "circuit"
  | "sburb"

interface ThemeContextType {
  colorTheme: ColorTheme
  setColorTheme: (theme: ColorTheme) => void
  backgroundEffect: BackgroundEffect
  setBackgroundEffect: (effect: BackgroundEffect) => void
}

const ThemeContext = createContext<ThemeContextType>({
  colorTheme: "default",
  setColorTheme: () => null,
  backgroundEffect: "none",
  setBackgroundEffect: () => null,
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme()
  const [colorTheme, setColorThemeState] = useState<ColorTheme>("default")
  const [backgroundEffect, setBackgroundEffectState] = useState<BackgroundEffect>("none")
  const [mounted, setMounted] = useState(false)

  // Load saved theme and effect from localStorage
  useEffect(() => {
    setMounted(true)

    const savedTheme = localStorage.getItem("mythosea-theme") as ColorTheme
    const savedEffect = localStorage.getItem("mythosea-effect") as BackgroundEffect

    if (savedTheme) {
      setColorThemeState(savedTheme)
      setTheme(savedTheme === "light" ? "light" : "dark")
      document.documentElement.setAttribute("data-theme", savedTheme)
    }

    if (savedEffect) {
      setBackgroundEffectState(savedEffect)
    }
  }, [setTheme])

  // Set color theme and save to localStorage
  const setColorTheme = (theme: ColorTheme) => {
    setColorThemeState(theme)
    localStorage.setItem("mythosea-theme", theme)
    setTheme(theme === "light" ? "light" : "dark")
    document.documentElement.setAttribute("data-theme", theme)
  }

  // Set background effect and save to localStorage
  const setBackgroundEffect = (effect: BackgroundEffect) => {
    setBackgroundEffectState(effect)
    localStorage.setItem("mythosea-effect", effect)
  }

  // Avoid rendering with incorrect theme
  if (!mounted) return <>{children}</>

  return (
    <ThemeContext.Provider value={{ colorTheme, setColorTheme, backgroundEffect, setBackgroundEffect }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useAppTheme = () => useContext(ThemeContext)

