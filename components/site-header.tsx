"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PlusCircle, ChevronDown, MessageSquare, Users } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ZodiacSymbol, bloodColorToZodiac } from "@/components/zodiac-symbol"

type Character = {
  id: string
  name: string
  trollTag: string
  bloodColor: string
  species: "troll" | "human"
}

const bloodColorMap: Record<string, string> = {
  burgundy: "#a10000",
  bronze: "#a15000",
  gold: "#a1a100",
  lime: "#01a100",
  olive: "#416600",
  jade: "#008141",
  teal: "#008282",
  cerulean: "#005682",
  indigo: "#000056",
  purple: "#2b0057",
  violet: "#6a006a",
  fuchsia: "#a1004f",
  human: "#ff0000",
}

export function SiteHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const [characters, setCharacters] = useState<Character[]>([])
  const [activeCharacter, setActiveCharacter] = useState<Character | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const storedCharacters = JSON.parse(localStorage.getItem("homestuckCharacters") || "[]")
    setCharacters(storedCharacters)

    // Get active character from localStorage or set the first character as active
    const activeId = localStorage.getItem("activeCharacterId")
    if (activeId) {
      const active = storedCharacters.find((char: Character) => char.id === activeId)
      if (active) {
        setActiveCharacter(active)
      } else if (storedCharacters.length > 0) {
        setActiveCharacter(storedCharacters[0])
        localStorage.setItem("activeCharacterId", storedCharacters[0].id)
      }
    } else if (storedCharacters.length > 0) {
      setActiveCharacter(storedCharacters[0])
      localStorage.setItem("activeCharacterId", storedCharacters[0].id)
    }
  }, [pathname])

  const switchCharacter = (character: Character) => {
    setActiveCharacter(character)
    localStorage.setItem("activeCharacterId", character.id)

    // If on a character detail page, navigate to the selected character
    if (pathname.startsWith("/characters/")) {
      router.push(`/characters/${character.id}`)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (!isClient) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Myrhosea</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-1 md:space-x-2">
            <Link href="/characters">
              <Button variant="ghost" size="sm" className="md:mr-2">
                <Users className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Characters</span>
              </Button>
            </Link>
            <Link href="/feed">
              <Button variant="ghost" size="sm" className="md:mr-2">
                <MessageSquare className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Feed</span>
              </Button>
            </Link>
          </nav>

          {characters.length > 0 ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto flex items-center gap-2">
                  {activeCharacter && (
                    <Avatar className="h-6 w-6">
                      <AvatarFallback
                        style={{
                          backgroundColor: bloodColorMap[activeCharacter.bloodColor] || "#333",
                          color: ["gold"].includes(activeCharacter.bloodColor) ? "black" : "white",
                        }}
                      >
                        {getInitials(activeCharacter.name)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <span className="hidden md:inline-flex">
                    {activeCharacter ? activeCharacter.name : "Select Character"}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Your Characters</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {characters.map((character) => {
                  const zodiacSign = bloodColorToZodiac[character.bloodColor] || "unknown"
                  return (
                    <DropdownMenuItem
                      key={character.id}
                      className="cursor-pointer flex items-center gap-2"
                      onClick={() => switchCharacter(character)}
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarFallback
                          style={{
                            backgroundColor: bloodColorMap[character.bloodColor] || "#333",
                            color: ["gold"].includes(character.bloodColor) ? "black" : "white",
                          }}
                        >
                          <ZodiacSymbol
                            sign={zodiacSign}
                            size="sm"
                            color={["gold"].includes(character.bloodColor) ? "black" : "white"}
                          />
                        </AvatarFallback>
                      </Avatar>
                      <span>{character.name}</span>
                      {activeCharacter?.id === character.id && (
                        <div className="ml-auto h-2 w-2 rounded-full bg-green-500" />
                      )}
                    </DropdownMenuItem>
                  )
                })}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/create")}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Character
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => router.push("/create")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Character
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

