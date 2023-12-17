// https://adventofcode.com/2023/day/16
import { availableParallelism } from 'node:os'
import { concurrent } from '@bitair/concurrent.js'
import _ from 'lodash'

concurrent.config({ maxThreads: availableParallelism() })
const concurrentThis = concurrent.import(import.meta.url)

interface Pos {
  x: number
  y: number
}
const directions = ['n', 's', 'e', 'w'] as const
type Direction = typeof directions[number]
let mirrorGrid: string[][]
const gridTravels = {} as Record<Direction, boolean[][]>

function initGrids(input: string) {
  mirrorGrid = input.split('\n').map(line => line.split(''))
  const height = mirrorGrid.length
  const width = mirrorGrid[0].length
  for (const direction of directions)
    gridTravels[direction] = Array.from({ length: height }, () => Array.from({ length: width }))
}

function offsetPos(origin: Pos, dir: Direction): Pos {
  switch (dir) {
    case 'n': return { x: origin.x, y: origin.y - 1 }
    case 's': return { x: origin.x, y: origin.y + 1 }
    case 'e': return { x: origin.x + 1, y: origin.y }
    case 'w': return { x: origin.x - 1, y: origin.y }
  }
}

function reflect(pos: Pos, dir: Direction): Direction[] {
  // if we have already been here traveling in this direction, stop
  if (gridTravels[dir][pos.y][pos.x])
    return []
  const tile = mirrorGrid[pos.y][pos.x]

  switch (tile) {
    case '/':
      switch (dir) {
        case 'n': return ['e']
        case 's': return ['w']
        case 'e': return ['n']
        case 'w': return ['s']
      }
      break
    case '\\':
      switch (dir) {
        case 'n': return ['w']
        case 's': return ['e']
        case 'e': return ['s']
        case 'w': return ['n']
      }
      break
    case '|':
      switch (dir) {
        case 'e': case 'w':
          return ['n', 's']
      }
      break
    case '-':
      switch (dir) {
        case 'n': case 's':
          return ['e', 'w']
      }
      break
  }
  return [dir]
}

function trace(pos: Pos, dir: Direction) {
  // if invalid pos, stop
  if (pos.x < 0 || pos.y < 0 || pos.y >= mirrorGrid.length || pos.x >= mirrorGrid[0].length)
    return []
  // get how to reflect self
  const reflectDirs = reflect(pos, dir)
  // mark current tile as traveled for current direction, so we don't try this more than once
  gridTravels[dir][pos.y][pos.x] = true
  // trace places we reflect to
  reflectDirs.forEach(reflectDir => trace(offsetPos(pos, reflectDir), reflectDir))
}

function countVisited(): number {
  const height = mirrorGrid.length
  const width = mirrorGrid[0].length
  const visitedArrays = Object.values(gridTravels)
  function isVisited(x: number, y: number) {
    return visitedArrays.some(grid => grid[x][y])
  }
  const visitedTiles = Array.from({ length: height }, (_e, y) => Array.from({ length: width }, (_e, x) => isVisited(x, y)))
  return _.sumBy(visitedTiles, _.sum)
}

export function partOne(input: string, startPos: Pos = { x: 0, y: 0 }, startDir: Direction = 'e'): number {
  initGrids(input)
  trace(startPos, startDir)
  return countVisited()
}

// creates a new thread and calls partOne in it, returns Promise of it's return
async function partOneAsync(input: string, startPos: Pos, startDir: Direction): Promise<number> {
  return ((await concurrentThis.load()).partOne as typeof partOne)(input, startPos, startDir)
}

export async function partTwo(input: string): Promise<number> {
  const height = input.split('\n').length
  const width = input.split('\n')[0].length
  const out = _.max(await Promise.all([
    ..._.times(width, x => partOneAsync(input, { x, y: 0 }, 's')),
    ..._.times(width, x => partOneAsync(input, { x, y: height - 1 }, 'n')),
    ..._.times(height, y => partOneAsync(input, { x: 0, y }, 'e')),
    ..._.times(height, y => partOneAsync(input, { x: width - 1, y }, 'w')),
  ]))!

  return out
}
