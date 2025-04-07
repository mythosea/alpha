import { cn } from "@/lib/utils"

export type ZodiacSign =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces"
  | "human"
  | "unknown"

// Map blood colors to zodiac signs
export const bloodColorToZodiac: Record<string, ZodiacSign> = {
  burgundy: "aries",
  bronze: "taurus",
  gold: "gemini",
  lime: "cancer", // Rare/extinct in canon
  olive: "leo",
  jade: "virgo",
  teal: "libra",
  cerulean: "scorpio",
  indigo: "sagittarius",
  purple: "capricorn",
  violet: "aquarius",
  fuchsia: "pisces",
  human: "human",
}

interface ZodiacSymbolProps {
  sign: ZodiacSign
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  color?: string
}

export function ZodiacSymbol({ sign, className, size = "md", color }: ZodiacSymbolProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  }

  // SVG paths for each zodiac symbol
  const getSymbolPath = (sign: ZodiacSign) => {
    switch (sign) {
      case "aries":
        return "M12,2 C8,2 4,6 4,12 C4,18 8,22 12,22 M12,2 C16,2 20,6 20,12 C20,18 16,22 12,22"
      case "taurus":
        return "M7,6 C7,3 9,2 12,2 C15,2 17,3 17,6 C17,9 15,11 12,11 C9,11 7,9 7,6 M12,11 L12,22"
      case "gemini":
        return "M8,4 L8,20 M16,4 L16,20 M8,7 L16,7 M8,17 L16,17"
      case "cancer":
        return "M6,12 C6,7 10,4 14,6 C18,8 18,16 14,18 C10,20 6,17 6,12 M14,6 C16,6 18,4 18,2 M14,18 C16,18 18,20 18,22"
      case "leo":
        return "M12,2 C7,2 4,5 4,9 C4,13 7,16 12,16 C17,16 20,13 20,9 C20,5 17,2 12,2 M12,16 L12,22"
      case "virgo":
        return "M14,2 C11,2 8,4 8,8 L8,16 C8,18 6,20 4,20 M8,12 C8,14 10,16 12,16 C14,16 16,14 16,12 L16,4 C16,3 17,2 18,2 C19,2 20,3 20,4 L20,12 C20,17 16,22 10,22"
      case "libra":
        return "M6,10 L18,10 M6,6 L18,6 M12,6 L12,22"
      case "scorpio":
        return "M4,12 C4,7 8,2 12,2 C16,2 20,7 20,12 L20,18 C20,20 18,22 16,22 C14,22 12,20 12,18 L12,12 C12,10 10,8 8,8 C6,8 4,10 4,12 L4,22"
      case "sagittarius":
        return "M8,16 L20,4 M14,4 L20,4 L20,10 M4,20 L16,8"
      case "capricorn":
        return "M18,4 C18,2 16,2 14,2 C12,2 10,2 10,4 L10,14 C10,16 8,18 6,18 C4,18 2,16 2,14 M10,14 C10,18 14,22 18,22 C22,22 22,18 22,14 L22,2"
      case "aquarius":
        return "M4,8 C8,4 16,12 20,8 M4,16 C8,12 16,20 20,16"
      case "pisces":
        return "M6,4 C6,12 6,14 6,22 M18,4 C18,12 18,14 18,22 M6,13 L18,13"
      case "human":
        return "M12,2 C14.21,2 16,3.79 16,6 C16,8.21 14.21,10 12,10 C9.79,10 8,8.21 8,6 C8,3.79 9.79,2 12,2 M12,11 C16.97,11 21,15.03 21,20 L3,20 C3,15.03 7.03,11 12,11"
      default:
        return "M12,2 L12,22 M2,12 L22,12" // Unknown/default
    }
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(sizeClasses[size], className)}
    >
      <path d={getSymbolPath(sign)} />
    </svg>
  )
}

