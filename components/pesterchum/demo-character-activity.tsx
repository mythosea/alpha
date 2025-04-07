"use client"

import { useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useChat } from "@/contexts/chat-context"
import { demoPesterchumUsers, getRandomDemoResponse } from "@/lib/demo-data"

// This component doesn't render anything visibly,
// but it creates automated activity from demo characters
export function DemoCharacterActivity() {
  const { user } = useAuth()
  const { openChat, sendPrivateMessage, getCharacterById } = useChat()
  const timeoutsRef = useRef<NodeJS.Timeout[]>([])

  useEffect(() => {
    // Only run if there's a logged in user
    if (!user) return

    // Clear any existing timeouts
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
    timeoutsRef.current = []

    // Set up random messages from demo characters
    const demoUserIds = Object.keys(demoPesterchumUsers)

    // Choose a random demo character to message first
    const initialDemoUserId = demoUserIds[Math.floor(Math.random() * demoUserIds.length)]

    // First message after 20-60 seconds
    const initialDelay = 20000 + Math.random() * 40000

    const initialTimeout = setTimeout(() => {
      // Get character for this demo user
      const demoUser = demoPesterchumUsers[initialDemoUserId]
      const character = getCharacterById(demoUser.activeCharacterId || "")

      if (character) {
        // Open chat with this character and send an initial greeting
        openChat(initialDemoUserId)

        // Use setTimeout to make it look like they're typing
        setTimeout(() => {
          // Send an initial greeting message simulating the demo character reaching out
          const greetings = [
            "hey there! just checking in",
            "yo, what's up?",
            "hello, got a minute to chat?",
            "hey, any chance you've seen what's going on lately?",
            "hi there, new around here?",
          ]

          const message = {
            id: Date.now().toString(),
            senderId: initialDemoUserId,
            senderCharacterId: character.id,
            receiverId: user.id,
            content: getRandomDemoResponse(character),
            timestamp: new Date().toISOString(),
            read: false,
          }

          // This will add the message to the chat
          sendPrivateMessage(initialDemoUserId, message.content)
        }, 2000)
      }
    }, initialDelay)

    timeoutsRef.current.push(initialTimeout)

    // Set up occasional random messages from other demo characters
    demoUserIds.forEach((demoUserId) => {
      if (Math.random() > 0.5) {
        // 50% chance for each character to be active
        // Random delay between 1-5 minutes
        const delay = 60000 + Math.random() * 240000

        const timeout = setTimeout(() => {
          // Get character for this demo user
          const demoUser = demoPesterchumUsers[demoUserId]
          const character = getCharacterById(demoUser.activeCharacterId || "")

          if (character && Math.random() > 0.7) {
            // 30% chance to actually send a message
            // Open chat with this character and send a message
            openChat(demoUserId)

            // Short delay to make it look like typing
            setTimeout(
              () => {
                // Send a message from this demo character
                const message = getRandomDemoResponse(character)

                // This will add the message to the chat
                sendPrivateMessage(demoUserId, message)
              },
              1500 + Math.random() * 1000,
            )
          }
        }, delay)

        timeoutsRef.current.push(timeout)
      }
    })

    return () => {
      // Clean up all timeouts on unmount
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
    }
  }, [user, openChat, sendPrivateMessage, getCharacterById])

  // This component doesn't render anything
  return null
}

