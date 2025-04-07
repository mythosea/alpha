"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import type { ChatMessage, ChatRoom, UserPresence, PesterchumState } from "@/types/chat"
import type { Character } from "@/types/character"
import { demoCharacters, demoPesterchumUsers, getRandomDemoResponse } from "@/lib/demo-data"

type ChatContextType = {
  privateChats: Record<string, ChatMessage[]>
  chatRooms: ChatRoom[]
  userPresence: Record<string, UserPresence>
  activeChats: string[]
  activeMemo: string | null
  sendPrivateMessage: (receiverId: string, content: string) => void
  sendMemoMessage: (roomId: string, content: string) => void
  createMemo: (name: string, description: string, isPublic: boolean) => string
  joinMemo: (roomId: string) => void
  leaveMemo: (roomId: string) => void
  openChat: (userId: string) => void
  closeChat: (userId: string) => void
  openMemo: (roomId: string) => void
  closeMemo: () => void
  getCharacterById: (characterId: string) => Character | null
  getUserPresenceByCharacterId: (characterId: string) => UserPresence | null
  applyQuirk: (text: string, character: Character) => string
}

const ChatContext = createContext<ChatContextType>({
  privateChats: {},
  chatRooms: [],
  userPresence: {},
  activeChats: [],
  activeMemo: null,
  sendPrivateMessage: () => {},
  sendMemoMessage: () => {},
  createMemo: () => "",
  joinMemo: () => {},
  leaveMemo: () => {},
  openChat: () => {},
  closeChat: () => {},
  openMemo: () => {},
  closeMemo: () => {},
  getCharacterById: () => null,
  getUserPresenceByCharacterId: () => null,
  applyQuirk: () => "",
})

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user, getActiveCharacter } = useAuth()
  const [chatState, setChatState] = useState<PesterchumState>({
    privateChats: {},
    chatRooms: [],
    userPresence: {},
  })
  const [activeChats, setActiveChats] = useState<string[]>([])
  const [activeMemo, setActiveMemo] = useState<string | null>(null)
  const [characters, setCharacters] = useState<Character[]>([])

  // Load initial state
  useEffect(() => {
    if (!user) return

    // Load characters
    const storedCharacters = JSON.parse(localStorage.getItem("homestuckCharacters") || "[]")
    setCharacters(storedCharacters)

    // Load chat state
    const storedChatState = localStorage.getItem("pesterchum-state")
    if (storedChatState) {
      setChatState(JSON.parse(storedChatState))
    }

    // Load user presence
    const storedPresence = localStorage.getItem("pesterchum-presence")
    if (storedPresence) {
      const presence = JSON.parse(storedPresence)
      setChatState((prev) => ({
        ...prev,
        userPresence: presence,
      }))
    }

    // Add demo characters to characters state
    setCharacters((prevChars) => {
      const existingIds = prevChars.map((c) => c.id)
      // Only add demo characters that don't exist in the current list
      const newDemoChars = demoCharacters.filter((dc) => !existingIds.includes(dc.id))
      return [...prevChars, ...newDemoChars]
    })

    // Add demo users to presence state
    setChatState((prev) => ({
      ...prev,
      userPresence: {
        ...prev.userPresence,
        ...demoPesterchumUsers,
      },
    }))

    // Set up event listener for presence updates
    const handlePresenceUpdate = (event: CustomEvent) => {
      const { userId, status, characterId } = event.detail

      setChatState((prev) => ({
        ...prev,
        userPresence: {
          ...prev.userPresence,
          [userId]: {
            ...prev.userPresence[userId],
            status,
            activeCharacterId: characterId || prev.userPresence[userId]?.activeCharacterId,
            lastActive: new Date().toISOString(),
          },
        },
      }))
    }

    window.addEventListener("pesterchum-presence-update", handlePresenceUpdate as EventListener)

    return () => {
      window.removeEventListener("pesterchum-presence-update", handlePresenceUpdate as EventListener)
    }
  }, [user])

  // Save chat state to localStorage when it changes
  useEffect(() => {
    if (!user) return

    localStorage.setItem("pesterchum-state", JSON.stringify(chatState))
  }, [chatState, user])

  // Helper to get chat ID for private chats
  const getChatId = (userId1: string, userId2: string) => {
    return [userId1, userId2].sort().join("-")
  }

  // Send a private message
  const sendPrivateMessage = (receiverId: string, content: string) => {
    if (!user || !content.trim()) return

    const activeCharacter = getActiveCharacter()
    if (!activeCharacter) return

    // Get receiver's active character
    const receiverPresence = chatState.userPresence[receiverId]
    if (!receiverPresence) return

    const receiverCharacter = getCharacterById(receiverPresence.activeCharacterId || "")

    const chatId = getChatId(user.id, receiverId)
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      senderCharacterId: activeCharacter.id,
      receiverId,
      receiverCharacterId: receiverCharacter?.id,
      content,
      timestamp: new Date().toISOString(),
      read: false,
    }

    setChatState((prev) => {
      const chatMessages = prev.privateChats[chatId] || []
      return {
        ...prev,
        privateChats: {
          ...prev.privateChats,
          [chatId]: [...chatMessages, newMessage],
        },
      }
    })

    // In a real app, this would send the message to the server
    // For demo, we'll simulate a response
    if (Math.random() > 0.7) {
      setTimeout(
        () => {
          simulateResponse(receiverId, receiverCharacter)
        },
        1000 + Math.random() * 4000,
      )
    }
  }

  // Simulate a response (for demo purposes)
  const simulateResponse = (senderId: string, senderCharacter: Character | null) => {
    if (!user || !senderCharacter) return

    const activeCharacter = getActiveCharacter()
    if (!activeCharacter) return

    const chatId = getChatId(user.id, senderId)

    // Use demo character responses for demo users
    let responseContent = ""
    if (senderId.startsWith("demo-user")) {
      responseContent = getRandomDemoResponse(senderCharacter)
    } else {
      // Fallback to generic responses for non-demo users
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
      responseContent = responseMessages[Math.floor(Math.random() * responseMessages.length)]
    }

    const responseMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId,
      senderCharacterId: senderCharacter.id,
      receiverId: user.id,
      receiverCharacterId: activeCharacter.id,
      content: responseContent,
      timestamp: new Date().toISOString(),
      read: activeChats.includes(senderId),
    }

    setChatState((prev) => {
      const chatMessages = prev.privateChats[chatId] || []
      return {
        ...prev,
        privateChats: {
          ...prev.privateChats,
          [chatId]: [...chatMessages, responseMessage],
        },
      }
    })
  }

  // Send a message to a memo (chat room)
  const sendMemoMessage = (roomId: string, content: string) => {
    if (!user || !content.trim()) return

    const activeCharacter = getActiveCharacter()
    if (!activeCharacter) return

    const room = chatState.chatRooms.find((r) => r.id === roomId)
    if (!room) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      senderCharacterId: activeCharacter.id,
      roomId,
      content,
      timestamp: new Date().toISOString(),
      read: true,
    }

    setChatState((prev) => {
      const updatedRooms = prev.chatRooms.map((room) => {
        if (room.id === roomId) {
          return {
            ...room,
            messages: [...room.messages, newMessage],
          }
        }
        return room
      })

      return {
        ...prev,
        chatRooms: updatedRooms,
      }
    })
  }

  // Create a new memo (chat room)
  const createMemo = (name: string, description: string, isPublic: boolean): string => {
    if (!user) return ""

    const newRoom: ChatRoom = {
      id: Date.now().toString(),
      name,
      description,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      isPublic,
      members: [user.id],
      messages: [],
    }

    setChatState((prev) => ({
      ...prev,
      chatRooms: [...prev.chatRooms, newRoom],
    }))

    return newRoom.id
  }

  // Join a memo
  const joinMemo = (roomId: string) => {
    if (!user) return

    setChatState((prev) => {
      const updatedRooms = prev.chatRooms.map((room) => {
        if (room.id === roomId && !room.members.includes(user.id)) {
          return {
            ...room,
            members: [...room.members, user.id],
          }
        }
        return room
      })

      return {
        ...prev,
        chatRooms: updatedRooms,
      }
    })
  }

  // Leave a memo
  const leaveMemo = (roomId: string) => {
    if (!user) return

    setChatState((prev) => {
      const updatedRooms = prev.chatRooms.map((room) => {
        if (room.id === roomId) {
          return {
            ...room,
            members: room.members.filter((id) => id !== user.id),
          }
        }
        return room
      })

      return {
        ...prev,
        chatRooms: updatedRooms,
      }
    })

    if (activeMemo === roomId) {
      setActiveMemo(null)
    }
  }

  // Open a private chat
  const openChat = (userId: string) => {
    if (activeChats.includes(userId)) return

    setActiveChats((prev) => [...prev, userId])
  }

  // Close a private chat
  const closeChat = (userId: string) => {
    setActiveChats((prev) => prev.filter((id) => id !== userId))
  }

  // Open a memo
  const openMemo = (roomId: string) => {
    setActiveMemo(roomId)
  }

  // Close the active memo
  const closeMemo = () => {
    setActiveMemo(null)
  }

  // Get a character by ID
  const getCharacterById = (characterId: string): Character | null => {
    return characters.find((char) => char.id === characterId) || null
  }

  // Get user presence by character ID
  const getUserPresenceByCharacterId = (characterId: string): UserPresence | null => {
    const entries = Object.entries(chatState.userPresence)
    const found = entries.find(([_, presence]) => presence.activeCharacterId === characterId)
    return found ? found[1] : null
  }

  // Apply typing quirk to text
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

  return (
    <ChatContext.Provider
      value={{
        privateChats: chatState.privateChats,
        chatRooms: chatState.chatRooms,
        userPresence: chatState.userPresence,
        activeChats,
        activeMemo,
        sendPrivateMessage,
        sendMemoMessage,
        createMemo,
        joinMemo,
        leaveMemo,
        openChat,
        closeChat,
        openMemo,
        closeMemo,
        getCharacterById,
        getUserPresenceByCharacterId,
        applyQuirk,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => useContext(ChatContext)

