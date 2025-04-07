"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, MessageSquare } from "lucide-react"
import { PesterlogCard } from "@/components/pesterlog-card"
import { ZodiacSymbol, bloodColorToZodiac } from "@/components/zodiac-symbol"
import { Badge } from "@/components/ui/badge"
import { bloodColorMap } from "@/lib/constants"
import type { Character } from "@/types/character"

export function CharacterProfileCard() {
  const router = useRouter()
  const [activeCharacter, setActiveCharacter] = useState<Character | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const storedCharacters = JSON.parse(localStorage.getItem("homestuckCharacters") || "[]")

    // Get active character from localStorage
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
  }, [])

  if (!isClient || !activeCharacter) {
    return (
      <div className="p-6 border rounded-lg bg-card text-center">
        <p className="text-muted-foreground">No active character selected</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/characters")}>
          View Characters
        </Button>
      </div>
    )
  }

  const bloodStyle = bloodColorMap[activeCharacter.bloodColor] || { color: "#333333", textColor: "white" }
  const zodiacSign = bloodColorToZodiac[activeCharacter.bloodColor] || "unknown"

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <PesterlogCard
      bloodColor={activeCharacter.bloodColor}
      header={<span className="font-bold">{activeCharacter.trollTag}</span>}
      footer={
        <div className="flex gap-2 w-full">
          <Button variant="outline" className="flex-1" onClick={() => router.push(`/characters/${activeCharacter.id}`)}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => router.push(`/feed`)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Feed
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center text-center mb-4">
        <Avatar className="h-20 w-20 border-4 mb-2" style={{ borderColor: bloodStyle.color }}>
          {activeCharacter.imageUrl ? (
            <AvatarImage src={activeCharacter.imageUrl} alt={activeCharacter.name} />
          ) : (
            <AvatarFallback
              className="text-2xl"
              style={{
                backgroundColor: bloodStyle.color,
                color: bloodStyle.textColor,
              }}
            >
              {getInitials(activeCharacter.name)}
            </AvatarFallback>
          )}
        </Avatar>

        <h2 className="text-xl font-bold">{activeCharacter.name}</h2>

        <div className="flex items-center gap-2 mt-1">
          <ZodiacSymbol sign={zodiacSign} color={bloodStyle.color} />
          <span className="text-sm font-mono text-muted-foreground">{activeCharacter.trollTag}</span>
        </div>

        <div className="flex gap-2 mt-2">
          <Badge variant="outline" className="capitalize">
            {activeCharacter.species}
          </Badge>
          <Badge
            style={{
              backgroundColor: bloodStyle.color,
              color: bloodStyle.textColor,
            }}
            className="capitalize"
          >
            {activeCharacter.bloodColor} blood
          </Badge>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <h3 className="font-medium mb-1">Typing Quirk</h3>
          <p className="text-muted-foreground">{activeCharacter.quirk}</p>
        </div>

        <div>
          <h3 className="font-medium mb-1">Interests</h3>
          <p className="text-muted-foreground">{activeCharacter.interests}</p>
        </div>
      </div>
    </PesterlogCard>
  )
}

