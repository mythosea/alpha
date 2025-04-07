"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Circle, SquareCode, Settings, Plus, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { bloodColorMap } from "@/lib/constants"
import { bloodColorToZodiac } from "@/components/zodiac-symbol"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useChat } from "@/contexts/chat-context"
import { CreateMemoDialog } from "@/components/pesterchum/create-memo-dialog"

export function PesterchumSidebar() {
  const router = useRouter()
  const { user, getActiveCharacter } = useAuth()
  const { userPresence, chatRooms, openChat, openMemo, getCharacterById } = useChat()

  const [expanded, setExpanded] = useState(true)
  const [activeTab, setActiveTab] = useState<"chats" | "memos">("chats")
  const [createMemoOpen, setCreateMemoOpen] = useState(false)

  const activeCharacter = getActiveCharacter()

  // Get online users (excluding current user)
  const onlineUsers = Object.values(userPresence).filter(
    (presence) => presence.status !== "offline" && presence.userId !== user?.id && presence.activeCharacterId,
  )

  // Get available memos (public or user is a member)
  const availableMemos = chatRooms.filter((room) => room.isPublic || (user && room.members.includes(user.id)))

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "idle":
        return "bg-yellow-500"
      case "busy":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  if (!user) return null

  return (
    <>
      <Collapsible open={expanded} onOpenChange={setExpanded} className="border-t border-[hsl(var(--border))]">
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-[hsl(var(--tumblr-dark))] transition-colors">
          <div className="flex items-center gap-2">
            <SquareCode className="h-4 w-4 text-[hsl(var(--tumblr-royal-purple))]" />
            <span className="font-medium text-sm font-mono">PESTERCHUM</span>
            {!expanded && onlineUsers.length > 0 && (
              <Badge className="ml-2 bg-green-500 text-white text-xs">{onlineUsers.length}</Badge>
            )}
          </div>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-[hsl(var(--tumblr-text))]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[hsl(var(--tumblr-text))]" />
          )}
        </CollapsibleTrigger>

        <CollapsibleContent className="px-2 pb-3">
          {!activeCharacter ? (
            <div className="p-3 text-center text-sm text-[hsl(var(--tumblr-text))]">
              <p className="mb-2">You need to select a character to use Pesterchum.</p>
              <Button variant="outline" size="sm" className="w-full" onClick={() => router.push("/characters")}>
                Select Character
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-2 mb-2">
                <div className="flex items-center gap-2 text-xs text-[hsl(var(--tumblr-text))]">
                  <Circle className="h-2 w-2 text-green-500" />
                  <span>{onlineUsers.length} Online</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Set Status</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/pesterchum")}>Open Pesterchum</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mb-2">
                <TabsList className="w-full grid grid-cols-2 h-8">
                  <TabsTrigger value="chats" className="text-xs">
                    Chats
                  </TabsTrigger>
                  <TabsTrigger value="memos" className="text-xs">
                    Memos
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {activeTab === "chats" ? (
                <div className="space-y-1 max-h-[200px] overflow-y-auto pr-1">
                  {onlineUsers.length === 0 ? (
                    <div className="text-center py-4 text-xs text-[hsl(var(--tumblr-text))]">No users online</div>
                  ) : (
                    onlineUsers.map((presence) => {
                      const character = getCharacterById(presence.activeCharacterId || "")
                      if (!character) return null

                      const bloodStyle = bloodColorMap[character.bloodColor] || { color: "#333333", textColor: "white" }
                      const zodiacSign = bloodColorToZodiac[character.bloodColor] || "unknown"

                      return (
                        <div
                          key={presence.userId}
                          className="flex items-center p-2 rounded-md cursor-pointer hover:bg-[hsl(var(--tumblr-dark))]"
                          onClick={() => openChat(presence.userId)}
                        >
                          <div className="relative">
                            <Avatar className="h-7 w-7 border-2" style={{ borderColor: bloodStyle.color }}>
                              {character.imageUrl ? (
                                <AvatarImage src={character.imageUrl} alt={character.name} />
                              ) : (
                                <AvatarFallback
                                  style={{
                                    backgroundColor: bloodStyle.color,
                                    color: bloodStyle.textColor,
                                  }}
                                  className="text-xs"
                                >
                                  {getInitials(character.name)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div
                              className={`absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full ${getStatusColor(presence.status)} border border-background ${presence.status === "online" ? "animate-pulse" : ""}`}
                            />
                          </div>

                          <div className="ml-3 flex-1 overflow-hidden">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-medium truncate">{character.trollTag}</p>
                              {presence.status === "busy" && <span className="text-[10px] text-red-400">Busy</span>}
                              {presence.status === "idle" && <span className="text-[10px] text-yellow-400">Idle</span>}
                            </div>
                            <p className="text-[10px] truncate text-[hsl(var(--tumblr-text))]">{presence.username}</p>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              ) : (
                <div className="space-y-1 max-h-[200px] overflow-y-auto pr-1">
                  <div className="flex justify-between items-center mb-1 px-2">
                    <span className="text-xs text-[hsl(var(--tumblr-text))]">Memos</span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setCreateMemoOpen(true)}>
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {availableMemos.length === 0 ? (
                    <div className="text-center py-4 text-xs text-[hsl(var(--tumblr-text))]">No memos available</div>
                  ) : (
                    availableMemos.map((room) => (
                      <div
                        key={room.id}
                        className="flex items-center p-2 rounded-md cursor-pointer hover:bg-[hsl(var(--tumblr-dark))]"
                        onClick={() => openMemo(room.id)}
                      >
                        <div className="flex items-center justify-center h-7 w-7 rounded-full bg-[hsl(var(--tumblr-dark))] border border-[hsl(var(--border))]">
                          <Users className="h-3.5 w-3.5 text-[hsl(var(--tumblr-royal-purple))]" />
                        </div>

                        <div className="ml-3 flex-1 overflow-hidden">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium truncate">{room.name}</p>
                            <Badge variant="outline" className="text-[10px] h-4">
                              {room.members.length}
                            </Badge>
                          </div>
                          <p className="text-[10px] truncate text-[hsl(var(--tumblr-text))]">
                            {room.isPublic ? "Public" : "Private"} Memo
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </CollapsibleContent>
      </Collapsible>

      <CreateMemoDialog open={createMemoOpen} onOpenChange={setCreateMemoOpen} />
    </>
  )
}

