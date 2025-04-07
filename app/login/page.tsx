"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(username, password)
      router.push("/feed")
    } catch (err) {
      setError("Invalid username or password")
    } finally {
      setIsLoading(false)
    }
  }

  // For demo purposes, create a demo account if none exists
  const createDemoAccount = () => {
    const users = JSON.parse(localStorage.getItem("pesterchum-users") || "[]")

    if (users.length === 0) {
      const demoUser = {
        id: "demo-user",
        username: "demo",
        email: "demo@example.com",
        activeCharacterId: null,
        createdAt: new Date().toISOString(),
      }

      localStorage.setItem("pesterchum-users", JSON.stringify([demoUser]))
    }
  }

  // Create demo account on page load
  useState(() => {
    createDemoAccount()
  })

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">PESTERCHUM</CardTitle>
          <CardDescription className="text-center">Enter your credentials to sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <p>
              For demo purposes, use username: <strong>demo</strong> and any password
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

