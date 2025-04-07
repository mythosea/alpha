export type Character = {
  id: string
  name: string
  trollTag: string
  species: "troll" | "human"
  bloodColor: string
  age: string
  gender: string
  lusus?: string
  quirk: string
  quirkRules?: QuirkRule[]
  interests: string
  backstory: string
  createdAt: string
  imageUrl?: string
}

export type QuirkRule = {
  id: string
  type: "replace" | "prefix" | "suffix" | "capitalize" | "uppercase" | "lowercase" | "reverse" | "repeat"
  find?: string
  replace?: string
  value?: string
  enabled: boolean
}

