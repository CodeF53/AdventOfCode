// https://adventofcode.com/2023/day/10
let tileGrid: string[][]
let distGrid: number[][]

const directions = ['n', 's', 'e', 'w'] as const
type Direction = typeof directions[number]
type Tile = Partial<Record<Direction, boolean>>
const tiles: Record<string, Tile> = {
  '|': { n: true, s: true },
  '-': { e: true, w: true },
  'L': { n: true, e: true },
  'J': { n: true, w: true },
  '7': { s: true, w: true },
  'F': { s: true, e: true },
  'S': { n: true, s: true, e: true, w: true },
}
interface Pos {
  x: number
  y: number
}

function getInverseDir(dir: Direction): Direction {
  switch (dir) {
    case 'n': return 's'
    case 's': return 'n'
    case 'e': return 'w'
    case 'w': return 'e'
  }
}
function offsetPos(origin: Pos, dir: Direction): Pos {
  switch (dir) {
    case 'n': return { x: origin.x, y: origin.y - 1 }
    case 's': return { x: origin.x, y: origin.y + 1 }
    case 'e': return { x: origin.x + 1, y: origin.y }
    case 'w': return { x: origin.x - 1, y: origin.y }
  }
}

function getTile(pos: Pos): Tile | undefined {
  if (pos.x < 0 || pos.y < 0 || pos.x > tileGrid[0].length || pos.y >= tileGrid.length)
    return
  return tiles[tileGrid[pos.y][pos.x]]
}

function exploreConnections(pos: Pos) {
  const toExplore = [pos]

  while (toExplore.length > 0) {
    const currentPos = toExplore.shift()!
    const connectionDistance = distGrid[currentPos.y][currentPos.x] + 1
    const currentTile = getTile(currentPos)

    if (!currentTile) continue

    directions.forEach((direction) => {
      const posB = offsetPos(currentPos, direction)
      const tileB = getTile(posB)

      if (!tileB) return

      const inverseDirection = getInverseDir(direction)

      if (!currentTile[direction] || !tileB[inverseDirection]) return

      const oldDist = distGrid[posB.y][posB.x]

      if (oldDist !== -1 && connectionDistance >= oldDist) return

      distGrid[posB.y][posB.x] = connectionDistance
      toExplore.push(posB)
    })
  }
}

function previewGrid(grid: (number | string)[][], commas = false, size = 3) {
  console.log(grid.map(line => line.map(
    num => num.toString().replace('-1', '').padStart(size, ' '),
  ).join(commas ? ',' : '')).join('\n'))
}

export function partOne(input: string): number {
  tileGrid = input.split('\n').map(line => line.split(''))
  distGrid = Array.from({ length: tileGrid[0].length }, () => Array(tileGrid.length).fill(-1) as number[])

  // get position of animal
  const sPos = tileGrid.map((line, i) => ({ x: line.indexOf('S'), y: i })).filter(({ x }) => x !== -1).at(0)!
  distGrid[sPos.y][sPos.x] = 0
  console.log(sPos)
  // explore grid
  exploreConnections(sPos)

  previewGrid(tileGrid, false, 2)
  previewGrid(distGrid, true, 1)

  return _.max(distGrid.map(_.max))!
}

export function partTwo(input: string): number {
  return -1
}
