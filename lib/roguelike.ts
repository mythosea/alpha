import readline from "readline"

function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1
}

class Character {
  name: string
  hp: number
  dieSides: number

  constructor(name: string, hp: number, dieSides: number) {
    this.name = name
    this.hp = hp
    this.dieSides = dieSides
  }

  attack(target: Character): number {
    const dmg = rollDie(this.dieSides)
    target.hp -= dmg
    return dmg
  }

  get alive(): boolean {
    return this.hp > 0
  }
}

async function play(): Promise<void> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  let level = 1
  const hero = new Character("Hero", 10, 6)

  const ask = (query: string) => new Promise<string>(resolve => rl.question(query, resolve))

  while (hero.alive) {
    const enemy = new Character(`Enemy L${level}`, 5 + level * 2, 3 + level - 1)
    console.log(`\n--- Level ${level} ---`)

    while (enemy.alive && hero.alive) {
      await ask("Press Enter to attack")
      const dmg = hero.attack(enemy)
      console.log(`You hit the enemy for ${dmg} damage (enemy hp: ${enemy.hp})`)
      if (!enemy.alive) break

      const enemyDmg = enemy.attack(hero)
      console.log(`Enemy hits you for ${enemyDmg} damage (your hp: ${hero.hp})`)
    }

    if (!hero.alive) break

    console.log("Enemy defeated! Moving to next level.")
    level++
  }

  console.log(hero.alive ? "You cleared all levels!" : "You were defeated.")
  rl.close()
}

if (require.main === module) {
  play()
}

export { Character, play }
