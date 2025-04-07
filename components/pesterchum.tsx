"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Circle, SquareCode, Settings } from "lucide-react"
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
import { bloodColorMap } from "@/lib/constants"
import { bloodColorToZodiac } from "@/components/zodiac-symbol"
import { useRouter } from "next/navigation"
import { ChatWindow } from "@/components/chat-window"
import type { Character } from "@/types/character"
import type { ChatMessage } from "@/types/chat"

type Contact = Character & {
  status: "online" | "offline" | "idle" | "busy"
  unreadCount: number
}

export function Pesterchum() {
  const router = useRouter()
  const [activeCharacter, setActiveCharacter] = useState<Character | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [expanded, setExpanded] = useState(true)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [openChats, setOpenChats] = useState<string[]>([])
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({})

  // Initialize on client-side
  useEffect(() => {
    setIsClient(true)

    // Load active character
    const storedCharacters = JSON.parse(localStorage.getItem("homestuckCharacters") || "[]")
    const activeId = localStorage.getItem("activeCharacterId")

    if (activeId) {
      const active = storedCharacters.find((char: Character) => char.id === activeId)
      if (active) {
        setActiveCharacter(active)
      }
    }

    // For demo purposes, load all other characters as contacts
    const otherCharacters = storedCharacters
      .filter((char: Character) => char.id !== activeId)
      .map((char: Character) => ({
        ...char,
        status: Math.random() > 0.3 ? "online" : "offline", // Randomly online or offline
        unreadCount: Math.floor(Math.random() * 3), // Random unread count for demo
      }))

    setContacts(otherCharacters)

    // Load saved messages from localStorage
    const savedMessages = localStorage.getItem("pesterchum-messages")
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }
  }, [])

  // Save messages to localStorage
  useEffect(() => {
    if (isClient && Object.keys(messages).length > 0) {
      localStorage.setItem("pesterchum-messages", JSON.stringify(messages))
    }
  }, [messages, isClient])

  const toggleChat = (contactId: string) => {
    setOpenChats((prev) => {
      const isOpen = prev.includes(contactId)

      // If opening, clear unread count
      if (!isOpen) {
        setContacts((prev) =>
          prev.map((contact) => (contact.id === contactId ? { ...contact, unreadCount: 0 } : contact)),
        )
      }

      // Toggle chat window
      return isOpen ? prev.filter((id) => id !== contactId) : [...prev, contactId]
    })
  }

  const sendMessage = (contactId: string, content: string) => {
    if (!activeCharacter || !content.trim()) return

    const chatId = getChatId(activeCharacter.id, contactId)
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: activeCharacter.id,
      receiverId: contactId,
      content,
      timestamp: new Date().toISOString(),
      read: true,
    }

    setMessages((prev) => {
      const chatMessages = prev[chatId] || []
      return {
        ...prev,
        [chatId]: [...chatMessages, newMessage],
      }
    })

    // Simulate response after a short delay
    setTimeout(
      () => {
        simulateResponse(contactId, activeCharacter.id)
      },
      1000 + Math.random() * 4000,
    ) // Random delay between 1-5 seconds
  }

  const simulateResponse = (senderId: string, receiverId: string) => {
    const sender = contacts.find((contact) => contact.id === senderId)
    if (!sender) return

    const chatId = getChatId(senderId, receiverId)
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
      senderId,
      receiverId,
      content: responseMessages[Math.floor(Math.random() * responseMessages.length)],
      timestamp: new Date().toISOString(),
      read: openChats.includes(senderId), // Mark as read if chat is open
    }

    setMessages((prev) => {
      const chatMessages = prev[chatId] || []
      return {
        ...prev,
        [chatId]: [...chatMessages, responseMessage],
      }
    })

    // If chat isn't open, increment unread count
    if (!openChats.includes(senderId)) {
      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === senderId ? { ...contact, unreadCount: contact.unreadCount + 1 } : contact,
        ),
      )
    }
  }

  const getChatId = (id1: string, id2: string) => {
    // Ensure consistent chat ID regardless of sender/receiver order
    return [id1, id2].sort().join("-")
  }

  const getContactMessages = (contactId: string) => {
    if (!activeCharacter) return []

    const chatId = getChatId(activeCharacter.id, contactId)
    return messages[chatId] || []
  }

  // Get initials for avatar
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

  if (!isClient || !activeCharacter) return null

  return (
    <>
      <Collapsible open={expanded} onOpenChange={setExpanded} className="border-t border-[hsl(var(--border))]">
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-[hsl(var(--tumblr-dark))] transition-colors">
          <div className="flex items-center gap-2">
            <SquareCode className="h-4 w-4 text-[hsl(var(--tumblr-royal-purple))]" />
            <span className="font-medium text-sm font-mono">PESTERCHUM</span>
          </div>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-[hsl(var(--tumblr-text))]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[hsl(var(--tumblr-text))]" />
          )}
        </CollapsibleTrigger>

        <CollapsibleContent className="px-2 pb-3">
          <div className="flex items-center justify-between p-2 mb-2">
            <div className="flex items-center gap-2 text-xs text-[hsl(var(--tumblr-text))]">
              <Circle className="h-2 w-2 text-green-500" />
              <span>{contacts.filter((c) => c.status === "online").length} Online</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Set Status</DropdownMenuItem>
                <DropdownMenuItem>Add Contact</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-1 max-h-[200px] overflow-y-auto pr-1">
            {contacts.map((contact) => {
              const bloodStyle = bloodColorMap[contact.bloodColor] || { color: "#333333", textColor: "white" }
              const zodiacSign = bloodColorToZodiac[contact.bloodColor] || "unknown"

              return (
                <div
                  key={contact.id}
                  className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-[hsl(var(--tumblr-dark))] ${openChats.includes(contact.id) ? "bg-[hsl(var(--tumblr-dark))]" : ""}`}
                  onClick={() => toggleChat(contact.id)}
                >
                  <div className="relative">
                    <Avatar className="h-7 w-7 border-2" style={{ borderColor: bloodStyle.color }}>
                      {contact.imageUrl ? (
                        <AvatarImage src={contact.imageUrl} alt={contact.name} />
                      ) : (
                        <AvatarFallback
                          style={{
                            backgroundColor: bloodStyle.color,
                            color: bloodStyle.textColor,
                          }}
                          className="text-xs"
                        >
                          {getInitials(contact.name)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full ${getStatusColor(contact.status)} border border-background`}
                    />
                  </div>

                  <div className="ml-3 flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium truncate">{contact.trollTag}</p>
                      {contact.unreadCount > 0 && (
                        <Badge
                          className="ml-2 h-4 w-4 p-0 flex items-center justify-center text-[0.6rem]"
                          style={{
                            backgroundColor: bloodStyle.color,
                            color: bloodStyle.textColor,
                          }}
                        >
                          {contact.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-[10px] truncate text-[hsl(var(--tumblr-text))]">
                      {contact.status === "offline" ? "Offline" : contact.name}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Chat Windows */}
      <div className="fixed bottom-0 right-4 flex flex-col-reverse items-end gap-2 z-50">
        {openChats.map((contactId) => {
          const contact = contacts.find((c) => c.id === contactId)
          if (!contact) return null

          return (
            <ChatWindow
              key={contactId}
              contact={contact}
              activeCharacter={activeCharacter}
              messages={getContactMessages(contactId)}
              onClose={() => toggleChat(contactId)}
              onSendMessage={(content) => sendMessage(contactId, content)}
              zodiacSign={bloodColorToZodiac[contact.bloodColor] || "unknown"}
            />
          )
        })}
      </div>
    </>
  )
}

