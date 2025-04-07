"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ZodiacSymbol, bloodColorToZodiac } from "@/components/zodiac-symbol"
import { bloodColorMap } from "@/lib/constants"
import { formatDistanceToNow } from "date-fns"
import type { Character } from "@/types/character"
import type { ChatMessage } from "@/types/chat"

export default function ChatPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeCharacter, setActiveCharacter] = useState<Character | null>(null)
  const [contact, setContact] = useState<Character | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize on client-side
  useEffect(() => {
    setIsClient(true)

    // Load characters and messages
    const storedCharacters = JSON.parse(localStorage.getItem("homestuckCharacters") || "[]")
    const activeId = localStorage.getItem("activeCharacterId")

    if (activeId) {
      const active = storedCharacters.find((char: Character) => char.id === activeId)
      if (active) {
        setActiveCharacter(active)
      }
    }

    const foundContact = storedCharacters.find((char: Character) => char.id === params.id)
    if (foundContact) {
      setContact(foundContact)
    } else {
      router.push("/pesterchum")
    }

    // Load chat messages
    const chatId = [activeId, params.id].sort().join("-")
    const savedMessages = localStorage.getItem("pesterchum-messages")
    if (savedMessages) {
      const allMessages = JSON.parse(savedMessages)
      setMessages(allMessages[chatId] || [])
    }
  }, [params.id, router])

  // Auto-scroll to bottom when new messages come in
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!activeCharacter || !contact || !input.trim()) return

    const chatId = [activeCharacter.id, contact.id].sort().join("-")
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: activeCharacter.id,
      receiverId: contact.id,
      content: input,
      timestamp: new Date().toISOString(),
      read: true,
    }

    // Update local state
    setMessages((prev) => [...prev, newMessage])
    setInput("")

    // Update localStorage
    const savedMessages = localStorage.getItem("pesterchum-messages")
    const allMessages = savedMessages ? JSON.parse(savedMessages) : {}

    const updatedMessages = {
      ...allMessages,
      [chatId]: [...(allMessages[chatId] || []), newMessage],
    }

    localStorage.setItem("pesterchum-messages", JSON.stringify(updatedMessages))

    // Simulate response after a short delay
    setTimeout(
      () => {
        simulateResponse()
      },
      1000 + Math.random() * 4000,
    ) // Random delay between 1-5 seconds
  }

  const simulateResponse = () => {
    if (!activeCharacter || !contact) return

    const chatId = [activeCharacter.id, contact.id].sort().join("-")
    const responseMessages = [
      "hey there!",
      "what's up?",
      "oh, interesting...",
      "i don't think that's a good idea",
      "have you talked to anyone else about this?",
      "so anyway, what are you up to?",
      "did you finish that thing you were working on?",
      "i'm busy right now, can we talk later?",
      "that's hilarious!",
      "i'm not sure i understand what you mean",
    ]

    const responseMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: contact.id,
      receiverId: activeCharacter.id,
      content: responseMessages[Math.floor(Math.random() * responseMessages.length)],
      timestamp: new Date().toISOString(),
      read: true,
    }

    // Update local state
    setMessages((prev) => [...prev, responseMessage])

    // Update localStorage
    const savedMessages = localStorage.getItem("pesterchum-messages")
    const allMessages = savedMessages ? JSON.parse(savedMessages) : {}

    const updatedMessages = {
      ...allMessages,
      [chatId]: [...(allMessages[chatId] || []), responseMessage],
    }

    localStorage.setItem("pesterchum-messages", JSON.stringify(updatedMessages))
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

  if (!isClient || !contact || !activeCharacter) {
    return <div className="flex items-center justify-center h-full">Loading...</div>
  }

  const contactBloodStyle = bloodColorMap[contact.bloodColor] || { color: "#333333", textColor: "white" }
  const activeBloodStyle = bloodColorMap[activeCharacter.bloodColor] || { color: "#333333", textColor: "white" }
  const zodiacSign = bloodColorToZodiac[contact.bloodColor] || "unknown"

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      {/* Chat Header */}
      <div className="p-3 flex items-center gap-3 border-b" style={{ borderColor: contactBloodStyle.color }}>
        <Button variant="ghost" onClick={() => router.push("/pesterchum")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <Avatar className="h-8 w-8 border-2" style={{ borderColor: contactBloodStyle.color }}>
          {contact.imageUrl ? (
            <AvatarImage src={contact.imageUrl} alt={contact.name} />
          ) : (
            <AvatarFallback
              style={{
                backgroundColor: contactBloodStyle.color,
                color: contactBloodStyle.textColor,
              }}
            >
              {getInitials(contact.name)}
            </AvatarFallback>
          )}
        </Avatar>

        <div>
          <div className="flex items-center gap-2">
            <ZodiacSymbol sign={zodiacSign} color={contactBloodStyle.color} size="sm" />
            <h2 className="font-medium">{contact.trollTag}</h2>
          </div>
          <p className="text-xs text-[hsl(var(--tumblr-text))]">{contact.name}</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-2">No messages yet.</p>
            <p className="text-sm text-muted-foreground">Start a conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isFromContact = message.senderId === contact.id
            const sender = isFromContact ? contact : activeCharacter
            const senderBloodStyle = isFromContact ? contactBloodStyle : activeBloodStyle

            return (
              <div key={message.id} className={`flex gap-2 ${isFromContact ? "justify-start" : "justify-end"}`}>
                {isFromContact && (
                  <Avatar className="h-8 w-8 border" style={{ borderColor: senderBloodStyle.color }}>
                    {contact.imageUrl ? (
                      <AvatarImage src={contact.imageUrl} alt={contact.name} />
                    ) : (
                      <AvatarFallback
                        style={{
                          backgroundColor: senderBloodStyle.color,
                          color: senderBloodStyle.textColor,
                        }}
                      >
                        {getInitials(contact.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                )}

                <div className={`max-w-[75%] ${isFromContact ? "" : "order-1"}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-mono" style={{ color: senderBloodStyle.color }}>
                      {isFromContact ? contact.trollTag : activeCharacter.trollTag}
                    </span>
                    <span className="text-[10px] text-[hsl(var(--tumblr-text))]">
                      {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                    </span>
                  </div>

                  <div
                    className="p-3 rounded bg-[hsl(var(--tumblr-dark))] text-sm whitespace-pre-wrap break-words"
                    style={{ color: isFromContact ? contactBloodStyle.color : activeBloodStyle.color }}
                  >
                    {applyQuirk(message.content, sender)}
                  </div>
                </div>

                {!isFromContact && (
                  <Avatar className="h-8 w-8 border" style={{ borderColor: senderBloodStyle.color }}>
                    {activeCharacter.imageUrl ? (
                      <AvatarImage src={activeCharacter.imageUrl} alt={activeCharacter.name} />
                    ) : (
                      <AvatarFallback
                        style={{
                          backgroundColor: senderBloodStyle.color,
                          color: senderBloodStyle.textColor,
                        }}
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
      <div className="p-4 border-t border-[hsl(var(--border))]">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button
            className="h-10 w-10 p-0"
            onClick={handleSendMessage}
            disabled={!input.trim()}
            style={{
              backgroundColor: activeBloodStyle.color,
              color: activeBloodStyle.textColor,
            }}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

