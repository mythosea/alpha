import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ComputerInterface } from "@/components/computer-interface"
import { TumblrSidebar } from "@/components/tumblr-sidebar"
import { ThemeProvider as AppThemeProvider } from "@/contexts/theme-context"
import { AuthProvider } from "@/contexts/auth-context"
import { ChatProvider } from "@/contexts/chat-context"
import { BackgroundEffects } from "@/components/background-effects"
import { ChatWindows } from "@/components/pesterchum/chat-windows"
import { DemoCharacterActivity } from "@/components/pesterchum/demo-character-activity"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: "MYTHOSEA",
  description: "ALPHA",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AppThemeProvider>
            <AuthProvider>
              <ChatProvider>
                <DemoCharacterActivity />
                <ComputerInterface>
                  <div className="flex h-full">
                    <TumblrSidebar />
                    <main className="flex-1 overflow-auto">
                      <BackgroundEffects />
                      {children}
                    </main>
                    <ChatWindows />
                  </div>
                </ComputerInterface>
              </ChatProvider>
            </AuthProvider>
          </AppThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'