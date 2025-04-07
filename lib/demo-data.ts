import type { Character } from "@/types/character"
import type { UserPresence } from "@/types/chat"

// Demo characters data - same as from demo page but reusable
export const demoCharacters: Character[] = [
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
    quirkRules: [
      { id: "1", type: "replace", find: "s", replace: "2", enabled: true },
      { id: "2", type: "replace", find: "S", replace: "2", enabled: true },
      { id: "3", type: "replace", find: "i", replace: "ii", enabled: true },
      { id: "4", type: "replace", find: "I", replace: "II", enabled: true },
      { id: "5", type: "replace", find: "to", replace: "two", enabled: true },
      { id: "6", type: "replace", find: "too", replace: "two", enabled: true },
    ],
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
    quirkRules: [
      { id: "1", type: "uppercase", enabled: true },
      { id: "2", type: "replace", find: "A", replace: "4", enabled: true },
      { id: "3", type: "replace", find: "E", replace: "3", enabled: true },
      { id: "4", type: "replace", find: "I", replace: "1", enabled: true },
    ],
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
    quirkRules: [{ id: "1", type: "capitalize", enabled: true }],
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
    quirkRules: [{ id: "1", type: "lowercase", enabled: true }],
    interests: "Irony, rapping, mixing music, photography, dead things, swords",
    backstory:
      "A cool kid who maintains an ironic persona to hide his insecurities. Dave was raised by his Bro, who trained him in combat with swords. He has an extensive collection of dead things preserved in jars and creates Sweet Bro and Hella Jeff, a deliberately poorly drawn comic. He later discovers his time manipulation abilities.",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
  },
  {
    id: "demo-5",
    name: "Karkat Vantas",
    trollTag: "carcinoGeneticist",
    species: "troll",
    bloodColor: "burgundy",
    age: "6 solar sweeps",
    gender: "Male",
    lusus: "Crab-like creature that raised and protected him",
    quirk: "ALL CAPS, FREQUENTLY ANGRY AND SHOUTY",
    quirkRules: [{ id: "1", type: "uppercase", enabled: true }],
    interests: "Romance movies, leadership, shouting, concealing his blood color",
    backstory:
      "A perpetually angry troll with a hidden mutation: candy-red blood, the lowest on the hemospectrum. He compensates for his insecurity with a loud personality and constant shouting. Despite his brash exterior, Karkat is a natural leader who deeply cares for his friends.",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Create demo user presence data
export const demoPesterchumUsers: Record<string, UserPresence> = {
  "demo-user-1": {
    userId: "demo-user-1",
    username: "solluxCaptor",
    activeCharacterId: "demo-1",
    status: "online",
    lastActive: new Date().toISOString(),
  },
  "demo-user-2": {
    userId: "demo-user-2",
    username: "tereziFan",
    activeCharacterId: "demo-2",
    status: "online",
    lastActive: new Date().toISOString(),
  },
  "demo-user-3": {
    userId: "demo-user-3",
    username: "kanayaM",
    activeCharacterId: "demo-3",
    status: "idle",
    lastActive: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  "demo-user-4": {
    userId: "demo-user-4",
    username: "daveStrides",
    activeCharacterId: "demo-4",
    status: "online",
    lastActive: new Date().toISOString(),
  },
  "demo-user-5": {
    userId: "demo-user-5",
    username: "karkatLeader",
    activeCharacterId: "demo-5",
    status: "busy",
    lastActive: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
}

// Helper function to generate a random demo response
export function getRandomDemoResponse(character: Character): string {
  const responses: Record<string, string[]> = {
    "demo-1": [
      "hey there, what'2 up?",
      "ii'm kiinda bu2y codiing riight now",
      "my computer ii2 probably goiing two explode agaiin",
      "have you talked two kk lately? he'2 beiing weiirder than u2ual",
      "ii've been haviing tho2e dream2 agaiin... about the end of alterniia",
      "2ometiime2 ii wonder iif we're all ju2t doomed anyway",
      "do you beliieve iin fate? ii thiink we're all ju2t 2tuck on a path",
      "ff ha2 been really helpful lately. 2he'2 niice for a hiighblood",
      "my p2iioniic2 have been actiing up agaiin. headache2 all the tiime",
      "thii2 code ii'm workiing on ii2 a complete me22",
    ],
    "demo-2": [
      "H3Y TH3R3! >:] 1 C4N SM3LL YOU!",
      "1 JUST F1N1SH3D 4NOTH3R 1NV3ST1G4T1ON. GU1LTY 4S CH4RG3D!",
      "H4V3 YOU S33N VR1SK4? SH3'S UP TO SOM3TH1NG 4G41N",
      "MY DR4GON PLUSH13S 4R3 G3TT1NG DUST1ER BY TH3 D4Y",
      "TH3 SM3LL OF R3D CH4LK 1S TH3 B3ST! >:D",
      "JUST1C3 DO3SN'T SL33P 4ND N31TH3R DO 1!",
      "1'M PL4NN1NG 4 N3W COURT S3SS1ON. YOU'R3 1NV1T3D!",
      "DON'T WORRY, 1 C4N S33 3V3RYTH1NG P3RF3CTLY W3LL >:P",
      "K4RK4T H4S B33N SHOUT1NG 3V3N MOR3 TH4N USU4L L4T3LY",
      "TH1S G4M3 W3'R3 PL4Y1NG SOUNDS D4NG3ROUS. 1'M 1N!",
    ],
    "demo-3": [
      "Hello There. I Hope You Are Having A Pleasant Day.",
      "I Have Been Working On A New Dress Design Recently.",
      "The Mother Grub Has Been Acting Rather Peculiar Lately.",
      "Would You Like To Join Me For Some Tea Later?",
      "I Find The Concept Of Human Fashion Quite Interesting.",
      "Rose And I Have Been Discussing Literature Together.",
      "The Garden Is Coming Along Quite Nicely This Season.",
      "I Recently Acquired A New Novel About Rainbow Drinkers.",
      "Have You Seen Vriska? I Need To Speak With Her About Something Important.",
      "I May Need To Sharpen My Chainsaw Soon. It's Becoming Quite Dull.",
    ],
    "demo-4": [
      "sup",
      "yeah so i was mixing some sick beats earlier",
      "my bro is being weird again with his puppets",
      "irony is basically the air i breathe",
      "sometimes i think about how weird time travel would be",
      "sweet bro and hella jeff is my magnum opus no i will not elaborate",
      "jade sent me another really weird drawing today",
      "i'm basically drowning in apple juice right now",
      "terezi keeps licking her screen when we chat it's gross but also kinda funny",
      "you ever just think about how we're all just floating on a rock in space",
    ],
    "demo-5": [
      "WHAT THE HELL DO YOU WANT?",
      "I'M SURROUNDED BY COMPLETE IDIOTS ALL THE TIME.",
      "DON'T TALK TO ME ABOUT QUADRANTS RIGHT NOW, I'M BUSY.",
      "THIS IS ABSOLUTELY THE WORST TIMELINE POSSIBLE.",
      "I CAN'T BELIEVE I HAVE TO DEAL WITH THIS NONSENSE.",
      "EVERYONE KEEPS ASKING ME TO SOLVE THEIR PROBLEMS.",
      "HAVE YOU SEEN MY ROMCOMS? SOMEONE TOOK THEM AGAIN.",
      "SOLLUX IS BEING TWICE THE IDIOT HE USUALLY IS TODAY.",
      "I'M THE ONLY ONE WITH ANY SENSE AROUND HERE.",
      "FINE, WHAT'S YOUR CRISIS THIS TIME? I'M LISTENING.",
    ],
  }

  // Default to random responses if character ID doesn't match
  const characterResponses = responses[character.id] || [
    "Hello there.",
    "Nice to meet you.",
    "How are you doing?",
    "Interesting weather we're having.",
    "I'm a bit busy right now.",
  ]

  // Return a random response from the character's list
  return characterResponses[Math.floor(Math.random() * characterResponses.length)]
}

