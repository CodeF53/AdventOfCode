// https://adventofcode.com/2023/day/14
import { rotate90 } from '../utils'

function tiltNorth(grid: string[][]) {
  for (let r = 1; r < grid.length; r++) {
    const row = grid[r]
    for (let c = 0; c < row.length; c++) {
      const cell = row[c]

      if (cell !== 'O') continue

      let scanRow = r
      while (scanRow > 0 && grid[scanRow - 1][c] === '.')
        scanRow--
      grid[r][c] = '.'
      grid[scanRow][c] = 'O'
    }
  }
  return grid
}
function spinCycle(grid: string[][]) {
  grid = rotate90(tiltNorth(grid)) // n
  grid = rotate90(tiltNorth(grid)) // w
  grid = rotate90(tiltNorth(grid)) // s
  grid = rotate90(tiltNorth(grid)) // e
  return grid
}

function calcLoad(grid: string[][]): number {
  let load = 0

  for (let r = 0; r < grid.length; r++) {
    const row = grid[r]
    for (let c = 0; c < row.length; c++) {
      const cell = row[c]

      if (cell !== 'O') continue

      load += grid.length - r
    }
  }

  return load
}

export function partOne(input: string): number {
  let grid = input.split('\n').map(line => line.split(''))

  // move rocks
  grid = tiltNorth(grid)

  // calc load
  return calcLoad(grid)
}

export function partTwo(input: string): number {
  let grid = input.split('\n').map(line => line.split(''))
  const cycleCount = 1_000_000_000

  // while spinning, look for a cycle
  const seenGrids = new Map<string, number>()
  let cycleStart = 0
  let cycleLength = 0
  for (let i = 1; i <= cycleCount; i++) {
    grid = spinCycle(grid)
    // stop when we see a grid we have before
    const gridStr = JSON.stringify(grid)
    if (seenGrids.has(gridStr)) {
      cycleStart = seenGrids.get(gridStr)!
      cycleLength = i - cycleStart
      break
    }
    seenGrids.set(gridStr, i)
  }

  // Apply the remaining cycles
  const remainingCycles = (cycleCount - cycleStart) % cycleLength
  _.times(remainingCycles, () => grid = spinCycle(grid))

  // calc load
  return calcLoad(grid)
}
