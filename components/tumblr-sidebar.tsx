"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { MessageSquare, Settings, PlusCircle, Database, Search, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ZodiacSymbol, bloodColorToZodiac } from "@/components/zodiac-symbol"
import { PesterchumSidebar } from "@/components/pesterchum/pesterchum-sidebar"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"

export function TumblrSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, getActiveCharacter, logout } = useAuth()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

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

  const routes = [
    {
      label: "Feed",
      icon: MessageSquare,
      href: "/feed",
      active: pathname === "/feed",
    },
    {
      label: "Characters",
      icon: Database,
      href: "/characters",
      active: pathname === "/characters" || pathname.startsWith("/characters/"),
    },
    {
      label: "Search",
      icon: Search,
      href: "/search",
      active: pathname === "/search",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      active: pathname === "/settings",
    },
  ]

  if (!isClient) {
    return null
  }

  // If user is not logged in, redirect to login
  if (!user && pathname !== "/login" && pathname !== "/register") {
    router.push("/login")
    return null
  }

  const activeCharacter = getActiveCharacter()

  return (
    <div
      className={cn(
        "h-full w-60 md:w-64 lg:w-72",
        "flex-shrink-0 overflow-y-auto",
        "bg-[hsl(var(--tumblr-sidebar))] border-r border-[hsl(var(--border))]",
        "hidden md:block",
      )}
    >
      <div className="p-4 border-b border-[hsl(var(--border))]">
        <Link href="/feed" className="flex items-center gap-2">
          <span className="text-lg font-bold text-[hsl(var(--tumblr-royal-purple))] font-mono">MYTHOSEA</span>
        </Link>
      </div>

      <div className="px-3 py-4">
        <div className="text-xs text-[hsl(var(--tumblr-text))] mb-3 font-mono">SYSTEM MODULES</div>
        <nav className="flex-1">
          <ul className="space-y-1">
            {routes.map((route) => (
              <li key={route.label}>
                <Link
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors font-mono text-sm",
                    route.active
                      ? "bg-[hsl(var(--tumblr-dark))] text-[hsl(var(--tumblr-royal-purple))] border border-[hsl(var(--tumblr-royal-purple))]"
                      : "text-[hsl(var(--tumblr-text))] hover:bg-[hsl(var(--tumblr-dark))]",
                  )}
                >
                  <route.icon className="h-4 w-4" />
                  <span>{route.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mt-auto">
        {activeCharacter ? (
          <div className="p-4 border-t border-[hsl(var(--border))]">
            <div className="text-xs text-[hsl(var(--tumblr-text))] mb-3 font-mono">ACTIVE CHARACTER</div>
            <div className="flex items-center gap-3">
              <Avatar
                className="h-10 w-10 border-2"
                style={{ borderColor: bloodColorMap[activeCharacter.bloodColor]?.color || "#333" }}
              >
                {activeCharacter.imageUrl ? (
                  <AvatarImage src={activeCharacter.imageUrl} alt={activeCharacter.name} />
                ) : (
                  <AvatarFallback
                    style={{
                      backgroundColor: bloodColorMap[activeCharacter.bloodColor]?.color || "#333",
                      color: bloodColorMap[activeCharacter.bloodColor]?.textColor || "white",
                    }}
                  >
                    {activeCharacter.name ? (
                      getInitials(activeCharacter.name)
                    ) : (
                      <ZodiacSymbol
                        sign={bloodColorToZodiac[activeCharacter.bloodColor] || "unknown"}
                        color={bloodColorMap[activeCharacter.bloodColor]?.textColor || "white"}
                      />
                    )}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate font-mono">{activeCharacter.name}</p>
                <p className="text-xs text-[hsl(var(--tumblr-text))] truncate font-mono">{activeCharacter.trollTag}</p>
              </div>
            </div>
            <Link
              href="/create"
              className="flex items-center gap-2 mt-3 px-3 py-2 w-full text-xs rounded-md bg-[hsl(var(--tumblr-dark))] text-[hsl(var(--tumblr-royal-purple))] hover:bg-[hsl(var(--tumblr-darker))] transition-colors border border-[hsl(var(--tumblr-royal-purple))] font-mono"
            >
              <PlusCircle className="h-3 w-3" />
              <span>CREATE NEW CHARACTER</span>
            </Link>
          </div>
        ) : (
          <div className="p-4 border-t border-[hsl(var(--border))]">
            <div className="text-xs text-[hsl(var(--tumblr-text))] mb-3 font-mono">NO ACTIVE CHARACTER</div>
            <Link
              href="/create"
              className="flex items-center gap-2 px-3 py-2 w-full text-xs rounded-md bg-[hsl(var(--tumblr-dark))] text-[hsl(var(--tumblr-royal-purple))] hover:bg-[hsl(var(--tumblr-darker))] transition-colors border border-[hsl(var(--tumblr-royal-purple))] font-mono"
            >
              <PlusCircle className="h-3 w-3" />
              <span>CREATE CHARACTER</span>
            </Link>
          </div>
        )}

        <PesterchumSidebar />

        <div className="p-3 border-t border-[hsl(var(--border))] flex justify-between items-center">
          <div className="text-xs text-[hsl(var(--tumblr-text))] font-mono">
            USER: {user?.username?.toUpperCase() || "GUEST"}
          </div>
          {user && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-[hsl(var(--tumblr-text))]"
              onClick={logout}
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

