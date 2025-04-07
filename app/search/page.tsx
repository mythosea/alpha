"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, SortAsc, SortDesc, X } from "lucide-react"
import { PesterlogCard } from "@/components/pesterlog-card"
import { ZodiacSymbol, bloodColorToZodiac } from "@/components/zodiac-symbol"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { bloodColorMap } from "@/lib/constants"
import type { Character } from "@/types/character"

// Hemospectrum order for sorting
const HEMOSPECTRUM_ORDER = [
  "burgundy",
  "bronze",
  "gold",
  "lime",
  "olive",
  "jade",
  "teal",
  "cerulean",
  "indigo",
  "purple",
  "violet",
  "fuchsia",
  "human",
]

export default function SearchPage() {
  const router = useRouter()
  const [characters, setCharacters] = useState<Character[]>([])
  const [isClient, setIsClient] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<{
    species: string[]
    bloodColors: string[]
    gender: string[]
  }>({
    species: [],
    bloodColors: [],
    gender: [],
  })
  const [sortBy, setSortBy] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Memoize available genders to avoid recalculation
  const availableGenders = useMemo(() => {
    if (characters.length === 0) return []
    return [...new Set(characters.map((char) => char.gender))]
  }, [characters])

  // Load characters from localStorage only once on client-side
  useEffect(() => {
    setIsClient(true)
    const storedCharacters = JSON.parse(localStorage.getItem("homestuckCharacters") || "[]")
    setCharacters(storedCharacters)
  }, [])

  // Memoize filtered characters to avoid recalculation on every render
  const filteredCharacters = useMemo(() => {
    if (characters.length === 0) return []

    let results = [...characters]

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      results = results.filter(
        (char) =>
          char.name.toLowerCase().includes(query) ||
          char.trollTag.toLowerCase().includes(query) ||
          char.interests.toLowerCase().includes(query) ||
          char.backstory.toLowerCase().includes(query),
      )
    }

    // Apply species filter
    if (activeFilters.species.length > 0) {
      results = results.filter((char) => activeFilters.species.includes(char.species))
    }

    // Apply blood color filter
    if (activeFilters.bloodColors.length > 0) {
      results = results.filter((char) => activeFilters.bloodColors.includes(char.bloodColor))
    }

    // Apply gender filter
    if (activeFilters.gender.length > 0) {
      results = results.filter((char) => activeFilters.gender.includes(char.gender))
    }

    // Apply sorting
    results.sort((a, b) => {
      let valueA, valueB

      switch (sortBy) {
        case "name":
          valueA = a.name.toLowerCase()
          valueB = b.name.toLowerCase()
          break
        case "trollTag":
          valueA = a.trollTag.toLowerCase()
          valueB = b.trollTag.toLowerCase()
          break
        case "bloodColor":
          valueA = HEMOSPECTRUM_ORDER.indexOf(a.bloodColor)
          valueB = HEMOSPECTRUM_ORDER.indexOf(b.bloodColor)
          break
        case "createdAt":
          valueA = new Date(a.createdAt).getTime()
          valueB = new Date(b.createdAt).getTime()
          break
        default:
          valueA = a.name.toLowerCase()
          valueB = b.name.toLowerCase()
      }

      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1
      } else {
        return valueA < valueB ? 1 : -1
      }
    })

    return results
  }, [characters, searchQuery, activeFilters, sortBy, sortDirection])

  // Use useCallback for event handlers to prevent unnecessary re-renders
  const toggleFilter = useCallback((type: "species" | "bloodColors" | "gender", value: string) => {
    setActiveFilters((prev) => {
      const current = [...prev[type]]
      if (current.includes(value)) {
        return { ...prev, [type]: current.filter((v) => v !== value) }
      } else {
        return { ...prev, [type]: [...current, value] }
      }
    })
  }, [])

  const clearFilters = useCallback(() => {
    setActiveFilters({
      species: [],
      bloodColors: [],
      gender: [],
    })
    setSearchQuery("")
  }, [])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const getActiveFilterCount = useCallback(() => {
    return activeFilters.species.length + activeFilters.bloodColors.length + activeFilters.gender.length
  }, [activeFilters])

  if (!isClient) {
    return <div className="flex items-center justify-center h-full">Loading...</div>
  }

  return (
    <div className="space-y-4 pb-16 md:pb-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Character Search</h1>
      </div>

      <div className="bg-[hsl(var(--tumblr-dark))] rounded-lg border border-[hsl(var(--border))] p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, tag, interests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-[hsl(var(--tumblr-darker))]"
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                  {getActiveFilterCount() > 0 && (
                    <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                      {getActiveFilterCount()}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Filter Characters</h4>
                  <Separator />

                  <Accordion type="multiple" className="w-full">
                    <AccordionItem value="species">
                      <AccordionTrigger>Species</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="troll"
                              checked={activeFilters.species.includes("troll")}
                              onCheckedChange={() => toggleFilter("species", "troll")}
                            />
                            <Label htmlFor="troll">Troll</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="human"
                              checked={activeFilters.species.includes("human")}
                              onCheckedChange={() => toggleFilter("species", "human")}
                            />
                            <Label htmlFor="human">Human</Label>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="bloodColor">
                      <AccordionTrigger>Blood Color</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.keys(bloodColorMap).map((color) => (
                            <div key={color} className="flex items-center space-x-2">
                              <Checkbox
                                id={color}
                                checked={activeFilters.bloodColors.includes(color)}
                                onCheckedChange={() => toggleFilter("bloodColors", color)}
                              />
                              <div className="flex items-center gap-1.5">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: bloodColorMap[color].color }}
                                />
                                <Label htmlFor={color} className="capitalize">
                                  {color}
                                </Label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="gender">
                      <AccordionTrigger>Gender</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-2 gap-2">
                          {availableGenders.map((gender) => (
                            <div key={gender} className="flex items-center space-x-2">
                              <Checkbox
                                id={gender}
                                checked={activeFilters.gender.includes(gender)}
                                onCheckedChange={() => toggleFilter("gender", gender)}
                              />
                              <Label htmlFor={gender}>{gender}</Label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="flex justify-between pt-2">
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                    <Button size="sm" onClick={() => document.body.click()}>
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <div className="flex gap-1">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="trollTag">Troll Tag</SelectItem>
                  <SelectItem value="bloodColor">Blood Color</SelectItem>
                  <SelectItem value="createdAt">Date Created</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                aria-label={sortDirection === "asc" ? "Sort ascending" : "Sort descending"}
              >
                {sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {getActiveFilterCount() > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {activeFilters.species.map((species) => (
              <Badge key={species} variant="secondary" className="capitalize">
                {species}
                <button
                  className="ml-1"
                  onClick={() => toggleFilter("species", species)}
                  aria-label={`Remove ${species} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}

            {activeFilters.bloodColors.map((color) => (
              <Badge
                key={color}
                variant="outline"
                className="capitalize"
                style={{
                  backgroundColor: `${bloodColorMap[color].color}30`,
                  color: bloodColorMap[color].color,
                  borderColor: `${bloodColorMap[color].color}50`,
                }}
              >
                {color}
                <button
                  className="ml-1"
                  onClick={() => toggleFilter("bloodColors", color)}
                  aria-label={`Remove ${color} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}

            {activeFilters.gender.map((gender) => (
              <Badge key={gender} variant="secondary">
                {gender}
                <button
                  className="ml-1"
                  onClick={() => toggleFilter("gender", gender)}
                  aria-label={`Remove ${gender} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}

            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-muted-foreground">
          {filteredCharacters.length} {filteredCharacters.length === 1 ? "character" : "characters"} found
        </div>
      </div>

      {filteredCharacters.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[40vh] text-center">
          <h2 className="text-xl font-bold mb-2">No Characters Found</h2>
          <p className="text-muted-foreground mb-4">
            {characters.length === 0
              ? "You haven't created any characters yet."
              : "Try adjusting your search or filters."}
          </p>
          {characters.length === 0 && (
            <Button onClick={() => router.push("/create")}>Create Your First Character</Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCharacters.map((character) => {
            const bloodStyle = bloodColorMap[character.bloodColor] || { color: "#333333", textColor: "white" }
            const zodiacSign = bloodColorToZodiac[character.bloodColor] || "unknown"

            return (
              <PesterlogCard
                key={character.id}
                bloodColor={character.bloodColor}
                compact={true}
                header={
                  <div className="flex items-center justify-between w-full">
                    <span className="font-mono text-sm">{character.trollTag}</span>
                  </div>
                }
                footer={
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => router.push(`/characters/${character.id}`)}
                  >
                    View Profile
                  </Button>
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

