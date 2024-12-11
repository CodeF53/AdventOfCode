// https://adventofcode.com/2024/day/10

import { type Pos, directions, offsetPos, posOOB } from '../utils'

function findPeaksAndTrails(startPos: Pos, grid: number[][]): { peaks: Set<string>, trails: number } {
  let peaks = new Set<string>()
  // pos score = num 9-height positions reachable from it via a valid trail
  const posHeight = grid[startPos.y][startPos.x]
  if (posHeight === 9) {
    peaks.add(JSON.stringify(startPos))
    return { peaks, trails: 1 }
  }

  let trails = 0
  for (const dir of directions) {
    const newPos = offsetPos(startPos, dir)
    if (posOOB(newPos, grid)) continue
    if (grid[newPos.y][newPos.x] === posHeight + 1) {
      const a = findPeaksAndTrails(newPos, grid)
      trails += a.trails
      // eslint-disable-next-line ts/no-unsafe-call
      peaks = peaks.union(a.peaks) as Set<string>
    }
  }
  return { peaks, trails }
}

export function partOne(input: string): number {
  const grid = input.split('\n').map(line => line.split('').map(Number))
  let sum = 0
  grid.forEach((line, y) => line.forEach((val, x) => {
    if (val === 0) sum += findPeaksAndTrails({ x, y }, grid).peaks.size
  }))

  return sum
}

export function partTwo(input: string): number {
  const grid = input.split('\n').map(line => line.split('').map(Number))
  let sum = 0
  grid.forEach((line, y) => line.forEach((val, x) => {
    if (val === 0) sum += findPeaksAndTrails({ x, y }, grid).trails
  }))

  return sum
}
