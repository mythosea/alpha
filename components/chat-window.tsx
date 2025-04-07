"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Maximize2, Minimize2, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ZodiacSymbol } from "@/components/zodiac-symbol"
import { bloodColorMap } from "@/lib/constants"
import { formatDistanceToNow } from "date-fns"
import type { Character } from "@/types/character"
import type { ChatMessage } from "@/types/chat"
import type { ZodiacSign } from "@/components/zodiac-symbol"

interface ChatWindowProps {
  contact: Character
  activeCharacter: Character
  messages: ChatMessage[]
  onClose: () => void
  onSendMessage: (content: string) => void
  zodiacSign: ZodiacSign
}

export function ChatWindow({
  contact,
  activeCharacter,
  messages,
  onClose,
  onSendMessage,
  zodiacSign,
}: ChatWindowProps) {
  const [input, setInput] = useState("")
  const [minimized, setMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages come in
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (input.trim()) {
      onSendMessage(input)
      setInput("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Apply typing quirk
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
              // Reverse capitalization
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

    // Fallback to simple implementation
    return text
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const contactBloodStyle = bloodColorMap[contact.bloodColor] || { color: "#333333", textColor: "white" }
  const activeBloodStyle = bloodColorMap[activeCharacter.bloodColor] || { color: "#333333", textColor: "white" }

  return (
    <div
      className={`w-72 bg-[hsl(var(--tumblr-darker))] rounded-t-md border-2 shadow-lg flex flex-col transition-all overflow-hidden ${minimized ? "h-10" : "h-80"}`}
      style={{ borderColor: contactBloodStyle.color }}
    >
      {/* Chat Header */}
      <div
        className="flex items-center justify-between p-1.5 cursor-move"
        style={{
          backgroundColor: contactBloodStyle.color,
          color: contactBloodStyle.textColor,
        }}
      >
        <div className="flex items-center gap-1.5 font-medium text-xs overflow-hidden">
          <ZodiacSymbol sign={zodiacSign} color={contactBloodStyle.textColor} size="sm" />
          <span className="truncate">{contact.trollTag}</span>
        </div>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 hover:bg-black/20"
            onClick={() => setMinimized(!minimized)}
          >
            {minimized ? (
              <Maximize2 className="h-3 w-3" style={{ color: contactBloodStyle.textColor }} />
            ) : (
              <Minimize2 className="h-3 w-3" style={{ color: contactBloodStyle.textColor }} />
            )}
          </Button>
          <Button variant="ghost" size="sm" className="h-5 w-5 p-0 hover:bg-black/20" onClick={onClose}>
            <X className="h-3 w-3" style={{ color: contactBloodStyle.textColor }} />
          </Button>
        </div>
      </div>

      {/* Chat Content */}
      {!minimized && (
        <>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {messages.length === 0 ? (
              <div className="text-center text-xs text-[hsl(var(--tumblr-text))] p-4">
                No messages yet. Start a conversation!
              </div>
            ) : (
              messages.map((message) => {
                const isFromContact = message.senderId === contact.id
                const sender = isFromContact ? contact : activeCharacter
                const senderBloodStyle = isFromContact ? contactBloodStyle : activeBloodStyle

                return (
                  <div key={message.id} className={`flex gap-2 ${isFromContact ? "justify-start" : "justify-end"}`}>
                    {isFromContact && (
                      <Avatar className="h-6 w-6 border" style={{ borderColor: senderBloodStyle.color }}>
                        {contact.imageUrl ? (
                          <AvatarImage src={contact.imageUrl} alt={contact.name} />
                        ) : (
                          <AvatarFallback
                            style={{
                              backgroundColor: senderBloodStyle.color,
                              color: senderBloodStyle.textColor,
                            }}
                            className="text-[10px]"
                          >
                            {getInitials(contact.name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    )}

                    <div className={`max-w-[80%] ${isFromContact ? "" : "order-1"}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-mono" style={{ color: senderBloodStyle.color }}>
                          {isFromContact ? contact.trollTag : activeCharacter.trollTag}
                        </span>
                        <span className="text-[9px] text-[hsl(var(--tumblr-text))]">
                          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                        </span>
                      </div>

                      <div
                        className="p-2 rounded bg-[hsl(var(--tumblr-dark))] text-xs whitespace-pre-wrap break-words"
                        style={{ color: isFromContact ? contactBloodStyle.color : activeBloodStyle.color }}
                      >
                        {applyQuirk(message.content, sender)}
                      </div>
                    </div>

                    {!isFromContact && (
                      <Avatar className="h-6 w-6 border" style={{ borderColor: senderBloodStyle.color }}>
                        {activeCharacter.imageUrl ? (
                          <AvatarImage src={activeCharacter.imageUrl} alt={activeCharacter.name} />
                        ) : (
                          <AvatarFallback
                            style={{
                              backgroundColor: senderBloodStyle.color,
                              color: senderBloodStyle.textColor,
                            }}
                            className="text-[10px]"
                          >
                            {getInitials(activeCharacter.name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    )}
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
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

