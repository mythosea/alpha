"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, Edit, Trash2, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { PesterlogCard } from "@/components/pesterlog-card"
import { ZodiacSymbol, bloodColorToZodiac } from "@/components/zodiac-symbol"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Character = {
  id: string
  name: string
  trollTag: string
  species: "troll" | "human"
  bloodColor: string
  age: string
  gender: string
  lusus?: string
  quirk: string
  interests: string
  backstory: string
  createdAt: string
  imageUrl?: string
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

export default function CharactersPage() {
  const router = useRouter()
  const [characters, setCharacters] = useState<Character[]>([])
  const [isClient, setIsClient] = useState(false)
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)
    const storedCharacters = JSON.parse(localStorage.getItem("homestuckCharacters") || "[]")
    setCharacters(storedCharacters)
    setActiveCharacterId(localStorage.getItem("activeCharacterId"))
  }, [])

  const deleteCharacter = (id: string) => {
    const updatedCharacters = characters.filter((char) => char.id !== id)
    setCharacters(updatedCharacters)
    localStorage.setItem("homestuckCharacters", JSON.stringify(updatedCharacters))

    // If we deleted the active character, set a new one or clear it
    if (activeCharacterId === id) {
      if (updatedCharacters.length > 0) {
        localStorage.setItem("activeCharacterId", updatedCharacters[0].id)
        setActiveCharacterId(updatedCharacters[0].id)
      } else {
        localStorage.removeItem("activeCharacterId")
        setActiveCharacterId(null)
      }
    }
  }

  const setAsActive = (id: string) => {
    localStorage.setItem("activeCharacterId", id)
    setActiveCharacterId(id)
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
    return <div className="flex items-center justify-center h-full">Loading...</div>
  }

  return (
    <div className="space-y-4 pb-16 md:pb-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Your Characters</h1>
        <Link href="/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Character
          </Button>
        </Link>
      </div>

      {characters.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <h2 className="text-2xl font-bold mb-4">No Characters Yet</h2>
          <p className="text-muted-foreground mb-6">
            You haven't created any characters yet. Get started by creating your first character!
          </p>
          <Link href="/create">
            <Button size="lg" className="bg-[hsl(var(--tumblr-royal-purple))]">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Your First Character
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters.map((character) => {
            const bloodStyle = bloodColorMap[character.bloodColor] || { color: "#333333", textColor: "white" }
            const zodiacSign = bloodColorToZodiac[character.bloodColor] || "unknown"
            const isActive = activeCharacterId === character.id

            return (
              <PesterlogCard
                key={character.id}
                bloodColor={character.bloodColor}
                compact={true}
                header={
                  <div className="flex items-center justify-between w-full">
                    <span className="font-mono text-sm">{character.trollTag}</span>
                    {isActive && <Badge className="bg-green-500 text-white border-none text-xs">Active</Badge>}
                  </div>
                }
                footer={
                  <div className="flex flex-col sm:flex-row sm:justify-between w-full gap-2">
                    <Button variant="outline" size="sm" onClick={() => router.push(`/characters/${character.id}`)}>
                      <Edit className="mr-2 h-3 w-3" />
                      View
                    </Button>
                    <div className="flex gap-2">
                      {!isActive && (
                        <Button variant="outline" size="sm" onClick={() => setAsActive(character.id)}>
                          <Check className="mr-2 h-3 w-3" />
                          Set Active
                        </Button>
                      )}
                      <Button variant="destructive" size="sm" onClick={() => deleteCharacter(character.id)}>
                        <Trash2 className="mr-2 h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                }
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2" style={{ borderColor: bloodStyle.color }}>
                    {character.imageUrl ? (
                      <AvatarImage src={character.imageUrl} alt={character.name} />
                    ) : (
                      <AvatarFallback
                        style={{
                          backgroundColor: bloodStyle.color,
                          color: bloodStyle.textColor,
                        }}
                      >
                        {getInitials(character.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div>
                    <h3 className="font-semibold">{character.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <ZodiacSymbol sign={zodiacSign} size="sm" color={bloodStyle.color} />
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-xs capitalize">
                          {character.species}
                        </Badge>
                        <Badge
                          className="text-xs capitalize"
                          style={{
                            backgroundColor: `${bloodStyle.color}30`,
                            color: bloodStyle.color,
                            borderColor: `${bloodStyle.color}50`,
                          }}
                          variant="outline"
                        >
                          {character.bloodColor}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground">Typing Quirk:</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1">{character.quirk}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground">Interests:</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1">{character.interests}</p>
                  </div>
                </div>
              </PesterlogCard>
            )
          })}
        </div>
      )}
    </div>
  )
}

