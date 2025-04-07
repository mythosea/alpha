"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Check } from "lucide-react"

// Demo characters data
const demoCharacters = [
  {
    id: "demo-1",
    name: "Sollux Captor",
    trollTag: "twinArmageddons",
    species: "troll",
    bloodColor: "gold",
    age: "6 solar sweeps",
    gender: "Male",
    lusus: "Bicyclops - a two-headed lusus with one head always happy and one always angry",
    quirk: "Replace 's' with '2' and 'i' with 'ii', doubles some letters",
    interests: "Programming, hacking, doom prophecies, binary code, mind honey",
    backstory:
      "A skilled programmer with psionic abilities, Sollux has a dual nature and is constantly torn between optimism and pessimism. He has prophetic visions of doom and destruction, which often come true. His psionic abilities allow him to move objects with his mind and shoot destructive beams from his eyes.",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  },
  {
    id: "demo-2",
    name: "Terezi Pyrope",
    trollTag: "gallowsCalibrator",
    species: "troll",
    bloodColor: "teal",
    age: "6 solar sweeps",
    gender: "Female",
    lusus: "Dragon - a small dragon lusus that taught her justice and fairness",
    quirk: "ALL CAPS WITH NUMBERS REPLACING LETTERS (A=4, E=3, I=1)",
    interests: "Justice, law, investigation, dragons, chalk, roleplaying",
    backstory:
      "Blinded at a young age, Terezi learned to 'see' through smell and taste. She has a strong sense of justice and aspires to be a legislacerator. She enjoys roleplaying and has a quirky, playful personality despite her intimidating exterior. Her keen senses make her an excellent detective.",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
  },
  {
    id: "demo-3",
    name: "Kanaya Maryam",
    trollTag: "grimAuxiliatrix",
    species: "troll",
    bloodColor: "jade",
    age: "6 solar sweeps",
    gender: "Female",
    lusus: "Virgin Mother Grub - a combination of a mother grub and a giant caterpillar",
    quirk: "Proper Grammar And Capitalization Of Every Word",
    interests: "Fashion, gardening, vampire romance novels, chainsaw wielding, rainbow drinker lore",
    backstory:
      "A rare jade-blooded troll tasked with caring for the Mother Grub. Kanaya is elegant, fashionable, and has a maternal instinct unusual for trolls. She enjoys creating clothing and has a fascination with rainbow drinkers (troll vampires). She later becomes a rainbow drinker herself, gaining the ability to glow in the dark.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    id: "demo-4",
    name: "Dave Strider",
    trollTag: "turntechGodhead",
    species: "human",
    bloodColor: "human",
    age: "13",
    gender: "Male",
    quirk: "lowercase with no punctuation and ironic metaphors",
    interests: "Irony, rapping, mixing music, photography, dead things, swords",
    backstory:
      "A cool kid who maintains an ironic persona to hide his insecurities. Dave was raised by his Bro, who trained him in combat with swords. He has an extensive collection of dead things preserved in jars and creates Sweet Bro and Hella Jeff, a deliberately poorly drawn comic. He later discovers his time manipulation abilities.",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
  },
]

// Demo posts data
const demoPosts = [
  {
    id: "post-1",
    characterId: "demo-1",
    content:
      "just finished coding a new virus that will probably destroy my computer again. sometimes i wonder why i do this to myself but then i remember that i'm literally destined to bring destruction wherever i go.",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    likes: 4,
    liked: false,
  },
  {
    id: "post-2",
    characterId: "demo-2",
    content:
      "1NV3ST1G4T1NG 4 N3W C4S3 TOD4Y! SOM3ON3 STOL3 4LL TH3 R3D CH4LK FROM MY H1V3 4ND 1 C4N SM3LL TH3 CULPR1T! JUST1C3 W1LL B3 S3RV3D!",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000).toISOString(), // 2 days and 2 hours ago
    likes: 7,
    liked: true,
  },
  {
    id: "post-3",
    characterId: "demo-3",
    content:
      "I Have Just Completed A New Dress Design That I Believe Will Be Most Flattering For Trolls Of All Blood Colors. The Fabric Selection Was Quite The Challenge But I Believe The Final Result Is Quite Elegant.",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    likes: 5,
    liked: false,
  },
  {
    id: "post-4",
    characterId: "demo-4",
    content:
      "yo so i just dropped the sickest beat its like if a meteor crashed into a turntable factory and somehow created the perfect rhythm instead of just destroying everything which would be the logical outcome i guess",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 12 * 60 * 60 * 1000).toISOString(), // 1 day and 12 hours ago
    likes: 6,
    liked: true,
  },
  {
    id: "post-5",
    characterId: "demo-1",
    content:
      "ii'm pretty 2ure my computer ii2 po22e22ed now. iit keep2 makiing thii2 weiird buzziing 2ound and the 2creen fliicker2 between red and blue. kiind of cool actually.",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    likes: 3,
    liked: false,
  },
  {
    id: "post-6",
    characterId: "demo-2",
    content:
      "H3Y @twinArmageddons YOUR COMPUT3R 1SN'T POSS3SS3D, 1T'S JUST BROK3N! 1 C4N SM3LL TH3 BURN1NG C1RCU1TS FROM H3R3! M4YB3 STOP POUR1NG M1ND HON3Y ON 1T?",
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
    likes: 8,
    liked: true,
  },
  {
    id: "post-7",
    characterId: "demo-3",
    content:
      "I Would Like To Extend An Invitation To Everyone For A Gathering At My Hive This Evening. I Have Prepared Refreshments And Would Appreciate Some Feedback On My Latest Fashion Creations.",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    likes: 5,
    liked: false,
  },
  {
    id: "post-8",
    characterId: "demo-4",
    content:
      "kanaya i'll be there but only if you promise not to try and make me wear one of those troll suits again last time i looked like a waiter at an alien prom",
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 hours ago
    likes: 9,
    liked: true,
  },
  {
    id: "post-9",
    characterId: "demo-3",
    content:
      "I Assure You Dave That I Have Created Something Much More Suited To Your Aesthetic This Time. It Incorporates Several Elements Of What You Call 'Irony' Though I Must Admit I Still Don't Fully Understand The Concept.",
    timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(), // 9 hours ago
    likes: 4,
    liked: false,
  },
  {
    id: "post-10",
    characterId: "demo-1",
    content:
      "ii'll try two make iit two your hiive @grimAuxiliatrix but no promii2e2. my lu2u2 ii2 actiing up agaiin. one head ii2 happy about the party and the other one ii2 conviinced iit'2 a trap. typiical.",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    likes: 3,
    liked: true,
  },
]

export default function DemoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadDemoData = () => {
    try {
      setLoading(true)
      setError(null)

      // Save demo characters to localStorage
      localStorage.setItem("homestuckCharacters", JSON.stringify(demoCharacters))

      // Save demo posts to localStorage
      localStorage.setItem("homestuckPosts", JSON.stringify(demoPosts))

      // Set the first character as active
      localStorage.setItem("activeCharacterId", demoCharacters[0].id)

      setSuccess(true)
      setLoading(false)

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/feed")
      }, 2000)
    } catch (err) {
      setError("Failed to load demo data. Please try again.")
      setLoading(false)
    }
  }

  const clearDemoData = () => {
    try {
      setLoading(true)
      setError(null)

      // Clear localStorage
      localStorage.removeItem("homestuckCharacters")
      localStorage.removeItem("homestuckPosts")
      localStorage.removeItem("activeCharacterId")

      setSuccess(true)
      setLoading(false)

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (err) {
      setError("Failed to clear demo data. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Myrhosea Demo Data</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Load Demo Characters & Posts</CardTitle>
          <CardDescription>
            Load a set of sample characters and posts to see how the application works. This will replace any existing
            characters and posts you have created.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <h3 className="font-semibold mb-2">Characters:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {demoCharacters.map((char) => (
                  <li key={char.id}>
                    {char.name} ({char.bloodColor} blood)
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Sample Posts:</h3>
              <p className="text-sm text-muted-foreground">
                {demoPosts.length} posts with interactions between characters
              </p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mt-6 border-green-500">
              <Check className="h-4 w-4 text-green-500" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>Demo data loaded successfully. Redirecting...</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
          <Button variant="outline" onClick={clearDemoData} disabled={loading} className="w-full sm:w-auto">
            Clear Demo Data
          </Button>
          <Button onClick={loadDemoData} disabled={loading || success} className="w-full sm:w-auto">
            {loading ? "Loading..." : "Load Demo Data"}
          </Button>
        </CardFooter>
      </Card>

      <div className="text-center">
        <Button variant="ghost" onClick={() => router.push("/")}>
          Return to Home
        </Button>
      </div>
    </div>
  )
}

