"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { bloodColorMap } from "@/lib/constants"
import { bloodColorToZodiac } from "@/components/zodiac-symbol"
import type { Character } from "@/types/character"

interface CharacterRelationshipsProps {
  character: Character
}

type Relationship = {
  character: Character
  type: "moirail" | "matesprit" | "kismesis" | "auspistice" | "friend" | "enemy"
}

export function CharacterRelationships({ character }: CharacterRelationshipsProps) {
  const router = useRouter()
  const [characters, setCharacters] = useState<Character[]>(() => {
    return JSON.parse(localStorage.getItem("homestuckCharacters") || "[]").filter(
      (char: Character) => char.id !== character.id,
    )
  })

  // In a real app, this would be stored in a database
  // For demo purposes, just randomly assign relationships
  const demoRelationships: Relationship[] = characters.slice(0, 4).map((char, index) => {
    const relationshipTypes = ["moirail", "matesprit", "kismesis", "auspistice", "friend", "enemy"]
    return {
      character: char,
      type: relationshipTypes[index % relationshipTypes.length] as any,
    }
  })

  if (demoRelationships.length === 0) {
    return (
      <div className="text-center py-8 px-4 bg-[hsl(var(--tumblr-darker))] rounded-md">
        <p className="text-muted-foreground mb-2">No relationships yet.</p>
        <p className="text-sm text-muted-foreground">Create more characters to see relationships.</p>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const getRelationshipIcon = (type: string) => {
    switch (type) {
      case "moirail":
        return "♦️"
      case "matesprit":
        return "♥️"
      case "kismesis":
        return "♠️"
      case "auspistice":
        return "♣️"
      case "friend":
        return "👍"
      case "enemy":
        return "👎"
      default:
        return "❓"
    }
  }

  const getRelationshipLabel = (type: string) => {
    switch (type) {
      case "moirail":
        return "Moirail"
      case "matesprit":
        return "Matesprit"
      case "kismesis":
        return "Kismesis"
      case "auspistice":
        return "Auspistice"
      case "friend":
        return "Friend"
      case "enemy":
        return "Enemy"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {demoRelationships.map((relationship) => {
        const relatedChar = relationship.character
        const bloodStyle = bloodColorMap[relatedChar.bloodColor] || { color: "#333333", textColor: "white" }
        const zodiacSign = bloodColorToZodiac[relatedChar.bloodColor] || "unknown"

        return (
          <div
            key={relatedChar.id}
            className="border rounded-md p-3 flex items-center gap-3 cursor-pointer hover:border-[hsl(var(--tumblr-royal-purple))]"
            onClick={() => router.push(`/characters/${relatedChar.id}`)}
          >
            <div className="relative">
              <Avatar className="h-10 w-10 border-2" style={{ borderColor: bloodStyle.color }}>
                {relatedChar.imageUrl ? (
                  <AvatarImage src={relatedChar.imageUrl} alt={relatedChar.name} />
                ) : (
                  <AvatarFallback
                    style={{
                      backgroundColor: bloodStyle.color,
                      color: bloodStyle.textColor,
                    }}
                  >
                    {getInitials(relatedChar.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[hsl(var(--tumblr-dark))] flex items-center justify-center text-xs">
                {getRelationshipIcon(relationship.type)}
              </div>
            </div>

            <div className="overflow-hidden">
              <div className="font-medium text-sm truncate">{relatedChar.name}</div>
              <div className="text-xs text-muted-foreground truncate">{getRelationshipLabel(relationship.type)}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

