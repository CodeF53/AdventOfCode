// https://adventofcode.com/2023/day/10
import { availableParallelism } from 'node:os'
import _ from 'lodash'
import { concurrent } from '@bitair/concurrent.js'

concurrent.config({ maxThreads: availableParallelism() })
const concurrentThis = concurrent.import(import.meta.url)

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
  visitedPositions.add(currentPos)

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
  return visitedPositions
}

function getLoopPositions(startPos: Pos): Set<Pos> {
  const paths = []
  for (const direction of directions) {
    const positions = explorePipe(startPos, offsetPos(startPos, direction), getInverseDir(direction))
    if (positions) paths.push(positions)
  }
  if (paths.length > 0)
    return _.maxBy(paths, _.size)!

  return new Set<Pos>()
}

function procInput(input: string) {
  tileGrid = input.split('\n').map(line => line.split(''))
  return tileGrid.map((line, i) => ({ x: line.indexOf('S'), y: i })).filter(({ x }) => x !== -1).at(0)!
}

export function partOne(input: string): number {
  const sPos = procInput(input)

  return (getLoopPositions(sPos).size) / 2
}

function includes(collection: any, targetObject: any) {
  return _.some(collection, item => _.isEqual(item, targetObject))
}

export function countRowEnclosed(tileGrid_: string[][], y: number, loopPositions: Pos[]): number {
  tileGrid = tileGrid_
  let c = 0
  let up = false
  for (let x = 0; x < tileGrid[y].length; x++) {
    const pos = { x, y }
    const tile = getTile(pos)
    const inLoop = tile && includes(loopPositions, pos)
    if (inLoop && tile.s)
      up = !up
    if (up && !inLoop)
      c++
  }
  return c
}

export async function partTwo(input: string): number {
  const sPos = procInput(input)
  const loopPositions = [...getLoopPositions(sPos)]
  // turn S into whatever pipe it actually is
  const d: Tile = { }
  for (const direction of directions)
    if (includes([loopPositions.at(0), loopPositions.at(-2)], offsetPos(sPos, direction))) d[direction] = true
  tileGrid[sPos.y][sPos.x] = _.findKey(tiles, tile => _.isEqual(d, tile))!

  // count number of enclosed pipes (multithreaded because I can't figure out how to optimise)
  const tasks = []
  for (let y = 0; y < tileGrid.length; y++) {
    const countRowEnclosedParallel = (await concurrentThis.load()).countRowEnclosed as typeof countRowEnclosed
    tasks.push(countRowEnclosedParallel(tileGrid, y, loopPositions))
  }

  return _.sum(await Promise.all(tasks))
}
