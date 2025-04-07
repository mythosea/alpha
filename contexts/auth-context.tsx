"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Character } from "@/types/character"

// Import demo characters
import { demoCharacters } from "@/lib/demo-data"

type User = {
  id: string
  username: string
  email: string
  activeCharacterId: string | null
  createdAt: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  setActiveCharacter: (characterId: string | null) => void
  getActiveCharacter: () => Character | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  setActiveCharacter: () => {},
  getActiveCharacter: () => null,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("pesterchum-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)

    // Make sure demo characters are available in localStorage
    const storedCharacters = JSON.parse(localStorage.getItem("homestuckCharacters") || "[]")
    if (storedCharacters.length === 0) {
      // Only add demo characters if there are no characters
      localStorage.setItem("homestuckCharacters", JSON.stringify(demoCharacters))
    }
  }, [])

  // For demo purposes, we'll use localStorage to simulate a backend
  const login = async (username: string, password: string) => {
    setIsLoading(true)

    try {
      // In a real app, this would be an API call
      const users = JSON.parse(localStorage.getItem("pesterchum-users") || "[]")
      const foundUser = users.find((u: any) => u.username === username)

      if (!foundUser) {
        throw new Error("User not found")
      }

      // In a real app, we would verify the password hash
      // For demo, we'll just check if the user exists

      setUser(foundUser)
      localStorage.setItem("pesterchum-user", JSON.stringify(foundUser))

      // Update user presence
      updateUserPresence(foundUser.id, "online")

      router.push("/feed")
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true)

    try {
      // In a real app, this would be an API call
      const users = JSON.parse(localStorage.getItem("pesterchum-users") || "[]")

      // Check if username already exists
      if (users.some((u: any) => u.username === username)) {
        throw new Error("Username already taken")
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        username,
        email,
        activeCharacterId: null,
        createdAt: new Date().toISOString(),
      }

      // Save user
      users.push(newUser)
      localStorage.setItem("pesterchum-users", JSON.stringify(users))

      // Auto-login
      setUser(newUser)
      localStorage.setItem("pesterchum-user", JSON.stringify(newUser))

      // Update user presence
      updateUserPresence(newUser.id, "online")

      router.push("/create")
    } catch (error) {
      console.error("Registration failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    if (user) {
      // Update user presence to offline
      updateUserPresence(user.id, "offline")
    }

    setUser(null)
    localStorage.removeItem("pesterchum-user")
    router.push("/login")
  }

  const setActiveCharacter = (characterId: string | null) => {
    if (!user) return

    const updatedUser = {
      ...user,
      activeCharacterId: characterId,
    }

    setUser(updatedUser)
    localStorage.setItem("pesterchum-user", JSON.stringify(updatedUser))

    // Update user presence with new active character
    if (characterId) {
      updateUserPresence(user.id, "online", characterId)
    }
  }

  const getActiveCharacter = (): Character | null => {
    if (!user || !user.activeCharacterId) return null

    const characters = JSON.parse(localStorage.getItem("homestuckCharacters") || "[]")
    return characters.find((char: Character) => char.id === user.activeCharacterId) || null
  }

  const updateUserPresence = (userId: string, status: "online" | "idle" | "busy" | "offline", characterId?: string) => {
    const presenceData = JSON.parse(localStorage.getItem("pesterchum-presence") || "{}")

    presenceData[userId] = {
      userId,
      username: user?.username || "",
      activeCharacterId: characterId || user?.activeCharacterId,
      status,
      lastActive: new Date().toISOString(),
    }

    localStorage.setItem("pesterchum-presence", JSON.stringify(presenceData))

    // Broadcast presence update (in a real app, this would use WebSockets)
    const event = new CustomEvent("pesterchum-presence-update", {
      detail: { userId, status, characterId },
    })
    window.dispatchEvent(event)
  }

  // Set up periodic presence updates
  useEffect(() => {
    if (!user) return

    const interval = setInterval(() => {
      updateUserPresence(user.id, "online")
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [user])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        setActiveCharacter,
        getActiveCharacter,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

