"use client"

import { useAppTheme } from "@/contexts/theme-context"

export function BackgroundEffects() {
  // We're keeping the hook to avoid breaking any state management
  const { backgroundEffect } = useAppTheme()

  // Return null to render nothing, effectively removing all effects
  return null
}

