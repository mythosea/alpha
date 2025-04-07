"use client"

import { useAuth } from "@/contexts/auth-context"
import { useChat } from "@/contexts/chat-context"
import { PrivateChatWindow } from "@/components/pesterchum/private-chat-window"
import { MemoWindow } from "@/components/pesterchum/memo-window"

export function ChatWindows() {
  const { user } = useAuth()
  const { activeChats, activeMemo, userPresence, chatRooms, closeChat, closeMemo, getCharacterById } = useChat()

  if (!user) return null

  // Get chat windows data
  const chatWindows = activeChats
    .map((userId) => {
      const presence = userPresence[userId]
      if (!presence || !presence.activeCharacterId) return null

      const character = getCharacterById(presence.activeCharacterId)
      if (!character) return null

      return {
        userId,
        character,
        username: presence.username,
      }
    })
    .filter(Boolean)

  // Get memo window data
  const memoWindow = activeMemo ? chatRooms.find((room) => room.id === activeMemo) : null

  return (
    <div className="fixed bottom-0 right-4 flex flex-col-reverse items-end gap-2 z-50">
      {/* Private chat windows */}
      {chatWindows.map((chat) => (
        <PrivateChatWindow
          key={chat!.userId}
          userId={chat!.userId}
          character={chat!.character}
          username={chat!.username}
          onClose={() => closeChat(chat!.userId)}
        />
      ))}

      {/* Memo window */}
      {memoWindow && <MemoWindow memo={memoWindow} onClose={closeMemo} />}
    </div>
  )
}

