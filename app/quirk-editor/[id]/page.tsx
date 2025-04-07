"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { QuirkEditor, type QuirkRule } from "@/components/quirk-editor"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

type Character = {
  id: string
  name: string
  trollTag: string
  species: "troll" | "human"
  bloodColor: string
  quirk: string
  quirkRules?: QuirkRule[]
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

export default function QuirkEditorPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [character, setCharacter] = useState<Character | null>(null)
  const [isClient, setIsClient] = useState(false)

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

  const handleSaveQuirk = (rules: QuirkRule[]) => {
    if (!character) return

    // Generate a text description of the quirk for backward compatibility
    const quirkDescription = rules
      .filter((r) => r.enabled)
      .map((rule) => {
        switch (rule.type) {
          case "replace":
            return `Replace "${rule.find}" with "${rule.replace}"`
          case "prefix":
            return `Add prefix "${rule.value}"`
          case "suffix":
            return `Add suffix "${rule.value}"`
          case "capitalize":
            return "Capitalize Each Word"
          case "uppercase":
            return "UPPERCASE"
          case "lowercase":
            return "lowercase"
          case "reverse":
            return "rEVERSE cAPITALIZATION"
          case "repeat":
            if (rule.value === "alternate") return "AlTeRnAtInG cApS"
            return `Repeat pattern "${rule.value}"`
        }
      })
      .join(", ")

    // Update character in localStorage
    const storedCharacters = JSON.parse(localStorage.getItem("homestuckCharacters") || "[]")
    const updatedCharacters = storedCharacters.map((char: Character) => {
      if (char.id === character.id) {
        return {
          ...char,
          quirk: quirkDescription || character.quirk,
          quirkRules: rules,
        }
      }
      return char
    })

    localStorage.setItem("homestuckCharacters", JSON.stringify(updatedCharacters))

    // Navigate back to character page
    router.push(`/characters/${character.id}`)
  }

  if (!isClient || !character) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.push(`/characters/${character.id}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Character
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Typing Quirk</h1>
        <p className="text-muted-foreground">
          {character.name} ({character.trollTag})
        </p>
      </div>

      <QuirkEditor
        initialRules={character.quirkRules || []}
        onSave={handleSaveQuirk}
        onCancel={() => router.push(`/characters/${character.id}`)}
        characterBloodColor={bloodColorMap[character.bloodColor] || "#333"}
      />
    </div>
  )
}

