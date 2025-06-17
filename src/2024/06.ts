// https://adventofcode.com/2024/day/6

import { type Direction, type Pos, asThreaded, offsetPos, posOOB } from '../utils'

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

function marchGuard(grid: boolean[][], guardPos: Pos, testObstruction?: Pos): { positions: Set<string>, loop: boolean } {
  const distinctPos = new Set<string>()
  const seenPosFacing = new Set<string>()
  let facing: Direction = 'n'
  while (!seenPosFacing.has(`${facing}${guardPos.x},${guardPos.y}`)) {
    distinctPos.add(`${guardPos.x},${guardPos.y}`)
    seenPosFacing.add(`${facing}${guardPos.x},${guardPos.y}`)
    let stepPos = offsetPos(guardPos, facing)
    if (posOOB(stepPos, grid))
      return { positions: distinctPos, loop: false }

    while (grid[stepPos.y][stepPos.x] || (stepPos.y === testObstruction?.y && stepPos.x === testObstruction?.x)) {
      facing = rotateDir90Clockwise(facing)
      stepPos = offsetPos(guardPos, facing)
    }
    guardPos = stepPos
  }

  return { positions: distinctPos, loop: true }
}

export function partOne(input: string): number {
  const grid = input.split('\n').map(line => line.split(''))
  const obstructionGrid: boolean[][] = grid.map(line => line.map(a => a === '#'))
  const guardPos: Pos = findGuardPos(grid)
  return marchGuard(obstructionGrid, guardPos).positions.size
}

export function obstructionTest(position: string, guardPos: Pos, grid: boolean[][]): boolean {
  const [x, y] = position.split(',').map(Number)
  if (guardPos.x === x && guardPos.y === y) return false
  if (marchGuard(grid, guardPos, { x, y }).loop)
    return true
  return false
}

export async function partTwo(input: string): Promise<number> {
  const grid = input.split('\n').map(line => line.split(''))
  const obstructionGrid: boolean[][] = grid.map(line => line.map(a => a === '#'))
  const guardPos: Pos = findGuardPos(grid)
  const obstructionTestThreaded = asThreaded(obstructionTest, import.meta.url)

  return _.sum(await Promise.all([...marchGuard(obstructionGrid, guardPos).positions].map(async (position) => {
    return obstructionTestThreaded(position, guardPos, obstructionGrid).then(a => a ? 1 : 0)
  })))
}
