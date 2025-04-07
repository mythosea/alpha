"use client"

import { useAppTheme } from "@/contexts/theme-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export function ThemeContrastTester() {
  const { colorTheme } = useAppTheme()

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Theme Contrast Test: {colorTheme}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Primary */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Primary</h3>
            <div className="flex gap-4">
              <div
                className="p-4 rounded-md flex items-center justify-center"
                style={{ backgroundColor: "hsl(var(--primary))" }}
              >
                <span style={{ color: "hsl(var(--primary-foreground))" }}>Primary Text</span>
              </div>
              <Button>Primary Button</Button>
            </div>
          </div>

          <Separator />

          {/* Secondary */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Secondary</h3>
            <div className="flex gap-4">
              <div
                className="p-4 rounded-md flex items-center justify-center"
                style={{ backgroundColor: "hsl(var(--secondary))" }}
              >
                <span style={{ color: "hsl(var(--secondary-foreground))" }}>Secondary Text</span>
              </div>
              <Button variant="secondary">Secondary Button</Button>
            </div>
          </div>

          <Separator />

          {/* Accent */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Accent</h3>
            <div className="flex gap-4">
              <div
                className="p-4 rounded-md flex items-center justify-center"
                style={{ backgroundColor: "hsl(var(--accent))" }}
              >
                <span style={{ color: "hsl(var(--accent-foreground))" }}>Accent Text</span>
              </div>
              <Button variant="outline">Accent Button</Button>
            </div>
          </div>

          <Separator />

          {/* Destructive */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Destructive</h3>
            <div className="flex gap-4">
              <div
                className="p-4 rounded-md flex items-center justify-center"
                style={{ backgroundColor: "hsl(var(--destructive))" }}
              >
                <span style={{ color: "hsl(var(--destructive-foreground))" }}>Destructive Text</span>
              </div>
              <Button variant="destructive">Destructive Button</Button>
            </div>
          </div>

          <Separator />

          {/* Muted */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Muted</h3>
            <div className="flex gap-4">
              <div
                className="p-4 rounded-md flex items-center justify-center"
                style={{ backgroundColor: "hsl(var(--muted))" }}
              >
                <span style={{ color: "hsl(var(--muted-foreground))" }}>Muted Text</span>
              </div>
              <span className="text-muted-foreground">Muted text on background</span>
            </div>
          </div>

          <Separator />

          {/* Form Elements */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Form Elements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="test-input">Input</Label>
                <Input id="test-input" placeholder="Test input" />
              </div>
              <div className="space-y-2">
                <Label>Badge</Label>
                <div className="flex gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

