// https://adventofcode.com/2023/day/21
import type { Pos } from '../utils'
import { directions, offsetPos } from '../utils'

function toS(pos: Pos): string {
  return `${pos.x}:${pos.y}`
}

function modulo(a: number, b: number): number {
  return ((a % b) + b) % b
}

function moduloPos(pos: Pos, width: number, height: number): Pos {
  return { x: modulo(pos.x, width), y: modulo(pos.y, height) }
}

function explore(startPos: Pos, grid: boolean[][], stepCount: number): number {
  const width = grid[0].length
  const height = grid.length

  let positions: Record<string, Pos> = { [toS(startPos)]: startPos }
  const dumbPositions = new Set<string>()
  _.times(stepCount, (i) => {
    const newPositions: Record<string, Pos> = {}

    for (const pos of Object.values(positions)) {
      for (const direction of directions) {
        const oPos = offsetPos(pos, direction)
        const key = toS(oPos)
        if (dumbPositions.has(key)) continue
        const modOffsetPos = moduloPos(oPos, width, height)
        if (!grid[modOffsetPos.y][modOffsetPos.x])
          continue // don't explore where there is a rock in the way
        newPositions[key] = oPos
        if (i % 2 === 1)
          dumbPositions.add(key)
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
  return explore(startPos, grid, isTest ? 5000 : 26501365)
}
