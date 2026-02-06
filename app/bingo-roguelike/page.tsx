"use client"

import { useEffect, useMemo, useState } from "react"
import { Sparkles, Sword, Skull, Gem, Flame, HandCoins, HeartPulse, Crown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type RoomType = "battle" | "elite" | "trap" | "shrine" | "treasure" | "merchant" | "boss"

type Room = {
  id: string
  type: RoomType
  label: string
  cleared: boolean
}

type Stats = {
  hp: number
  maxHp: number
  power: number
  luck: number
  gold: number
  keys: number
  act: number
}

const roomDefinitions: Record<RoomType, { label: string; description: string; tone: string }> = {
  battle: {
    label: "Skirmish",
    description: "Fight a minor foe for gold.",
    tone: "border-[hsl(var(--tumblr-royal-purple))]",
  },
  elite: {
    label: "Elite",
    description: "Hard fight, powerful boon.",
    tone: "border-[hsl(var(--tumblr-accent))]",
  },
  trap: {
    label: "Trap",
    description: "Risk damage for quick loot.",
    tone: "border-red-500/70",
  },
  shrine: {
    label: "Shrine",
    description: "Heal or gain luck.",
    tone: "border-emerald-400/70",
  },
  treasure: {
    label: "Treasure",
    description: "Gold, keys, and relics.",
    tone: "border-yellow-400/70",
  },
  merchant: {
    label: "Merchant",
    description: "Trade gold for upgrades.",
    tone: "border-sky-400/70",
  },
  boss: {
    label: "Boss",
    description: "A major showdown.",
    tone: "border-amber-400",
  },
}

const roomTypeOrder: RoomType[] = [
  "battle",
  "battle",
  "battle",
  "trap",
  "trap",
  "shrine",
  "shrine",
  "treasure",
  "merchant",
  "elite",
]

const roll = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

const createBoard = () => {
  const rooms: Room[] = []
  for (let i = 0; i < 25; i += 1) {
    rooms.push({
      id: `room-${Date.now()}-${i}-${Math.random().toString(16).slice(2)}`,
      type: "battle",
      label: "Skirmish",
      cleared: false,
    })
  }

  const shuffled = [...roomTypeOrder, ...roomTypeOrder, ...roomTypeOrder]
    .slice(0, 24)
    .sort(() => Math.random() - 0.5)

  rooms.forEach((room, index) => {
    if (index === 12) {
      room.type = "boss"
      room.label = roomDefinitions.boss.label
      return
    }
    const type = shuffled.shift() ?? "battle"
    room.type = type
    room.label = roomDefinitions[type].label
  })

  return rooms
}

const startingStats: Stats = {
  hp: 24,
  maxHp: 24,
  power: 1,
  luck: 0,
  gold: 15,
  keys: 0,
  act: 1,
}

const getLineIndices = () => {
  const lines: number[][] = []
  for (let row = 0; row < 5; row += 1) {
    lines.push([0, 1, 2, 3, 4].map((col) => row * 5 + col))
  }
  for (let col = 0; col < 5; col += 1) {
    lines.push([0, 1, 2, 3, 4].map((row) => row * 5 + col))
  }
  lines.push([0, 6, 12, 18, 24])
  lines.push([4, 8, 12, 16, 20])
  return lines
}

const lineIndices = getLineIndices()

export default function BingoRoguelikePage() {
  const [board, setBoard] = useState<Room[]>(() => createBoard())
  const [stats, setStats] = useState<Stats>({ ...startingStats })
  const [logEntries, setLogEntries] = useState<string[]>([
    "Welcome to the Bingo Run. Clear rooms to build lines.",
  ])
  const [status, setStatus] = useState<"running" | "won" | "lost">("running")

  const completedLines = useMemo(() => {
    return lineIndices.filter((line) => line.every((index) => board[index]?.cleared)).length
  }, [board])

  useEffect(() => {
    if (stats.hp <= 0 && status !== "lost") {
      setStatus("lost")
    }
  }, [stats.hp, status])

  useEffect(() => {
    if (completedLines >= 3 && status === "running") {
      setStatus("won")
      setLogEntries((prev) => ["Bingo! You secured three full lines and escaped the dungeon.", ...prev])
    }
  }, [completedLines, status])

  const pushLog = (entry: string) => {
    setLogEntries((prev) => [entry, ...prev].slice(0, 12))
  }

  const applyRoomEffect = (room: Room) => {
    setBoard((prev) => prev.map((tile) => (tile.id === room.id ? { ...tile, cleared: true } : tile)))

    setStats((prev) => {
      let next = { ...prev }
      const luckBonus = Math.max(0, next.luck)
      if (room.type === "battle") {
        const damage = Math.max(0, roll(2, 6) + next.act - next.power)
        const gold = roll(3, 7) + luckBonus
        next.hp = Math.max(0, next.hp - damage)
        next.gold += gold
        pushLog(`Skirmish cleared. Took ${damage} damage, looted ${gold} gold.`)
      }
      if (room.type === "elite") {
        const damage = Math.max(1, roll(5, 9) + next.act - next.power)
        const relicRoll = roll(1, 10) + luckBonus
        next.hp = Math.max(0, next.hp - damage)
        next.gold += roll(6, 12)
        if (relicRoll >= 12) {
          next.maxHp += 2
          next.hp += 2
          pushLog("Elite conquered. Found a relic that bolstered your vitality.")
        } else {
          next.power += 1
          pushLog("Elite conquered. Your power surged from the victory.")
        }
      }
      if (room.type === "trap") {
        const damage = roll(1, 5)
        const gold = roll(1, 4)
        next.hp = Math.max(0, next.hp - damage)
        next.gold += gold
        pushLog(`Trap triggered. Took ${damage} damage, grabbed ${gold} gold while escaping.`)
      }
      if (room.type === "shrine") {
        const heal = roll(4, 8) + Math.floor(luckBonus / 2)
        next.hp = Math.min(next.maxHp, next.hp + heal)
        if (roll(1, 6) + luckBonus >= 6) {
          next.luck += 1
          pushLog("Shrine blessing: restored health and improved your luck.")
        } else {
          pushLog(`Shrine blessing: restored ${heal} health.`)
        }
      }
      if (room.type === "treasure") {
        const gold = roll(8, 14) + luckBonus
        const keyChance = roll(1, 10) + luckBonus
        next.gold += gold
        if (keyChance >= 9) {
          next.keys += 1
          pushLog(`Treasure room! Gained ${gold} gold and a key.`)
        } else {
          pushLog(`Treasure room! Gained ${gold} gold.`)
        }
      }
      if (room.type === "merchant") {
        if (next.gold >= 10) {
          next.gold -= 10
          next.power += 1
          pushLog("Merchant trade: spent 10 gold to upgrade power.")
        } else {
          next.luck += 1
          pushLog("Merchant shared a secret route. Luck increased.")
        }
      }
      if (room.type === "boss") {
        const damage = Math.max(2, roll(7, 12) + next.act - next.power)
        next.hp = Math.max(0, next.hp - damage)
        next.keys += 1
        next.act += 1
        pushLog("Boss defeated! You advanced deeper with a new key.")
      }

      return next
    })
  }

  const handleRoomClick = (room: Room) => {
    if (status !== "running" || room.cleared || stats.hp <= 0) {
      return
    }
    applyRoomEffect(room)
  }

  const resetRun = () => {
    setBoard(createBoard())
    setStats({ ...startingStats })
    setLogEntries(["New run initialized. Fortune favors the bold."])
    setStatus("running")
  }

  const statusBadge = status === "won" ? "BINGO SECURED" : status === "lost" ? "RUN FAILED" : "IN PROGRESS"

  return (
    <div className="min-h-full bg-[hsl(var(--tumblr-bg))] text-white">
      <div className="px-6 py-8 max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="border-[hsl(var(--tumblr-royal-purple))] text-white font-mono">
              BINGO ROGUELIKE
            </Badge>
            <Badge variant="outline" className="border-[hsl(var(--tumblr-accent))] text-white font-mono">
              {statusBadge}
            </Badge>
            <Badge variant="secondary" className="bg-[hsl(var(--tumblr-dark))] text-white font-mono">
              Lines: {completedLines}/3
            </Badge>
            <Badge variant="secondary" className="bg-[hsl(var(--tumblr-dark))] text-white font-mono">
              Act {stats.act}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold font-mono">Bingo Run: Depths of Fortuna</h1>
              <p className="text-sm text-[hsl(var(--tumblr-text))] max-w-2xl">
                Carve a path through a shifting bingo board. Each cleared room reshapes your build, and three completed
                lines secure victory.
              </p>
            </div>
            <Button onClick={resetRun} variant="outline" className="border-[hsl(var(--tumblr-royal-purple))]">
              Reset Run
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[2fr,1fr] gap-6">
          <Card className="bg-[hsl(var(--tumblr-dark))] border-[hsl(var(--border))] p-4">
            <div className="grid grid-cols-5 gap-3">
              {board.map((room) => {
                const icon =
                  room.type === "battle"
                    ? Sword
                    : room.type === "elite"
                      ? Crown
                      : room.type === "trap"
                        ? Flame
                        : room.type === "shrine"
                          ? HeartPulse
                          : room.type === "treasure"
                            ? Gem
                            : room.type === "merchant"
                              ? HandCoins
                              : Skull
                const Icon = icon
                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => handleRoomClick(room)}
                    className={cn(
                      "rounded-lg border-2 p-3 text-left transition",
                      "bg-[hsl(var(--tumblr-darker))] hover:bg-[hsl(var(--tumblr-dark))]",
                      roomDefinitions[room.type].tone,
                      room.cleared && "opacity-60",
                      status !== "running" && "cursor-not-allowed",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-[hsl(var(--tumblr-text))]">
                        {room.type}
                      </span>
                      <Icon className="h-4 w-4 text-[hsl(var(--tumblr-royal-purple))]" />
                    </div>
                    <div className="mt-2 text-sm font-semibold">{room.label}</div>
                    <div className="text-[10px] text-[hsl(var(--tumblr-text))]">
                      {roomDefinitions[room.type].description}
                    </div>
                    {room.cleared && (
                      <div className="mt-2 text-[10px] font-mono text-emerald-300">CLEARED</div>
                    )}
                  </button>
                )
              })}
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="bg-[hsl(var(--tumblr-dark))] border-[hsl(var(--border))] p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-mono">
                <Sparkles className="h-4 w-4 text-[hsl(var(--tumblr-royal-purple))]" />
                RUN STATS
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md bg-[hsl(var(--tumblr-darker))] p-3">
                  <div className="text-xs text-[hsl(var(--tumblr-text))]">HP</div>
                  <div className="text-lg font-semibold">
                    {stats.hp}/{stats.maxHp}
                  </div>
                </div>
                <div className="rounded-md bg-[hsl(var(--tumblr-darker))] p-3">
                  <div className="text-xs text-[hsl(var(--tumblr-text))]">Power</div>
                  <div className="text-lg font-semibold">{stats.power}</div>
                </div>
                <div className="rounded-md bg-[hsl(var(--tumblr-darker))] p-3">
                  <div className="text-xs text-[hsl(var(--tumblr-text))]">Luck</div>
                  <div className="text-lg font-semibold">{stats.luck}</div>
                </div>
                <div className="rounded-md bg-[hsl(var(--tumblr-darker))] p-3">
                  <div className="text-xs text-[hsl(var(--tumblr-text))]">Gold</div>
                  <div className="text-lg font-semibold">{stats.gold}</div>
                </div>
                <div className="rounded-md bg-[hsl(var(--tumblr-darker))] p-3">
                  <div className="text-xs text-[hsl(var(--tumblr-text))]">Keys</div>
                  <div className="text-lg font-semibold">{stats.keys}</div>
                </div>
                <div className="rounded-md bg-[hsl(var(--tumblr-darker))] p-3">
                  <div className="text-xs text-[hsl(var(--tumblr-text))]">Status</div>
                  <div className="text-sm font-semibold">{statusBadge}</div>
                </div>
              </div>
              <div className="rounded-md border border-dashed border-[hsl(var(--tumblr-royal-purple))] p-3 text-xs text-[hsl(var(--tumblr-text))]">
                Boss rooms grant keys. Collect keys to survive deeper acts, and race the bingo lines before your HP runs
                out.
              </div>
            </Card>

            <Card className="bg-[hsl(var(--tumblr-dark))] border-[hsl(var(--border))] p-4">
              <div className="flex items-center gap-2 text-sm font-mono mb-3">
                <Skull className="h-4 w-4 text-[hsl(var(--tumblr-royal-purple))]" />
                RUN LOG
              </div>
              <ScrollArea className="h-64 pr-2">
                <div className="space-y-2 text-xs text-[hsl(var(--tumblr-text))]">
                  {logEntries.map((entry, index) => (
                    <div key={`${entry}-${index}`} className="rounded-md bg-[hsl(var(--tumblr-darker))] p-2">
                      {entry}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
