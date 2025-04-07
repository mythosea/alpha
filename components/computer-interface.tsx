"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronRight, Wifi, Battery, Volume2 } from "lucide-react"
import { usePathname } from "next/navigation"
import { format } from "date-fns"
import { useAppTheme } from "@/contexts/theme-context"

interface ComputerInterfaceProps {
  children: React.ReactNode
}

export function ComputerInterface({ children }: ComputerInterfaceProps) {
  const pathname = usePathname()
  const [currentTime, setCurrentTime] = useState(new Date())
  const { colorTheme } = useAppTheme()
  const [mounted, setMounted] = useState(false)

  // Get page title based on pathname
  const getPageTitle = () => {
    if (pathname === "/feed") return "COMMUNICATION TERMINAL"
    if (pathname === "/characters") return "CHARACTER DATABASE"
    if (pathname.startsWith("/characters/")) return "CHARACTER PROFILE"
    if (pathname === "/create") return "CHARACTER CREATION MODULE"
    if (pathname === "/settings") return "SYSTEM CONFIGURATION"
    if (pathname === "/demo") return "DEMO INITIALIZATION"
    return "MYTHOSEA OS"
  }

  // Update clock every minute
  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  return (
    <div
      className="min-h-screen w-full bg-[hsl(var(--background))] p-0 sm:p-4 md:p-6 lg:p-8 flex items-center justify-center"
      data-theme={colorTheme}
    >
      <div className="w-full max-w-[90rem] mx-auto h-[100vh] sm:h-[85vh] flex flex-col">
        {/* Computer window - fixed size with flex layout */}
        <div className="bg-[hsl(var(--tumblr-darker))] rounded-none sm:rounded-lg overflow-hidden border border-[hsl(var(--border))] shadow-xl transition-all duration-500 opacity-100 scale-100 relative flex flex-col h-full">
          {/* Window title bar - fixed at top */}
          <div className="bg-[hsl(var(--tumblr-sidebar))] px-4 py-2 flex items-center justify-between border-b border-[hsl(var(--border))]">
            <div className="flex items-center">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500 shadow-inner"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-inner"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 shadow-inner"></div>
              </div>
              <div className="ml-4 font-mono text-xs text-[hsl(var(--tumblr-purple))] tracking-wide">MYTHOSEA</div>
            </div>
            <div className="flex items-center space-x-4 text-[hsl(var(--tumblr-text))]">
              <div className="text-xs font-mono bg-[hsl(var(--tumblr-darker))] px-2 py-1 rounded border border-[hsl(var(--border))]">
                <ChevronRight className="h-3 w-3 inline mr-1" />
                {getPageTitle()}
              </div>
              <div className="text-xs bg-[hsl(var(--tumblr-darker))] px-2 py-1 rounded border border-[hsl(var(--border))]">
                {format(currentTime, "HH:mm")}
              </div>
              <Wifi className="h-3.5 w-3.5" />
              <Volume2 className="h-3.5 w-3.5" />
              <Battery className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Window content - scrollable area */}
          <div className="flex-1 overflow-auto content-area">{children}</div>

          {/* Status bar - fixed at bottom */}
          <div className="bg-[hsl(var(--tumblr-sidebar))] px-4 py-1 text-xs text-[hsl(var(--tumblr-text))] border-t border-[hsl(var(--border))] flex justify-between">
            <div className="font-mono">USER: ANONYMOUS</div>
            <div className="font-mono">
              <span className="inline-block h-2 w-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
              STATUS: ONLINE
            </div>
            <div className="font-mono">MYTHOSEA OS v1.0.0 ALPHA</div>
          </div>
        </div>
      </div>
    </div>
  )
}

