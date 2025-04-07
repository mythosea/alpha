"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Save, Trash2, Copy, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

export type QuirkRule = {
  id: string
  type: "replace" | "prefix" | "suffix" | "capitalize" | "uppercase" | "lowercase" | "reverse" | "repeat"
  find?: string
  replace?: string
  value?: string
  enabled: boolean
}

export type QuirkPreset = {
  name: string
  description: string
  rules: QuirkRule[]
}

const quirkPresets: QuirkPreset[] = [
  {
    name: "Karkat Style",
    description: "ALL CAPS, NO PUNCTUATION",
    rules: [{ id: "1", type: "uppercase", enabled: true }],
  },
  {
    name: "Sollux Style",
    description: "Replace 's' with '2', 'i' with 'ii', etc.",
    rules: [
      { id: "1", type: "replace", find: "s", replace: "2", enabled: true },
      { id: "2", type: "replace", find: "S", replace: "2", enabled: true },
      { id: "3", type: "replace", find: "i", replace: "ii", enabled: true },
      { id: "4", type: "replace", find: "I", replace: "II", enabled: true },
      { id: "5", type: "replace", find: "to", replace: "two", enabled: true },
      { id: "6", type: "replace", find: "too", replace: "two", enabled: true },
    ],
  },
  {
    name: "Terezi Style",
    description: "ALL CAPS WITH NUMBERS (A=4, E=3, I=1)",
    rules: [
      { id: "1", type: "uppercase", enabled: true },
      { id: "2", type: "replace", find: "A", replace: "4", enabled: true },
      { id: "3", type: "replace", find: "E", replace: "3", enabled: true },
      { id: "4", type: "replace", find: "I", replace: "1", enabled: true },
    ],
  },
  {
    name: "Kanaya Style",
    description: "Proper Grammar And Capitalization Of Every Word",
    rules: [{ id: "1", type: "capitalize", enabled: true }],
  },
  {
    name: "Tavros Style",
    description: "rEVERSE CAPITALIZATION, cOMMA AFTER EVERY PHRASE,",
    rules: [
      { id: "1", type: "reverse", enabled: true },
      { id: "2", type: "replace", find: ". ", replace: ", ", enabled: true },
      { id: "3", type: "replace", find: "? ", replace: ", ", enabled: true },
      { id: "4", type: "replace", find: "! ", replace: ", ", enabled: true },
    ],
  },
  {
    name: "Gamzee Style",
    description: "AlTeRnAtInG cApS",
    rules: [{ id: "1", type: "repeat", value: "alternate", enabled: true }],
  },
  {
    name: "Eridan Style",
    description: "Double 'w's and 'v's, no 'g's",
    rules: [
      { id: "1", type: "replace", find: "w", replace: "ww", enabled: true },
      { id: "2", type: "replace", find: "v", replace: "vv", enabled: true },
      { id: "3", type: "replace", find: "g", replace: "", enabled: true },
      { id: "4", type: "replace", find: "G", replace: "", enabled: true },
    ],
  },
  {
    name: "Feferi Style",
    description: "Replace 'H' with ')(', 'E' with '-E'",
    rules: [
      { id: "1", type: "replace", find: "H", replace: ")(", enabled: true },
      { id: "2", type: "replace", find: "h", replace: ")(", enabled: true },
      { id: "3", type: "replace", find: "E", replace: "-E", enabled: true },
      { id: "4", type: "replace", find: "e", replace: "-e", enabled: true },
      { id: "5", type: "prefix", value: "38)", enabled: true },
    ],
  },
  {
    name: "Dave Style",
    description: "lowercase with no punctuation and ironic metaphors",
    rules: [{ id: "1", type: "lowercase", enabled: true }],
  },
]

interface QuirkEditorProps {
  initialRules?: QuirkRule[]
  onSave: (rules: QuirkRule[]) => void
  onCancel?: () => void
  characterBloodColor?: string
}

export function QuirkEditor({ initialRules = [], onSave, onCancel, characterBloodColor = "#333" }: QuirkEditorProps) {
  const [rules, setRules] = useState<QuirkRule[]>(initialRules.length > 0 ? initialRules : [])
  const [previewText, setPreviewText] = useState("This is a test message. How does it look?")
  const [activeTab, setActiveTab] = useState("rules")
  const [copied, setCopied] = useState(false)

  const addRule = (type: QuirkRule["type"]) => {
    const newRule: QuirkRule = {
      id: Date.now().toString(),
      type,
      enabled: true,
    }

    if (type === "replace") {
      newRule.find = ""
      newRule.replace = ""
    } else if (type === "prefix" || type === "suffix" || type === "repeat") {
      newRule.value = ""
    }

    setRules([...rules, newRule])
  }

  const updateRule = (id: string, updates: Partial<QuirkRule>) => {
    setRules(rules.map((rule) => (rule.id === id ? { ...rule, ...updates } : rule)))
  }

  const removeRule = (id: string) => {
    setRules(rules.filter((rule) => rule.id !== id))
  }

  const applyPreset = (preset: QuirkPreset) => {
    setRules([...preset.rules])
  }

  const applyQuirk = (text: string): string => {
    let result = text

    // Apply each enabled rule in order
    rules
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
            } else if (rule.value && !isNaN(Number.parseInt(rule.value))) {
              // Repeat certain letters (not implemented yet)
              // This would be for quirks like "helloooooo" where o is repeated
            }
            break
        }
      })

    return result
  }

  const copyToClipboard = () => {
    const quirkDescription = rules
      .filter((r) => r.enabled)
      .map((rule) => {
        switch (rule.type) {
          case "replace":
            return `Replace "${rule.find}" with "${rule.replace}"`
          case "prefix":
            return `Add prefix "${rule.value}"`
          case "suffix":
            return `Add suffix "${rule.value}"`
          case "capitalize":
            return "Capitalize Each Word"
          case "uppercase":
            return "UPPERCASE"
          case "lowercase":
            return "lowercase"
          case "reverse":
            return "rEVERSE cAPITALIZATION"
          case "repeat":
            if (rule.value === "alternate") return "AlTeRnAtInG cApS"
            return `Repeat pattern "${rule.value}"`
        }
      })
      .join(", ")

    navigator.clipboard.writeText(quirkDescription)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getRuleLabel = (type: QuirkRule["type"]): string => {
    switch (type) {
      case "replace":
        return "Replace Text"
      case "prefix":
        return "Add Prefix"
      case "suffix":
        return "Add Suffix"
      case "capitalize":
        return "Capitalize Words"
      case "uppercase":
        return "ALL UPPERCASE"
      case "lowercase":
        return "all lowercase"
      case "reverse":
        return "rEVERSE cAPS"
      case "repeat":
        return "AlTeRnAtE cApS"
      default:
        return type
    }
  }

  return (
    <Card className="w-full bg-card">
      <CardHeader>
        <CardTitle>Typing Quirk Editor</CardTitle>
        <CardDescription>
          Create custom typing quirks for your character. Rules are applied in order from top to bottom.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4 bg-muted">
            <TabsTrigger value="rules">Rules</TabsTrigger>
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <Button variant="outline" size="sm" onClick={() => addRule("replace")}>
                <PlusCircle className="h-4 w-4 mr-1" /> Replace
              </Button>
              <Button variant="outline" size="sm" onClick={() => addRule("prefix")}>
                <PlusCircle className="h-4 w-4 mr-1" /> Prefix
              </Button>
              <Button variant="outline" size="sm" onClick={() => addRule("suffix")}>
                <PlusCircle className="h-4 w-4 mr-1" /> Suffix
              </Button>
              <Button variant="outline" size="sm" onClick={() => addRule("capitalize")}>
                <PlusCircle className="h-4 w-4 mr-1" /> Capitalize
              </Button>
              <Button variant="outline" size="sm" onClick={() => addRule("uppercase")}>
                <PlusCircle className="h-4 w-4 mr-1" /> UPPERCASE
              </Button>
              <Button variant="outline" size="sm" onClick={() => addRule("lowercase")}>
                <PlusCircle className="h-4 w-4 mr-1" /> lowercase
              </Button>
              <Button variant="outline" size="sm" onClick={() => addRule("reverse")}>
                <PlusCircle className="h-4 w-4 mr-1" /> rEVERSE
              </Button>
              <Button variant="outline" size="sm" onClick={() => addRule("repeat")}>
                <PlusCircle className="h-4 w-4 mr-1" /> AlTeRnAtE
              </Button>
            </div>

            <ScrollArea className="h-[300px] pr-4">
              {rules.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No rules added yet. Add a rule to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {rules.map((rule, index) => (
                    <Card key={rule.id} className="relative bg-muted">
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={(checked) => updateRule(rule.id, { enabled: checked })}
                        />
                        <Button variant="ghost" size="icon" onClick={() => removeRule(rule.id)} className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={rule.enabled ? "default" : "outline"}>Rule {index + 1}</Badge>
                          <CardTitle className="text-base">{getRuleLabel(rule.type)}</CardTitle>
                        </div>
                      </CardHeader>

                      <CardContent>
                        {rule.type === "replace" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`find-${rule.id}`}>Find</Label>
                              <Input
                                id={`find-${rule.id}`}
                                value={rule.find || ""}
                                onChange={(e) => updateRule(rule.id, { find: e.target.value })}
                                placeholder="Text to find"
                                className="bg-background"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`replace-${rule.id}`}>Replace with</Label>
                              <Input
                                id={`replace-${rule.id}`}
                                value={rule.replace || ""}
                                onChange={(e) => updateRule(rule.id, { replace: e.target.value })}
                                placeholder="Replacement text"
                                className="bg-background"
                              />
                            </div>
                          </div>
                        )}

                        {(rule.type === "prefix" || rule.type === "suffix") && (
                          <div className="space-y-2">
                            <Label htmlFor={`value-${rule.id}`}>
                              {rule.type === "prefix" ? "Prefix Text" : "Suffix Text"}
                            </Label>
                            <Input
                              id={`value-${rule.id}`}
                              value={rule.value || ""}
                              onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                              placeholder={rule.type === "prefix" ? "Text to add at beginning" : "Text to add at end"}
                              className="bg-background"
                            />
                          </div>
                        )}

                        {rule.type === "repeat" && (
                          <div className="space-y-2">
                            <Label htmlFor={`repeat-type-${rule.id}`}>Repeat Type</Label>
                            <Select
                              value={rule.value || "alternate"}
                              onValueChange={(value) => updateRule(rule.id, { value })}
                            >
                              <SelectTrigger id={`repeat-type-${rule.id}`} className="bg-background">
                                <SelectValue placeholder="Select repeat type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="alternate">AlTeRnAtInG cApS</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {(rule.type === "capitalize" ||
                          rule.type === "uppercase" ||
                          rule.type === "lowercase" ||
                          rule.type === "reverse") && (
                          <div className="text-sm text-muted-foreground">
                            This rule doesn't require any additional configuration.
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="presets">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quirkPresets.map((preset) => (
                <Card
                  key={preset.name}
                  className="cursor-pointer hover:bg-muted/50 bg-card"
                  onClick={() => applyPreset(preset)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{preset.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{preset.description}</p>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        {preset.rules.length} {preset.rules.length === 1 ? "rule" : "rules"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="preview-input">Test Text</Label>
                <Textarea
                  id="preview-input"
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  placeholder="Enter text to preview your quirk"
                  className="min-h-[100px] bg-muted"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Preview</Label>
                  <Button variant="ghost" size="sm" className="h-8 flex items-center gap-1" onClick={copyToClipboard}>
                    {copied ? (
                      <>
                        <Check className="h-3 w-3" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> Copy Description
                      </>
                    )}
                  </Button>
                </div>
                <div
                  className="border rounded-md p-4 min-h-[100px] whitespace-pre-line bg-muted"
                  style={{ color: characterBloodColor }}
                >
                  {applyQuirk(previewText)}
                </div>
              </div>

              <div className="pt-4">
                <Separator className="mb-4 bg-border" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium">Active Rules:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    {rules.filter((r) => r.enabled).length === 0 ? (
                      <li>No active rules</li>
                    ) : (
                      rules
                        .filter((r) => r.enabled)
                        .map((rule, i) => (
                          <li key={i}>
                            {rule.type === "replace" && `Replace "${rule.find}" with "${rule.replace}"`}
                            {rule.type === "prefix" && `Add prefix "${rule.value}"`}
                            {rule.type === "suffix" && `Add suffix "${rule.value}"`}
                            {rule.type === "capitalize" && "Capitalize Each Word"}
                            {rule.type === "uppercase" && "UPPERCASE"}
                            {rule.type === "lowercase" && "lowercase"}
                            {rule.type === "reverse" && "rEVERSE cAPITALIZATION"}
                            {rule.type === "repeat" && rule.value === "alternate" && "AlTeRnAtInG cApS"}
                          </li>
                        ))
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between bg-card">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={() => onSave(rules)} className="ml-auto">
          <Save className="h-4 w-4 mr-2" />
          Save Quirk
        </Button>
      </CardFooter>
    </Card>
  )
}

