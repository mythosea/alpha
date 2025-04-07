"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Maximize2, Minimize2, X, Send, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { bloodColorMap } from "@/lib/constants"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@/contexts/auth-context"
import { useChat } from "@/contexts/chat-context"
import type { ChatRoom } from "@/types/chat"

interface MemoWindowProps {
  memo: ChatRoom
  onClose: () => void
}

export function MemoWindow({ memo, onClose }: MemoWindowProps) {
  const { user, getActiveCharacter } = useAuth()
  const { userPresence, sendMemoMessage, applyQuirk, getCharacterById } = useChat()

  const [input, setInput] = useState("")
  const [minimized, setMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeCharacter = getActiveCharacter()
  if (!activeCharacter || !user) return null

  // Auto-scroll to bottom when new messages come in
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [memo.messages])

  const handleSendMessage = () => {
    if (input.trim()) {
      sendMemoMessage(memo.id, input)
      setInput("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const activeBloodStyle = bloodColorMap[activeCharacter.bloodColor] || { color: "#333333", textColor: "white" }

  // Get online members
  const onlineMembers = memo.members.map((memberId) => userPresence[memberId]).filter(Boolean)

  return (
    <div
      className={`w-96 bg-[hsl(var(--tumblr-darker))] rounded-t-md border-2 shadow-lg flex flex-col transition-all overflow-hidden ${minimized ? "h-10" : "h-96"}`}
      style={{ borderColor: "hsl(var(--tumblr-royal-purple))" }}
    >
      {/* Memo Header */}
      <div
        className="flex items-center justify-between p-1.5 cursor-move"
        style={{
          backgroundColor: "hsl(var(--tumblr-royal-purple))",
          color: "white",
        }}
      >
        <div className="flex items-center gap-1.5 font-medium text-xs overflow-hidden">
          <Users className="h-3.5 w-3.5" />
          <span className="truncate">{memo.name}</span>
          <Badge variant="outline" className="text-[10px] h-4 border-white/50 text-white">
            {onlineMembers.length}/{memo.members.length}
          </Badge>
        </div>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 hover:bg-black/20"
            onClick={() => setMinimized(!minimized)}
          >
            {minimized ? <Maximize2 className="h-3 w-3 text-white" /> : <Minimize2 className="h-3 w-3 text-white" />}
          </Button>
          <Button variant="ghost" size="sm" className="h-5 w-5 p-0 hover:bg-black/20" onClick={onClose}>
            <X className="h-3 w-3 text-white" />
          </Button>
        </div>
      </div>

      {/* Memo Content */}
      {!minimized && (
        <>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {memo.messages.length === 0 ? (
              <div className="text-center text-xs text-[hsl(var(--tumblr-text))] p-4">
                No messages yet in this memo.
              </div>
            ) : (
              memo.messages.map((message) => {
                const isFromCurrentUser = message.senderId === user.id
                const senderPresence = userPresence[message.senderId]
                const senderCharacter = getCharacterById(message.senderCharacterId)

                if (!senderCharacter) return null

                const senderBloodStyle = bloodColorMap[senderCharacter.bloodColor] || {
                  color: "#333333",
                  textColor: "white",
                }

                return (
                  <div key={message.id} className="flex gap-2">
                    <Avatar className="h-6 w-6 border" style={{ borderColor: senderBloodStyle.color }}>
                      {senderCharacter.imageUrl ? (
                        <AvatarImage src={senderCharacter.imageUrl} alt={senderCharacter.name} />
                      ) : (
                        <AvatarFallback
                          style={{
                            backgroundColor: senderBloodStyle.color,
                            color: senderBloodStyle.textColor,
                          }}
                          className="text-[10px]"
                        >
                          {getInitials(senderCharacter.name)}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div className="max-w-[85%]">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-mono" style={{ color: senderBloodStyle.color }}>
                            {senderCharacter.trollTag}
                          </span>
                          {senderPresence && (
                            <span className="text-[9px] text-[hsl(var(--tumblr-text))]">
                              ({senderPresence.username})
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] text-[hsl(var(--tumblr-text))]">
                          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                        </span>
                      </div>

                      <div
                        className="p-2 rounded bg-[hsl(var(--tumblr-dark))] text-xs whitespace-pre-wrap break-words"
                        style={{ color: senderBloodStyle.color }}
                      >
                        {applyQuirk(message.content, senderCharacter)}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Memo Input */}
          <div className="p-2 border-t border-[hsl(var(--border))] bg-[hsl(var(--tumblr-dark))]">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 h-8 text-xs"
              />
              <Button
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleSendMessage}
                disabled={!input.trim()}
                style={{
                  backgroundColor: activeBloodStyle.color,
                  color: activeBloodStyle.textColor,
                }}
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

