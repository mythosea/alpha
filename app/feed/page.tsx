"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RefreshCw, PlusCircle, Filter, ChevronDown, Clock, Sparkles, Check } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { PostComposer } from "@/components/post-composer"
import { PostCard } from "@/components/post-card"
import type { Character } from "@/types/character"

type Post = {
  id: string
  characterId: string
  content: string
  timestamp: string
  likes: number
  liked: boolean
  replies?: number
  shares?: number
}

export default function FeedPage() {
  const router = useRouter()
  const [characters, setCharacters] = useState<Character[]>([])
  const [activeCharacter, setActiveCharacter] = useState<Character | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [sortOrder, setSortOrder] = useState<"newest" | "popular">("newest")

  useEffect(() => {
    setIsClient(true)
    loadData()

    // Simulate loading state for better UX
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const loadData = () => {
    const storedCharacters = JSON.parse(localStorage.getItem("homestuckCharacters") || "[]")
    setCharacters(storedCharacters)

    // Get active character from localStorage
    const activeId = localStorage.getItem("activeCharacterId")
    if (activeId) {
      const active = storedCharacters.find((char: Character) => char.id === activeId)
      if (active) {
        setActiveCharacter(active)
      } else if (storedCharacters.length > 0) {
        setActiveCharacter(storedCharacters[0])
        localStorage.setItem("activeCharacterId", storedCharacters[0].id)
      }
    } else if (storedCharacters.length > 0) {
      setActiveCharacter(storedCharacters[0])
      localStorage.setItem("activeCharacterId", storedCharacters[0].id)
    }

    // Load posts
    const storedPosts = JSON.parse(localStorage.getItem("homestuckPosts") || "[]")
    setPosts(storedPosts.sort((a: Post, b: Post) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()))
  }

  const createPost = (content: string) => {
    if (!activeCharacter || !content.trim()) return

    const newPost: Post = {
      id: Date.now().toString(),
      characterId: activeCharacter.id,
      content: content,
      timestamp: new Date().toISOString(),
      likes: 0,
      liked: false,
      replies: 0,
      shares: 0,
    }

    const updatedPosts = [newPost, ...posts]
    setPosts(updatedPosts)
    localStorage.setItem("homestuckPosts", JSON.stringify(updatedPosts))
  }

  const toggleLike = (postId: string) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
          liked: !post.liked,
        }
      }
      return post
    })

    setPosts(updatedPosts)
    localStorage.setItem("homestuckPosts", JSON.stringify(updatedPosts))
  }

  const handleReply = (postId: string, content: string) => {
    // In a real app, this would create a reply
    // For now, just increment the reply count
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          replies: (post.replies || 0) + 1,
        }
      }
      return post
    })

    setPosts(updatedPosts)
    localStorage.setItem("homestuckPosts", JSON.stringify(updatedPosts))
  }

  // Apply character's typing quirk to text using the rule-based system
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
              // Reverse capitalization (uppercase becomes lowercase and vice versa)
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

    // Fallback to the old system for backward compatibility
    const quirk = character.quirk

    if (quirk.includes("ALL CAPS")) {
      // For Terezi's quirk - replace letters with numbers
      if (quirk.includes("NUMBERS REPLACING LETTERS")) {
        return text.toUpperCase().replace(/A/g, "4").replace(/E/g, "3").replace(/I/g, "1")
      }
      return text.toUpperCase()
    } else if (quirk.includes("lowercase")) {
      return text.toLowerCase()
    } else if (quirk.includes("Replace")) {
      // For Sollux's quirk - replace s with 2 and i with ii
      if (quirk.includes("Replace 's' with '2'")) {
        let processed = text.replace(/s/g, "2").replace(/S/g, "2")
        if (quirk.includes("'i' with 'ii'")) {
          processed = processed.replace(/i/g, "ii").replace(/I/g, "II")
        }
        return processed
      }
    } else if (quirk.includes("Capitalization Of Every Word")) {
      // For Kanaya's quirk - capitalize every word
      return text
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    } else if (quirk.includes("AlTeRnAtInG")) {
      // For Gamzee's quirk - alternating caps
      return text
        .split("")
        .map((char, index) => (index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()))
        .join("")
    } else if (quirk.includes("rEVERSE")) {
      // For Tavros's quirk - reverse capitalization
      return text
        .split("")
        .map((char) => {
          if (char === char.toUpperCase()) {
            return char.toLowerCase()
          } else {
            return char.toUpperCase()
          }
        })
        .join("")
    }

    return text
  }

  // Filter posts based on active tab
  const filteredPosts = useMemo(() => {
    if (activeTab === "all") {
      return posts
    } else if (activeTab === "following") {
      // In a real app, this would filter based on followed characters
      // For now, just show a subset of posts
      return posts.filter((_, index) => index % 2 === 0)
    } else if (activeTab === "mine") {
      return posts.filter((post) => activeCharacter && post.characterId === activeCharacter.id)
    }
    return posts
  }, [posts, activeTab, activeCharacter])

  // Sort posts based on sort order
  const sortedPosts = useMemo(() => {
    if (sortOrder === "newest") {
      return [...filteredPosts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    } else {
      return [...filteredPosts].sort((a, b) => b.likes - a.likes)
    }
  }, [filteredPosts, sortOrder])

  if (!isClient) {
    return <div className="flex items-center justify-center h-full">Loading...</div>
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Character Feed</h1>
        <Button variant="outline" size="sm" onClick={loadData} className="flex items-center gap-1">
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {characters.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <h2 className="text-2xl font-bold mb-4">No Characters Yet</h2>
          <p className="text-muted-foreground mb-6">You need to create a character before you can post to the feed.</p>
          <div className="flex gap-4">
            <Button onClick={() => router.push("/create")} className="bg-[hsl(var(--tumblr-royal-purple))]">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Your First Character
            </Button>
            <Button variant="outline" onClick={() => router.push("/demo")}>
              Load Demo Characters
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Post creation card */}
          {activeCharacter && (
            <div className="mb-6">
              <PostComposer
                character={activeCharacter}
                onSubmit={createPost}
                placeholder={`What's on your mind, ${activeCharacter.name.split(" ")[0]}?`}
                applyQuirk={applyQuirk}
              />
            </div>
          )}

          {/* Feed controls */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList className="grid w-full grid-cols-3 h-9">
                <TabsTrigger value="all" className="text-xs">
                  All Posts
                </TabsTrigger>
                <TabsTrigger value="following" className="text-xs">
                  Following
                </TabsTrigger>
                <TabsTrigger value="mine" className="text-xs">
                  My Posts
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <Filter className="h-4 w-4 mr-1" />
                    <span>Sort: {sortOrder === "newest" ? "Newest" : "Popular"}</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortOrder("newest")}>
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Newest First</span>
                    {sortOrder === "newest" && <Check className="h-4 w-4 ml-2" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder("popular")}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    <span>Most Popular</span>
                    {sortOrder === "popular" && <Check className="h-4 w-4 ml-2" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Posts feed */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg p-4 bg-[hsl(var(--tumblr-dark))]">
                  <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-24 w-full mb-4" />
                  <div className="flex gap-4">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedPosts.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-[hsl(var(--tumblr-dark))]">
              <p className="text-muted-foreground mb-2">No posts found in this category.</p>
              {activeTab === "mine" && (
                <p className="text-sm text-muted-foreground">Create your first post to see it here!</p>
              )}
            </div>
          ) : (
            <div className="space-y-6 pb-16 md:pb-6">
              {sortedPosts.map((post) => {
                const character = characters.find((char) => char.id === post.characterId)
                if (!character) return null

                return (
                  <PostCard
                    key={post.id}
                    id={post.id}
                    character={character}
                    content={post.content}
                    timestamp={post.timestamp}
                    likes={post.likes}
                    liked={post.liked}
                    replies={post.replies}
                    shares={post.shares}
                    onLike={toggleLike}
                    applyQuirk={applyQuirk}
                    activeCharacter={activeCharacter}
                    onReply={handleReply}
                  />
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}

