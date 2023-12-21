// https://adventofcode.com/2023/day/21
import type { Pos } from '../utils'
import { directions, offsetPos } from '../utils'

function toS(pos: Pos): string {
  return `${pos.x}:${pos.y}`
}

function explore(startPos: Pos, grid: boolean[][], stepCount: number): number {
  const width = grid[0].length
  const height = grid.length

  const countOdd = stepCount % 2 === 0

  let positions: Record<string, Pos> = { [toS(startPos)]: startPos }
  const dumbPositions = new Set<string>()
  _.times(stepCount, (i) => {
    const newPositions: Record<string, Pos> = {}

    for (const pos of Object.values(positions)) {
      for (const direction of directions) {
        const oPos = offsetPos(pos, direction)
        const key = toS(oPos)
        if (dumbPositions.has(key)) continue
        // const modOffsetPos = moduloPos(oPos, width, height)
        // if (!grid[modOffsetPos.y][modOffsetPos.x])
        //   continue // don't explore where there is a rock in the way
        if (oPos.x < 0 || oPos.y < 0 || oPos.x >= width || oPos.y >= height)
          continue // don't explore past edges
        if (!grid[oPos.y][oPos.x])
          continue // don't explore where there is a rock in the way
        newPositions[key] = oPos
        if (countOdd) {
          if (i % 2 === 1) dumbPositions.add(key)
        }
        else if (i % 2 === 0) {
          dumbPositions.add(key)
        }
      }
    }
    positions = newPositions
  })
  return dumbPositions.size
}

function parseInput(input: string): { grid: boolean[][], startPos: Pos } {
  const grid: boolean[][] = input.split('\n').map(line => line.split('').map(tile => tile !== '#'))
  const startPos: Pos = _.reject(input.split('\n').map((line, y) => line.includes('S') ? { x: line.indexOf('S'), y } : undefined), _.isUndefined)[0]!
  return { grid, startPos }
}

export async function partOne(input: string, isTest: boolean): Promise<number> {
  const { grid, startPos } = parseInput(input)

  return explore(startPos, grid, isTest ? 6 : 64)
}

export function partTwo(input: string, isTest: boolean): number {
  const { grid, startPos } = parseInput(input)

  const testSteps = isTest ? 5000 : 26501365
  const width = grid.length
  const superWidth = Math.floor(testSteps / width) - 1

  const oddGardens = (Math.floor(superWidth / 2) * 2 + 1) ** 2
  const evenGardens = (Math.floor((superWidth + 1) / 2) * 2) ** 2
  const oddCount = explore(startPos, grid, width * 2 + 1) * oddGardens
  const evenCount = explore(startPos, grid, width * 2) * evenGardens

  // cardinal edge gardens
  const cardinalEdgeCount
    = explore({ x: startPos.x, y: width - 1 }, grid, width - 1) // N
    + explore({ x: startPos.x, y: 0 }, grid, width - 1) // S
    + explore({ x: 0, y: startPos.y }, grid, width - 1) // E
    + explore({ x: width - 1, y: startPos.y }, grid, width - 1) // W
  // non-cardinal edge gardens
  const smallEdgeSteps = Math.floor(width / 2) - 1
  const smallEdgeCount = (superWidth + 1) * (
    explore({ x: 0, y: width - 1 }, grid, smallEdgeSteps) // northEast
    + explore({ x: width - 1, y: width - 1 }, grid, smallEdgeSteps) // northWest
    + explore({ x: 0, y: 0 }, grid, smallEdgeSteps) // southEast
    + explore({ x: width - 1, y: 0 }, grid, smallEdgeSteps) // southWest
  )

  const largeEdgeSteps = Math.floor((width * 3) / 2) - 1
  const largeEdgeCount = superWidth * (
    explore({ x: 0, y: width - 1 }, grid, largeEdgeSteps) // northEast
    + explore({ x: width - 1, y: width - 1 }, grid, largeEdgeSteps) // northWest
    + explore({ x: 0, y: 0 }, grid, largeEdgeSteps) // southEast
    + explore({ x: width - 1, y: 0 }, grid, largeEdgeSteps) // southWest
  )

  return oddCount + evenCount + cardinalEdgeCount + smallEdgeCount + largeEdgeCount
}
