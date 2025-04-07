import { ThemeContrastTester } from "@/components/theme-contrast-tester"

export default function ThemeTestPage() {
  return (
    <div className="container mx-auto py-6 px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Theme Contrast Testing</h1>
      <p className="mb-6 text-muted-foreground">
        This page allows you to test the contrast of different UI elements across all themes. Switch themes in the
        Settings page and return here to verify contrast.
      </p>

      <ThemeContrastTester />
    </div>
  )
}

