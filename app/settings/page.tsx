"use client"

import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAppTheme } from "@/contexts/theme-context"
import { Monitor, Palette, Layers, Save, Check } from "lucide-react"
import { ThemeShowcase } from "@/components/theme-showcase"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const { colorTheme, setColorTheme, backgroundEffect, setBackgroundEffect } = useAppTheme()
  const [mounted, setMounted] = useState(false)
  const [settingsChanged, setSettingsChanged] = useState(false)

  const [settings, setSettings] = useState({
    endlessScrolling: true,
    showTimestamps: false,
    shortenPosts: true,
    useBlogColors: true,
    messagingSounds: false,
    bestStuffFirst: true,
    includeCommunityPosts: true,
    includeLikedPosts: false,
    includeBasedOnLikes: true,
    includeTagPosts: false,
    enableColorizedTags: true,
  })

  useEffect(() => {
    setMounted(true)

    // Load saved settings from localStorage if available
    const savedSettings = localStorage.getItem("mythosea-settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const toggleSetting = (setting: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }))
    setSettingsChanged(true)
  }

  const saveSettings = () => {
    localStorage.setItem("mythosea-settings", JSON.stringify(settings))
    setSettingsChanged(false)
  }

  if (!mounted) return null

  return (
    <div className="container mx-auto py-6 px-4 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[hsl(var(--tumblr-purple))]">System Settings</h1>
        {settingsChanged && (
          <Button onClick={saveSettings} className="bg-[hsl(var(--tumblr-royal-purple))]">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        )}
      </div>

      <Card className="border-[hsl(var(--border))] bg-[hsl(var(--tumblr-darker))]">
        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-[hsl(var(--tumblr-dark))] p-0 h-auto border-b border-[hsl(var(--border))]">
            <TabsTrigger
              value="appearance"
              className="flex items-center gap-2 py-3 rounded-none data-[state=active]:bg-[hsl(var(--tumblr-royal-purple))] data-[state=active]:text-white"
            >
              <Palette className="h-4 w-4" />
              <span className="font-mono">Appearance</span>
            </TabsTrigger>
            <TabsTrigger
              value="interface"
              className="flex items-center gap-2 py-3 rounded-none data-[state=active]:bg-[hsl(var(--tumblr-royal-purple))] data-[state=active]:text-white"
            >
              <Monitor className="h-4 w-4" />
              <span className="font-mono">Interface</span>
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="flex items-center gap-2 py-3 rounded-none data-[state=active]:bg-[hsl(var(--tumblr-royal-purple))] data-[state=active]:text-white"
            >
              <Layers className="h-4 w-4" />
              <span className="font-mono">Preferences</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="p-6 space-y-8 mt-0">
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-medium text-[hsl(var(--tumblr-purple))] mb-2">Color Theme</h2>
                <p className="text-sm text-[hsl(var(--tumblr-text))]">Choose a color theme for the interface</p>
              </div>
              <ThemeShowcase />
            </section>
          </TabsContent>

          <TabsContent value="interface" className="p-6 space-y-8 mt-0">
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-medium text-[hsl(var(--tumblr-purple))] mb-2">Interface Settings</h2>
                <p className="text-sm text-[hsl(var(--tumblr-text))]">
                  Customize how you interact with the application
                </p>
              </div>

              <div className="grid gap-4">
                <SettingCard
                  title="Endless scrolling"
                  description="Disabling this will allow you to surf the dashboard page-by-page instead of the endlessly-scrolling feed."
                  checked={settings.endlessScrolling}
                  onChange={() => toggleSetting("endlessScrolling")}
                />

                <SettingCard
                  title="Show timestamps on posts, reblogs, and notes"
                  description="Enabling this displays timestamps in the post, reblog trail, and notes views."
                  checked={settings.showTimestamps}
                  onChange={() => toggleSetting("showTimestamps")}
                />

                <SettingCard
                  title="Shorten long posts"
                  description="Make it easier to browse Mythosea feeds by capping the length of long posts."
                  checked={settings.shortenPosts}
                  onChange={() => toggleSetting("shortenPosts")}
                />

                <SettingCard
                  title="Use character colors when viewing profiles"
                  description="Enables a character's blood color in the profile view. If disabled, all profiles will be shown using your selected palette's colors instead."
                  checked={settings.useBlogColors}
                  onChange={() => toggleSetting("useBlogColors")}
                />
              </div>
            </section>

            <Separator className="bg-[hsl(var(--border))]" />

            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-medium text-[hsl(var(--tumblr-purple))] mb-2">Sounds</h2>
                <p className="text-sm text-[hsl(var(--tumblr-text))]">Configure sound settings</p>
              </div>

              <SettingCard
                title="Messaging sounds"
                description="Assorted 'bling!' and 'bwip!' noises in messaging."
                checked={settings.messagingSounds}
                onChange={() => toggleSetting("messagingSounds")}
              />
            </section>
          </TabsContent>

          <TabsContent value="preferences" className="p-6 space-y-8 mt-0">
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-medium text-[hsl(var(--tumblr-purple))] mb-2">Feed Preferences</h2>
                <p className="text-sm text-[hsl(var(--tumblr-text))]">Customize what appears in your feed</p>
              </div>

              <div className="grid gap-4">
                <SettingCard
                  title="Best Stuff First"
                  description="This switch puts stuff you'll like at the top of your Following tab."
                  checked={settings.bestStuffFirst}
                  onChange={() => toggleSetting("bestStuffFirst")}
                />

                <SettingCard
                  title="Include posts from your communities"
                  description="Show posts from the communities you have joined in the following tab, excluding communities you have muted."
                  checked={settings.includeCommunityPosts}
                  onChange={() => toggleSetting("includeCommunityPosts")}
                />

                <SettingCard
                  title="Include posts liked by the characters you follow"
                  description="Posts that your favorite characters liked."
                  checked={settings.includeLikedPosts}
                  onChange={() => toggleSetting("includeLikedPosts")}
                />

                <SettingCard
                  title="Include 'Based On Your Likes!'"
                  description="Show 'Based On Your Likes!' in the following tab alongside posts from characters you follow."
                  checked={settings.includeBasedOnLikes}
                  onChange={() => toggleSetting("includeBasedOnLikes")}
                />

                <SettingCard
                  title="Enable colorized tags"
                  description="Colorize matching tags on the dashboard. Colorized tags add a nice touch to your dashboard but they might be harder to read."
                  checked={settings.enableColorizedTags}
                  onChange={() => toggleSetting("enableColorizedTags")}
                />
              </div>
            </section>
          </TabsContent>
        </Tabs>

        <CardFooter className="bg-[hsl(var(--tumblr-dark))] border-t border-[hsl(var(--border))] p-4 flex justify-end">
          <Button
            onClick={saveSettings}
            className="bg-[hsl(var(--tumblr-royal-purple))] hover:bg-[hsl(var(--tumblr-royal-purple))/90] text-white font-medium"
            disabled={!settingsChanged}
          >
            {settingsChanged ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Settings Saved
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

// Helper component for individual settings
function SettingCard({
  title,
  description,
  checked,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <Card className="bg-[hsl(var(--tumblr-dark))] border border-[hsl(var(--border))] hover:border-[hsl(var(--tumblr-royal-purple))/50] transition-colors">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="space-y-1">
          <Label className="text-base font-medium">{title}</Label>
          <p className="text-sm text-[hsl(var(--tumblr-text))]">{description}</p>
        </div>
        <Switch checked={checked} onCheckedChange={onChange} className="ml-4" />
      </CardContent>
    </Card>
  )
}

