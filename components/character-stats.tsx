"use client"

import { useMemo } from "react"
import type { Character } from "@/types/character"
import { bloodColorMap } from "@/lib/constants"

interface CharacterStatsProps {
  character: Character
}

export function CharacterStats({ character }: CharacterStatsProps) {
  // Generate random stats for demo
  const stats = useMemo(() => {
    const seed = character.id.split("").reduce((a, b) => a + b.charCodeAt(0), 0)
    const random = (min: number, max: number) => {
      const x = Math.sin(seed) * 10000
      return Math.floor((x - Math.floor(x)) * (max - min + 1) + min)
    }

    return {
      strength: random(1, 10),
      intelligence: random(1, 10),
      luck: random(1, 10),
      charisma: random(1, 10),
      vitality: random(1, 10),
    }
  }, [character.id])

  const bloodStyle = bloodColorMap[character.bloodColor] || { color: "#333333", textColor: "white" }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Strength</span>
          <span>{stats.strength}/10</span>
        </div>
        <div className="h-2 bg-[hsl(var(--tumblr-darker))] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${stats.strength * 10}%`,
              backgroundColor: bloodStyle.color,
            }}
          ></div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Intelligence</span>
          <span>{stats.intelligence}/10</span>
        </div>
        <div className="h-2 bg-[hsl(var(--tumblr-darker))] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${stats.intelligence * 10}%`,
              backgroundColor: bloodStyle.color,
            }}
          ></div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Luck</span>
          <span>{stats.luck}/10</span>
        </div>
        <div className="h-2 bg-[hsl(var(--tumblr-darker))] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${stats.luck * 10}%`,
              backgroundColor: bloodStyle.color,
            }}
          ></div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Charisma</span>
          <span>{stats.charisma}/10</span>
        </div>
        <div className="h-2 bg-[hsl(var(--tumblr-darker))] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${stats.charisma * 10}%`,
              backgroundColor: bloodStyle.color,
            }}
          ></div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Vitality</span>
          <span>{stats.vitality}/10</span>
        </div>
        <div className="h-2 bg-[hsl(var(--tumblr-darker))] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${stats.vitality * 10}%`,
              backgroundColor: bloodStyle.color,
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}

