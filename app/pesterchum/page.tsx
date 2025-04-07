"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Users, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { bloodColorMap } from "@/lib/constants"
import { useAuth } from "@/contexts/auth-context"
import { useChat } from "@/contexts/chat-context"
import { CreateMemoDialog } from "@/components/pesterchum/create-memo-dialog"

export default function PesterchumPage() {
  const router = useRouter()
  const { user, getActiveCharacter } = useAuth()
  const { userPresence, chatRooms, openChat, openMemo, getCharacterById } = useChat()

  const [activeTab, setActiveTab] = useState<"chats" | "memos">("chats")
  const [createMemoOpen, setCreateMemoOpen] = useState(false)

  const activeCharacter = getActiveCharacter()

  // Get online users (excluding current user)
  const onlineUsers = Object.values(userPresence).filter(
    (presence) => presence.status === "online" && presence.userId !== user?.id && presence.activeCharacterId,
  )

  // Get available memos (public or user is a member)
  const availableMemos = chatRooms.filter((room) => room.isPublic || (user && room.members.includes(user.id)))

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

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

  const handleOpenChat = (userId: string) => {
    openChat(userId)
    router.push("/feed") // Return to feed to see the chat
  }

  const handleOpenMemo = (roomId: string) => {
    openMemo(roomId)
    router.push("/feed") // Return to feed to see the memo
  }

  if (!user) {
    router.push("/login")
    return null
  }

  if (!activeCharacter) {
    return (
      <div className="container mx-auto px-4 pb-16 md:pb-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => router.push("/feed")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Pesterchum</h1>
        </div>

        <div className="text-center py-12 bg-[hsl(var(--tumblr-dark))] rounded-lg">
          <p className="text-muted-foreground mb-4">You need to select a character to use Pesterchum.</p>
          <Button onClick={() => router.push("/characters")}>Select Character</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 pb-16 md:pb-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => router.push("/feed")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Pesterchum</h1>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mb-6">
        <TabsList className="grid w-full grid-cols-2 h-9">
          <TabsTrigger value="chats" className="text-xs">
            <MessageSquare className="h-4 w-4 mr-2" />
            Chats
          </TabsTrigger>
          <TabsTrigger value="memos" className="text-xs">
            <Users className="h-4 w-4 mr-2" />
            Memos
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === "chats" ? (
        <div className="space-y-2">
          {onlineUsers.length === 0 ? (
            <div className="text-center py-12 bg-[hsl(var(--tumblr-dark))] rounded-lg">
              <p className="text-muted-foreground mb-2">No users online.</p>
              <p className="text-sm text-muted-foreground">Check back later!</p>
            </div>
          ) : (
            onlineUsers.map((presence) => {
              const character = getCharacterById(presence.activeCharacterId || "")
              if (!character) return null

              const bloodStyle = bloodColorMap[character.bloodColor] || { color: "#333333", textColor: "white" }

              return (
                <div
                  key={presence.userId}
                  className="flex items-center p-3 rounded-md cursor-pointer hover:bg-[hsl(var(--tumblr-dark))] border border-[hsl(var(--border))]"
                  onClick={() => handleOpenChat(presence.userId)}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2" style={{ borderColor: bloodStyle.color }}>
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
                    <div
                      className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full ${getStatusColor(presence.status)} border border-background`}
                    />
                  </div>

                  <div className="ml-3 flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{character.trollTag}</p>
                      <Badge className="bg-green-500 border-0 text-white text-xs">Online</Badge>
                    </div>
                    <p className="text-xs truncate text-[hsl(var(--tumblr-text))]">{presence.username}</p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Available Memos</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCreateMemoOpen(true)}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              New Memo
            </Button>
          </div>

          {availableMemos.length === 0 ? (
            <div className="text-center py-12 bg-[hsl(var(--tumblr-dark))] rounded-lg">
              <p className="text-muted-foreground mb-2">No memos available.</p>
              <p className="text-sm text-muted-foreground">Create a new memo to get started!</p>
            </div>
          ) : (
            availableMemos.map((room) => (
              <div
                key={room.id}
                className="flex items-center p-3 rounded-md cursor-pointer hover:bg-[hsl(var(--tumblr-dark))] border border-[hsl(var(--border))]"
                onClick={() => handleOpenMemo(room.id)}
              >
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[hsl(var(--tumblr-dark))] border border-[hsl(var(--tumblr-royal-purple))]">
                  <Users className="h-5 w-5 text-[hsl(var(--tumblr-royal-purple))]" />
                </div>

                <div className="ml-3 flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{room.name}</p>
                    <Badge variant="outline" className="text-xs">
                      {room.members.length} {room.members.length === 1 ? "Member" : "Members"}
                    </Badge>
                  </div>
                  <p className="text-xs truncate text-[hsl(var(--tumblr-text))]">
                    {room.description || (room.isPublic ? "Public Memo" : "Private Memo")}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <CreateMemoDialog open={createMemoOpen} onOpenChange={setCreateMemoOpen} />
    </div>
  )
}

