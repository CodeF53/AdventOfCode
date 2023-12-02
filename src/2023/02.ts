// https://adventofcode.com/2023/day/2

const colors = ['red', 'green', 'blue'] as const
type Color = typeof colors[number]
type Cubes = Record<Color, number>

function getCubeQuantities(part: string[]): Cubes {
  const out = { red: 0, green: 0, blue: 0 }

  part.forEach((entry) => {
    const [quantity, color] = entry.trim().split(' ')
    out[color as Color] += Number(quantity)
  })

  return out
}

function getMaxCubes(game: Cubes[]): Cubes {
  const out = { red: 0, green: 0, blue: 0 }
  colors.forEach(color => out[color] = _.maxBy(game, color)![color])
  return out
}

function processGames(input: string) {
  return input.split('\n')
    .map(line => line.split(':')[1].split(';').map(a => getCubeQuantities(a.split(','))))
    .map(getMaxCubes)
    .map((cubes, i) => ({ id: i + 1, cubes }))
}

export function partOne(input: string): number {
  // parse games
  const games = processGames(input)

  const maxAllowedCubes: Cubes = { red: 12, green: 13, blue: 14 }

  const goodGameIds = _.reject(games, ({ cubes }) => (
    cubes.red > maxAllowedCubes.red
    || cubes.green > maxAllowedCubes.green
    || cubes.blue > maxAllowedCubes.blue
  )).map(game => game.id)

  return _.sum(goodGameIds)
}

export function partTwo(input: string): number {
  const games = processGames(input)

  return _.sum(games.map(({ cubes }) => Object.values(cubes).reduce((a, b) => a * b, 1)))
}
