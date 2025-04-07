"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { TumblrSidebar } from "./tumblr-sidebar"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"

export function HomeWrapper({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  return (
    <>
      <div className="flex h-full w-full overflow-hidden">
        <TumblrSidebar className={cn("hidden md:flex")} />
        <main className={cn("flex-1 overflow-auto", "p-3 md:p-4 lg:p-6", "h-full w-full", "bg-tumblr-darker")}>
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      {isMobile && user && (
        <div className="md:hidden flex items-center justify-around p-2 bg-tumblr-dark border-t border-border z-20 fixed bottom-0 left-0 right-0">
          <a href="/feed" className="p-2 text-sm font-medium text-tumblr-royal-purple">
            Feed
          </a>
          <a href="/characters" className="p-2 text-sm font-medium text-tumblr-royal-purple">
            Characters
          </a>
          <a href="/pesterchum" className="p-2 text-sm font-medium text-tumblr-royal-purple">
            Pesterchum
          </a>
          <a href="/settings" className="p-2 text-sm font-medium text-tumblr-royal-purple">
            Settings
          </a>
        </div>
      )}
    </>
  )
}

