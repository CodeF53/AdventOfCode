// https://adventofcode.com/2023/day/10
let tileGrid: string[][]

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

function getConnection(posA: Pos, tileA: Tile, direction: Direction, backTrackDir?: Direction): { newPos: Pos, newBTD: Direction } | undefined {
  // prevent backtracking
  if (backTrackDir && direction === backTrackDir) return
  // check next tile in direction is a pipe
  const posB = offsetPos(posA, direction)
  const tileB = getTile(posB)
  if (!tileB) return
  // and is connected to current pipe
  const inverseDirection = getInverseDir(direction)
  if (!tileA[direction] || !tileB[inverseDirection]) return

  return { newPos: posB, newBTD: inverseDirection }
}

function explorePipe(endPos: Pos, startPos: Pos, startBackTrackDir: Direction): Set<Pos> | undefined {
  let currentPos = startPos
  let backTrackDir = startBackTrackDir
  const visitedPositions = new Set<Pos>()

  while (currentPos.x !== endPos.x || currentPos.y !== endPos.y) {
    const currentTile: Tile = getTile(currentPos)!
    if (!currentTile) return
    let foundValidDirection = false

    for (const direction of directions) {
      const connectionInfo = getConnection(currentPos, currentTile, direction, backTrackDir)
      if (!connectionInfo) continue
      currentPos = connectionInfo.newPos
      backTrackDir = connectionInfo.newBTD
      foundValidDirection = true
      visitedPositions.add(currentPos)
      break
    }
    if (!foundValidDirection) return
  }
  visitedPositions.add(endPos)
  return visitedPositions
}

function getPipePositions(startPos: Pos): Set<Pos> {
  for (const direction of directions) {
    const positions = explorePipe(startPos, offsetPos(startPos, direction), getInverseDir(direction))
    if (positions) return positions
  }
  return new Set<Pos>()
}

function procInput(input: string) {
  tileGrid = input.split('\n').map(line => line.split(''))
  return tileGrid.map((line, i) => ({ x: line.indexOf('S'), y: i })).filter(({ x }) => x !== -1).at(0)!
}

export function partOne(input: string): number {
  const sPos = procInput(input)

  return (getPipePositions(sPos).size) / 2
}

export function partTwo(input: string): number {
  const sPos = procInput(input)

  return -1
}
