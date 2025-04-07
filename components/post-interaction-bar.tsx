"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, MessageSquare, Share2, Bookmark, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PostInteractionBarProps {
  postId: string
  likes: number
  liked: boolean
  replies?: number
  shares?: number
  onLike: (id: string) => void
  onReply?: (id: string) => void
  onShare?: (id: string) => void
  onBookmark?: (id: string) => void
  className?: string
}

export function PostInteractionBar({
  postId,
  likes,
  liked,
  replies = 0,
  shares = 0,
  onLike,
  onReply,
  onShare,
  onBookmark,
  className,
}: PostInteractionBarProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    if (onBookmark) onBookmark(postId)
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-1 ${liked ? "text-red-500" : ""}`}
              onClick={() => onLike(postId)}
            >
              <Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} />
              <span>{likes > 0 ? likes : ""}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{liked ? "Unlike" : "Like"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => onReply && onReply(postId)}
            >
              <MessageSquare className="h-4 w-4" />
              <span>{replies > 0 ? replies : ""}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reply</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => onShare && onShare(postId)}
            >
              <Share2 className="h-4 w-4" />
              <span>{shares > 0 ? shares : ""}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="ml-auto flex items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={isBookmarked ? "text-yellow-500" : ""}
              >
                <Bookmark className="h-4 w-4" fill={isBookmarked ? "currentColor" : "none"} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isBookmarked ? "Remove Bookmark" : "Bookmark"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Report Post</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Mute Author</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

