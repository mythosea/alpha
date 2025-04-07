"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, Send, Image, Link, Smile } from "lucide-react"
import { bloodColorMap } from "@/lib/constants"
import type { Character } from "@/types/character"

interface PostComposerProps {
  character: Character
  onSubmit: (content: string) => void
  onCancel?: () => void
  placeholder?: string
  applyQuirk: (text: string, character: Character) => string
  className?: string
}

export function PostComposer({
  character,
  onSubmit,
  onCancel,
  placeholder = "What's on your mind?",
  applyQuirk,
  className,
}: PostComposerProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    if (!content.trim()) return

    setIsSubmitting(true)

    // Simulate network delay
    setTimeout(() => {
      onSubmit(content)
      setContent("")
      setIsSubmitting(false)
    }, 500)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div
      className={`bg-[hsl(var(--tumblr-dark))] rounded-lg border border-[hsl(var(--border))] overflow-hidden transition-all hover:border-[hsl(var(--tumblr-royal-purple))/50] ${className}`}
    >
      <div className="p-4 border-b border-[hsl(var(--border))]">
        <div className="flex items-center gap-3">
          <Avatar
            className="h-10 w-10 border-2"
            style={{
              borderColor: bloodColorMap[character.bloodColor]?.color || "#333",
            }}
          >
            {character.imageUrl ? (
              <AvatarImage src={character.imageUrl} alt={character.name} />
            ) : (
              <AvatarFallback
                style={{
                  backgroundColor: bloodColorMap[character.bloodColor]?.color || "#333",
                  color: bloodColorMap[character.bloodColor]?.textColor || "white",
                }}
              >
                {getInitials(character.name)}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <div className="font-semibold">{character.name}</div>
            <div className="text-xs text-muted-foreground font-mono">{character.trollTag}</div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Textarea
          placeholder={placeholder}
          className="min-h-[100px] resize-none bg-[hsl(var(--tumblr-darker))] border-[hsl(var(--border))] focus-visible:ring-[hsl(var(--tumblr-royal-purple))]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {content && (
          <div className="mt-3 p-3 border rounded-md bg-[hsl(var(--tumblr-darker))] text-sm">
            <p className="font-semibold text-xs text-muted-foreground mb-1">Preview:</p>
            <div
              style={{
                color:
                  character.bloodColor === "gold" ? "#8a7e00" : bloodColorMap[character.bloodColor]?.color || "#333",
              }}
            >
              {applyQuirk(content, character)}
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-[hsl(var(--tumblr-darker))] border-t border-[hsl(var(--border))]">
        <div className="flex items-center">
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Image className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Link className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Smile className="h-4 w-4" />
            </Button>
          </div>

          <div className="ml-auto flex gap-2">
            {onCancel && (
              <Button variant="ghost" size="sm" onClick={onCancel} disabled={!content.trim() || isSubmitting}>
                <X className="h-4 w-4 mr-1" />
                <span>Clear</span>
              </Button>
            )}
            <Button
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting}
              className="bg-[hsl(var(--tumblr-royal-purple))]"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  <span>Post</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

