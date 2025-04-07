"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { PesterlogCard } from "@/components/pesterlog-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Heart, Share2 } from "lucide-react"
import { bloodColorMap } from "@/lib/constants"
import type { Character } from "@/types/character"

type Post = {
  id: string
  characterId: string
  content: string
  timestamp: string
  likes: number
  liked: boolean
}

interface CharacterActivityProps {
  character: Character
  applyQuirk: (text: string, character: Character) => string
}

export function CharacterActivity({ character, applyQuirk }: CharacterActivityProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load posts from localStorage
    const allPosts = JSON.parse(localStorage.getItem("homestuckPosts") || "[]")
    const characterPosts = allPosts
      .filter((post: Post) => post.characterId === character.id)
      .sort((a: Post, b: Post) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 3) // Show only the 3 most recent posts

    setPosts(characterPosts)
    setIsLoading(false)
  }, [character.id])

  if (isLoading) {
    return <div className="text-center py-4">Loading activity...</div>
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8 px-4 bg-[hsl(var(--tumblr-darker))] rounded-md">
        <p className="text-muted-foreground mb-2">No activity from this character yet.</p>
        <p className="text-sm text-muted-foreground">Posts from the feed will appear here.</p>
      </div>
    )
  }

  const bloodStyle = bloodColorMap[character.bloodColor] || { color: "#333333", textColor: "white" }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PesterlogCard
          key={post.id}
          bloodColor={character.bloodColor}
          compact={true}
          header={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs">{formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}</span>
              <Badge variant="outline" className="text-xs">
                Post
              </Badge>
            </div>
          }
        >
          <div
            className="whitespace-pre-line mb-3 text-sm"
            style={{
              color: character.bloodColor === "gold" ? "#8a7e00" : bloodStyle.color,
            }}
          >
            {applyQuirk(post.content, character)}
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center">
              <Heart className="h-3 w-3 mr-1" /> {post.likes}
            </span>
            <span className="flex items-center">
              <MessageSquare className="h-3 w-3 mr-1" /> 0
            </span>
            <span className="flex items-center">
              <Share2 className="h-3 w-3 mr-1" /> 0
            </span>
          </div>
        </PesterlogCard>
      ))}

      <Button variant="outline" size="sm" className="w-full">
        View All Posts
      </Button>
    </div>
  )
}

