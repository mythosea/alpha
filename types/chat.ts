export type ChatMessage = {
  id: string
  senderId: string
  senderCharacterId: string
  receiverId?: string
  receiverCharacterId?: string
  roomId?: string
  content: string
  timestamp: string
  read: boolean
}

export type ChatRoom = {
  id: string
  name: string
  description: string
  createdBy: string
  createdAt: string
  isPublic: boolean
  members: string[] // User IDs
  messages: ChatMessage[]
}

export type UserPresence = {
  userId: string
  username: string
  activeCharacterId: string | null
  status: "online" | "idle" | "busy" | "offline"
  lastActive: string
}

export type PesterchumState = {
  privateChats: Record<string, ChatMessage[]>
  chatRooms: ChatRoom[]
  userPresence: Record<string, UserPresence>
}

