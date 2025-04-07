import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ZodiacSymbol, type ZodiacSign, bloodColorToZodiac } from "@/components/zodiac-symbol"

interface PesterlogCardProps {
  bloodColor: string
  children: ReactNode
  className?: string
  header?: ReactNode
  footer?: ReactNode
  compact?: boolean
}

const bloodColorMap: Record<string, { color: string; textColor: string; darkColor: string }> = {
  burgundy: { color: "#a10000", textColor: "white", darkColor: "#800000" },
  bronze: { color: "#a15000", textColor: "white", darkColor: "#804000" },
  gold: { color: "#a1a100", textColor: "black", darkColor: "#808000" },
  lime: { color: "#01a100", textColor: "white", darkColor: "#008000" },
  olive: { color: "#416600", textColor: "white", darkColor: "#304d00" },
  jade: { color: "#008141", textColor: "white", darkColor: "#006633" },
  teal: { color: "#008282", textColor: "white", darkColor: "#006666" },
  cerulean: { color: "#005682", textColor: "white", darkColor: "#004466" },
  indigo: { color: "#000056", textColor: "white", darkColor: "#000044" },
  purple: { color: "#2b0057", textColor: "white", darkColor: "#1f0042" },
  violet: { color: "#6a006a", textColor: "white", darkColor: "#4d004d" },
  fuchsia: { color: "#a1004f", textColor: "white", darkColor: "#80003d" },
  human: { color: "#ff0000", textColor: "white", darkColor: "#cc0000" },
}

export function PesterlogCard({
  bloodColor,
  children,
  className,
  header,
  footer,
  compact = false,
}: PesterlogCardProps) {
  const style = bloodColorMap[bloodColor] || {
    color: "#333333",
    textColor: "white",
    darkColor: "#222222",
  }

  const zodiacSign = bloodColorToZodiac[bloodColor] || "unknown"

  return (
    <Card
      className={cn(
        "overflow-hidden border-2 transition-all bg-[hsl(var(--tumblr-dark))]",
        compact ? "hover:shadow-md" : "hover:shadow-lg",
        className,
      )}
      style={{ borderColor: style.color }}
    >
      <div
        className={cn("flex items-center px-4", compact ? "h-8" : "h-12")}
        style={{
          backgroundColor: style.color,
          color: style.textColor,
          borderBottom: `1px solid ${style.darkColor}`,
        }}
      >
        <ZodiacSymbol
          sign={zodiacSign as ZodiacSign}
          color={style.textColor}
          size={compact ? "sm" : "md"}
          className="mr-2"
        />
        {header}
      </div>

      <CardContent className={cn("p-4", compact ? "bg-[hsl(var(--tumblr-dark))]" : "bg-[hsl(var(--tumblr-dark))]")}>
        {children}
      </CardContent>

      {footer && (
        <CardFooter className="border-t p-3 bg-[hsl(var(--tumblr-darker))]" style={{ borderColor: `${style.color}40` }}>
          {footer}
        </CardFooter>
      )}
    </Card>
  )
}

