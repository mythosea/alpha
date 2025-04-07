"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { formatDistanceToNow, format } from "date-fns"
import { MessageSquare } from "lucide-react"
import { PostInteractionBar } from "./post-interaction-bar"
import { PostComposer } from "./post-composer"
import { bloodColorMap } from "@/lib/constants"
import type { Character } from "@/types/character"

interface PostCardProps {
  id: string
  character: Character
  content: string
  timestamp: string
  likes: number
  liked: boolean
  replies?: number
  shares?: number
  onLike: (id: string) => void
  applyQuirk: (text: string, character: Character) => string
  activeCharacter?: Character | null
  onReply?: (id: string, content: string) => void
  className?: string
}

export function PostCard({
  id,
  character,
  content,
  timestamp,
  likes,
  liked,
  replies = 0,
  shares = 0,
  onLike,
  applyQuirk,
  activeCharacter,
  onReply,
  className,
}: PostCardProps) {
  const router = useRouter()
  const [isReplying, setIsReplying] = useState(false)

  const bloodStyle = bloodColorMap[character.bloodColor] || { color: "#333333", textColor: "white" }
  const postDate = new Date(timestamp)
  const timeAgo = formatDistanceToNow(postDate, { addSuffix: true })
  const formattedDate = format(postDate, "MMM d, yyyy • h:mm a")

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const handleReply = () => {
    if (activeCharacter) {
      setIsReplying(true)
    }
  }

  const handleSubmitReply = (replyContent: string) => {
    if (onReply) {
      onReply(id, replyContent)
    }
    setIsReplying(false)
  }

  return (
    <div
      className={`border rounded-lg bg-[hsl(var(--tumblr-dark))] overflow-hidden transition-all hover:shadow-md ${className}`}
    >
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar
            className="h-10 w-10 border-2 cursor-pointer"
            style={{ borderColor: bloodStyle.color }}
            onClick={() => router.push(`/characters/${character.id}`)}
          >
            {character.imageUrl ? (
              <AvatarImage src={character.imageUrl} alt={character.name} />
            ) : (
              <AvatarFallback
                style={{
                  backgroundColor: bloodStyle.color,
                  color: bloodStyle.textColor,
                }}
              >
                {getInitials(character.name)}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <div className="font-semibold text-sm flex items-center gap-2">
              <span
                className="cursor-pointer hover:underline"
                onClick={() => router.push(`/characters/${character.id}`)}
              >
                {character.name}
              </span>
              <Badge
                variant="outline"
                className="text-[0.65rem] capitalize px-1 h-4"
                style={{
                  backgroundColor: `${bloodStyle.color}20`,
                  borderColor: `${bloodStyle.color}40`,
                  color: bloodStyle.color,
                }}
              >
                {character.bloodColor}
              </Badge>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-xs text-muted-foreground cursor-help">{timeAgo}</div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{formattedDate}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div
          className="whitespace-pre-line mb-4"
          style={{
            color: character.bloodColor === "gold" ? "#8a7e00" : bloodStyle.color,
          }}
        >
          {applyQuirk(content, character)}
        </div>

        <PostInteractionBar
          postId={id}
          likes={likes}
          liked={liked}
          replies={replies}
          shares={shares}
          onLike={onLike}
          onReply={activeCharacter ? () => handleReply() : undefined}
        />
      </div>

      {replies > 0 && !isReplying && (
        <div className="px-4 pb-4">
          <Button variant="outline" size="sm" className="w-full" onClick={() => handleReply()}>
            <MessageSquare className="h-4 w-4 mr-2" />
            View {replies} {replies === 1 ? "reply" : "replies"}
          </Button>
        </div>
      )}

      {isReplying && activeCharacter && (
        <div className="px-4 pb-4 pt-2">
          <div className="border-t border-[hsl(var(--border))] pt-4">
            <h4 className="text-sm font-medium mb-3">Reply to this post</h4>
            <PostComposer
              character={activeCharacter}
              onSubmit={handleSubmitReply}
              onCancel={() => setIsReplying(false)}
              placeholder={`Reply to ${character.name}...`}
              applyQuirk={applyQuirk}
              className="border-0 shadow-none bg-transparent"
            />
          </div>
        </div>
      )}
    </div>
  )
}

