"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ZodiacSymbol, bloodColorToZodiac } from "@/components/zodiac-symbol"
import { ImageUpload } from "@/components/image-upload"

const bloodColors = [
  { value: "burgundy", label: "Burgundy (Rust)", hex: "#a10000" },
  { value: "bronze", label: "Bronze", hex: "#a15000" },
  { value: "gold", label: "Gold (Yellow)", hex: "#a1a100" },
  { value: "lime", label: "Lime", hex: "#01a100" },
  { value: "olive", label: "Olive", hex: "#416600" },
  { value: "jade", label: "Jade", hex: "#008141" },
  { value: "teal", label: "Teal", hex: "#008282" },
  { value: "cerulean", label: "Cerulean", hex: "#005682" },
  { value: "indigo", label: "Indigo", hex: "#000056" },
  { value: "purple", label: "Purple", hex: "#2b0057" },
  { value: "violet", label: "Violet", hex: "#6a006a" },
  { value: "fuchsia", label: "Fuchsia", hex: "#a1004f" },
  { value: "human", label: "Human (Red)", hex: "#ff0000" },
]

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  trollTag: z.string().min(2, { message: "Troll tag must be at least 2 characters." }),
  species: z.enum(["troll", "human"]),
  bloodColor: z.string().min(1, { message: "Please select a blood color." }),
  age: z.string().min(1, { message: "Please enter an age." }),
  gender: z.string().min(1, { message: "Please enter a gender." }),
  lusus: z.string().optional(),
  quirk: z.string().min(1, { message: "Please describe your character's typing quirk." }),
  interests: z.string().min(1, { message: "Please list some interests." }),
  backstory: z.string().min(10, { message: "Backstory must be at least 10 characters." }),
  imageUrl: z.string().optional(),
})

export default function CreateCharacterPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      trollTag: "",
      species: "troll",
      bloodColor: "",
      age: "",
      gender: "",
      lusus: "",
      quirk: "",
      interests: "",
      backstory: "",
      imageUrl: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, we would save this to a database
    // For now, we'll just store it in localStorage
    const characters = JSON.parse(localStorage.getItem("homestuckCharacters") || "[]")
    characters.push({
      id: Date.now().toString(),
      ...values,
      createdAt: new Date().toISOString(),
    })
    localStorage.setItem("homestuckCharacters", JSON.stringify(characters))

    // Navigate to the characters page
    router.push("/characters")
  }

  const selectedBloodColor = form.watch("bloodColor")
  const characterName = form.watch("name")
  const zodiacSign = selectedBloodColor ? bloodColorToZodiac[selectedBloodColor] : undefined

  return (
    <div className="container mx-auto px-4 py-6 md:py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Create Your Character</h1>

      <Card className="bg-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <CardTitle>Character Details</CardTitle>
            {zodiacSign && (
              <ZodiacSymbol
                sign={zodiacSign}
                color={bloodColors.find((b) => b.value === selectedBloodColor)?.hex || "#fff"}
              />
            )}
          </div>
          <CardDescription>Fill out the information below to create your character.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-8 bg-muted">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="appearance">Appearance</TabsTrigger>
                  <TabsTrigger value="background">Background</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Character Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Karkat Vantas" {...field} className="bg-muted" />
                        </FormControl>
                        <FormDescription>Your character's full name.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="trollTag"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Troll Tag / Handle</FormLabel>
                        <FormControl>
                          <Input placeholder="carcinoGeneticist" {...field} className="bg-muted" />
                        </FormControl>
                        <FormDescription>Your character's chat handle or troll tag.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="species"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Species</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="troll" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">Troll</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="human" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">Human</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex space-x-4">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input placeholder="6 solar sweeps" {...field} className="bg-muted" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Gender</FormLabel>
                          <FormControl>
                            <Input placeholder="Male" {...field} className="bg-muted" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="button" onClick={() => setActiveTab("appearance")} className="w-full">
                    Next: Appearance
                  </Button>
                </TabsContent>

                <TabsContent value="appearance" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="bloodColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blood Color</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-muted">
                                <SelectValue placeholder="Select blood color" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {bloodColors.map((color) => (
                                <SelectItem key={color.value} value={color.value}>
                                  <div className="flex items-center">
                                    <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color.hex }} />
                                    <span>{color.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            {form.watch("species") === "troll"
                              ? "Blood color determines your character's place in troll society."
                              : "Humans typically have red blood."}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Character Image</FormLabel>
                          <FormControl>
                            <ImageUpload
                              value={field.value}
                              onChange={field.onChange}
                              bloodColor={selectedBloodColor}
                              name={characterName}
                            />
                          </FormControl>
                          <FormDescription className="text-center">
                            Upload a profile image for your character
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="quirk"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Typing Quirk</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="ALL CAPS WITH NO PUNCTUATION"
                            className="min-h-[80px] bg-muted"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Describe how your character types in chat.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-4">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("basic")} className="flex-1">
                      Back
                    </Button>
                    <Button type="button" onClick={() => setActiveTab("background")} className="flex-1">
                      Next: Background
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="background" className="space-y-6">
                  {form.watch("species") === "troll" && (
                    <FormField
                      control={form.control}
                      name="lusus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lusus</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your character's custodian"
                              className="min-h-[80px] bg-muted"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Describe your troll's custodian/lusus.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="interests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interests & Hobbies</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Programming, romcoms, leadership"
                            className="min-h-[80px] bg-muted"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>List your character's interests, hobbies, and skills.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="backstory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Backstory</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write your character's backstory here..."
                            className="min-h-[150px] bg-muted"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide details about your character's background and history.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("appearance")}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button type="submit" className="flex-1">
                      Create Character
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

