// https://adventofcode.com/2024/day/6

import { type Direction, type Pos, offsetPos, posOOB } from '../utils'

function findGuardPos(grid: string[][]): Pos {
  const y = grid.findIndex(line => line.includes('^'))
  return { x: grid[y].indexOf('^'), y }
}

function rotateDir90Clockwise(dir: Direction): Direction {
  switch (dir) {
    case 'n': return 'e'
    case 'e': return 's'
    case 's': return 'w'
    case 'w': return 'n'
  }
}

function marchGuard(grid: string[][], guardPos: Pos): { positions: Set<string>, loop: boolean } {
  const distinctPos = new Set<string>()
  const seenPosFacing = new Set<string>()
  let facing: Direction = 'n'
  while (!seenPosFacing.has(`${facing}${guardPos.x},${guardPos.y}`)) {
    distinctPos.add(`${guardPos.x},${guardPos.y}`)
    seenPosFacing.add(`${facing}${guardPos.x},${guardPos.y}`)
    let stepPos = offsetPos(guardPos, facing)
    if (posOOB(stepPos, grid))
      return { positions: distinctPos, loop: false }

    while (grid[stepPos.y][stepPos.x] === '#') {
      facing = rotateDir90Clockwise(facing)
      stepPos = offsetPos(guardPos, facing)
    }
    guardPos = stepPos
  }

  return { positions: distinctPos, loop: true }
}

export function partOne(input: string): number {
  const grid = input.split('\n').map(line => line.split(''))
  const guardPos: Pos = findGuardPos(grid)
  return marchGuard(grid, guardPos).positions.size
}

export function partTwo(input: string): number {
  const grid = input.split('\n').map(line => line.split(''))
  const guardPos: Pos = findGuardPos(grid)
  let count = 0
  marchGuard(grid, guardPos).positions.forEach((position) => {
    const [x, y] = position.split(',').map(Number)
    if (guardPos.x === x && guardPos.y === y) return
    grid[y][x] = '#'
    if (marchGuard(grid, guardPos).loop) count++
    grid[y][x] = '.'
  })

  return count
}
