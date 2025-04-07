"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Edit, Trash2, MessageSquare, CalendarClock, AlertOctagon, Check } from "lucide-react"
import { PesterlogCard } from "@/components/pesterlog-card"
import { ZodiacSymbol, bloodColorToZodiac } from "@/components/zodiac-symbol"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CharacterStats } from "@/components/character-stats"
import { CharacterRelationships } from "@/components/character-relationships"
import { CharacterActivity } from "@/components/character-activity"
import { format } from "date-fns"
import { bloodColorMap } from "@/lib/constants"
import type { Character } from "@/types/character"

export default function CharacterDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [character, setCharacter] = useState<Character | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const storedCharacters = JSON.parse(localStorage.getItem("homestuckCharacters") || "[]")
    const foundCharacter = storedCharacters.find((char: Character) => char.id === params.id)

    if (foundCharacter) {
      setCharacter(foundCharacter)
    } else {
      router.push("/characters")
    }
  }, [params.id, router])

  const deleteCharacter = () => {
    const storedCharacters = JSON.parse(localStorage.getItem("homestuckCharacters") || "[]")
    const updatedCharacters = storedCharacters.filter((char: Character) => char.id !== params.id)
    localStorage.setItem("homestuckCharacters", JSON.stringify(updatedCharacters))
    router.push("/characters")
  }

  const setAsActive = () => {
    localStorage.setItem("activeCharacterId", character?.id || "")
    router.refresh()
  }

  // Apply character's typing quirk to text using the rule-based system
  const applyQuirk = (text: string, character: Character): string => {
    // If character has quirkRules, use those
    if (character.quirkRules && character.quirkRules.length > 0) {
      let result = text

      // Apply each enabled rule in order
      character.quirkRules
        .filter((rule) => rule.enabled)
        .forEach((rule) => {
          switch (rule.type) {
            case "replace":
              if (rule.find && rule.replace !== undefined) {
                const regex = new RegExp(rule.find, "g")
                result = result.replace(regex, rule.replace)
              }
              break

            case "prefix":
              if (rule.value) {
                result = `${rule.value}${result}`
              }
              break

            case "suffix":
              if (rule.value) {
                result = `${result}${rule.value}`
              }
              break

            case "capitalize":
              result = result
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
              break

            case "uppercase":
              result = result.toUpperCase()
              break

            case "lowercase":
              result = result.toLowerCase()
              break

            case "reverse":
              // Reverse capitalization (uppercase becomes lowercase and vice versa)
              result = result
                .split("")
                .map((char) => {
                  if (char === char.toUpperCase()) {
                    return char.toLowerCase()
                  } else {
                    return char.toUpperCase()
                  }
                })
                .join("")
              break

            case "repeat":
              if (rule.value === "alternate") {
                // Alternating caps like GaMzEe
                result = result
                  .split("")
                  .map((char, index) => (index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()))
                  .join("")
              }
              break
          }
        })

      return result
    }

    // Fallback to the old system for backward compatibility
    return text
  }

  if (!isClient || !character) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>
  }

  const bloodStyle = bloodColorMap[character.bloodColor] || { color: "#333333", textColor: "white" }
  const zodiacSign = bloodColorToZodiac[character.bloodColor] || "unknown"
  const isActive = localStorage.getItem("activeCharacterId") === character.id
  const creationDate = new Date(character.createdAt)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-12 max-w-5xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.push("/characters")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Characters
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Character info */}
        <div className="lg:col-span-2">
          <PesterlogCard
            bloodColor={character.bloodColor}
            header={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <ZodiacSymbol sign={zodiacSign} color={bloodStyle.textColor} className="mr-2" />
                  <span className="font-bold text-xl">{character.trollTag}</span>
                </div>
                {isActive && <Badge className="bg-green-500 text-white border-none">Active</Badge>}
              </div>
            }
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6 relative">
              <Avatar className="h-32 w-32 border-4" style={{ borderColor: bloodStyle.color }}>
                {character.imageUrl ? (
                  <AvatarImage src={character.imageUrl} alt={character.name} />
                ) : (
                  <AvatarFallback
                    className="text-4xl"
                    style={{
                      backgroundColor: bloodStyle.color,
                      color: bloodStyle.textColor,
                    }}
                  >
                    {getInitials(character.name)}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold">{character.name}</h1>
                <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                  <Badge variant="outline" className="capitalize">
                    {character.species}
                  </Badge>
                  <Badge variant="outline">{character.age}</Badge>
                  <Badge variant="outline">{character.gender}</Badge>
                  <Badge
                    style={{
                      backgroundColor: bloodStyle.color,
                      color: bloodStyle.textColor,
                    }}
                    className="capitalize"
                  >
                    {character.bloodColor} blood
                  </Badge>
                </div>

                <div className="mt-4 text-sm text-muted-foreground flex flex-wrap items-center gap-2 justify-center md:justify-start">
                  <span className="flex items-center">
                    <CalendarClock className="mr-1 h-4 w-4" />
                    Created {format(creationDate, "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList className="grid grid-cols-3 mb-6 bg-muted">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="quirk">Typing Quirk</TabsTrigger>
                <TabsTrigger value="stats">Stats</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Blood Caste</h3>
                    <div className="flex items-center">
                      <div
                        className="w-8 h-8 rounded-full mr-3 flex items-center justify-center"
                        style={{ backgroundColor: bloodStyle.color }}
                      >
                        <ZodiacSymbol sign={zodiacSign} color={bloodStyle.textColor} size="md" />
                      </div>
                      <div>
                        <p className="capitalize font-medium">{character.bloodColor}</p>
                        <p className="text-sm text-muted-foreground capitalize">{zodiacSign} sign</p>
                      </div>
                    </div>
                  </div>

                  {character.species === "troll" && character.lusus && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Lusus</h3>
                      <p className="text-muted-foreground">{character.lusus}</p>
                    </div>
                  )}
                </div>

                <Separator className="bg-muted" />

                <div>
                  <h3 className="text-lg font-semibold mb-2">Interests & Hobbies</h3>
                  <p className="text-muted-foreground">{character.interests}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Backstory</h3>
                  <div
                    className="text-muted-foreground whitespace-pre-line p-4 border rounded-md bg-muted"
                    style={{ borderColor: `${bloodStyle.color}40` }}
                  >
                    {character.backstory}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="quirk" className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Typing Quirk</h3>
                  <p className="text-muted-foreground mb-4">{character.quirk}</p>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => router.push(`/quirk-editor/${character.id}`)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Quirk
                    </Button>
                  </div>
                </div>

                <Separator className="bg-muted" />

                <div>
                  <h3 className="text-lg font-semibold mb-2">Quirk Preview</h3>
                  <div
                    className="p-4 border rounded-md bg-muted"
                    style={{
                      borderColor: `${bloodStyle.color}40`,
                      color: character.bloodColor === "gold" ? "#8a7e00" : bloodStyle.color,
                    }}
                  >
                    <p className="mb-2">{applyQuirk("Hello, my name is " + character.name + ".", character)}</p>
                    <p className="mb-2">
                      {applyQuirk("I am a " + character.bloodColor + " blood " + character.species + ".", character)}
                    </p>
                    <p>
                      {applyQuirk("I enjoy " + character.interests.split(",")[0].trim().toLowerCase() + ".", character)}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    This is how your character's text will appear in the feed.
                  </p>
                </div>

                {character.quirkRules && character.quirkRules.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Active Rules</h3>
                    <div className="space-y-2">
                      {character.quirkRules.filter((r) => r.enabled).length === 0 ? (
                        <p className="text-muted-foreground">No active rules</p>
                      ) : (
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                          {character.quirkRules
                            .filter((r) => r.enabled)
                            .map((rule, i) => (
                              <li key={i}>
                                {rule.type === "replace" && `Replace "${rule.find}" with "${rule.replace}"`}
                                {rule.type === "prefix" && `Add prefix "${rule.value}"`}
                                {rule.type === "suffix" && `Add suffix "${rule.value}"`}
                                {rule.type === "capitalize" && "Capitalize Each Word"}
                                {rule.type === "uppercase" && "UPPERCASE"}
                                {rule.type === "lowercase" && "lowercase"}
                                {rule.type === "reverse" && "rEVERSE cAPITALIZATION"}
                                {rule.type === "repeat" && rule.value === "alternate" && "AlTeRnAtInG cApS"}
                              </li>
                            ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="stats" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Character Stats</h3>
                    <CharacterStats character={character} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Relationships</h3>
                    <CharacterRelationships character={character} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex flex-col md:flex-row gap-4 justify-between mt-8">
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => router.push(`/edit/${character.id}`)}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span className="md:inline">Edit Character</span>
                </Button>
                <Button variant="outline" onClick={() => router.push(`/quirk-editor/${character.id}`)}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span className="md:inline">Edit Quirk</span>
                </Button>
              </div>
              <div className="flex gap-2">
                {!isActive && <Button onClick={setAsActive}>Set as Active</Button>}
                <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span className="md:inline">Delete</span>
                </Button>
              </div>
            </div>
          </PesterlogCard>
        </div>

        {/* Right column - Activity feed */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-4 border rounded-lg bg-[hsl(var(--tumblr-dark))]">
            <h2 className="font-bold text-xl mb-4">Recent Activity</h2>
            <CharacterActivity character={character} applyQuirk={applyQuirk} />
          </div>

          <div className="p-4 border rounded-lg bg-[hsl(var(--tumblr-dark))]">
            <h2 className="font-bold text-xl mb-4">Actions</h2>
            <div className="grid grid-cols-1 gap-2">
              <Button className="w-full justify-start" variant="outline" onClick={() => router.push("/feed")}>
                <MessageSquare className="mr-2 h-4 w-4" />
                View in Feed
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => router.push(`/edit/${character.id}`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Character
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => router.push(`/quirk-editor/${character.id}`)}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Edit Quirk
              </Button>
              {!isActive && (
                <Button className="w-full justify-start" onClick={setAsActive}>
                  <Check className="mr-2 h-4 w-4" />
                  Set as Active
                </Button>
              )}
              <Button className="w-full justify-start" variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                <AlertOctagon className="mr-2 h-4 w-4" />
                Delete Character
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this character?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your character and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteCharacter} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

