// https://adventofcode.com/2020/day/11

import type { Pos } from '../utils'
import { dirDiags, offsetPos, posOOB } from '../utils'

type Grid = string[][]

function stringifyGrid(grid: Grid): string {
  return grid.map(line => line.join('')).join('\n')
}

function countNearbyOccupiedSeatsPartOne(grid: Grid, pos: Pos): number {
  let occupiedSeatCount = 0
  for (const dir of dirDiags) {
    const seatToCheck = offsetPos(pos, dir)
    if (posOOB(seatToCheck, grid)) continue
    if (grid[seatToCheck.y][seatToCheck.x] === '#')
      occupiedSeatCount++
  }
  return occupiedSeatCount
}

function countNearbyOccupiedSeatsPartTwo(grid: Grid, pos: Pos): number {
  let occupiedSeatCount = 0
  for (const dir of dirDiags) {
    let seatCheckOffset = 0
    while (true) {
      seatCheckOffset++
      const seatToCheck = offsetPos(pos, dir, seatCheckOffset)

      if (posOOB(seatToCheck, grid)) break

      const seatValue = grid[seatToCheck.y][seatToCheck.x]
      if (seatValue === '#') {
        occupiedSeatCount++
        break
      }
      if (seatValue === 'L') break
    }
  }
  return occupiedSeatCount
}

function advanceGrid(grid: Grid, seatCounter: typeof countNearbyOccupiedSeatsPartOne, tolerance: number): Grid {
  const outputGrid = structuredClone(grid)

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === '.') continue
      const occupiedSeatCount = seatCounter(grid, { x, y })
      if (occupiedSeatCount >= tolerance)
        outputGrid[y][x] = 'L'
      if (occupiedSeatCount === 0)
        outputGrid[y][x] = '#'
    }
  }

  return outputGrid
}

export function partOne(input: string): number {
  let grid = input.split('\n').map(line => line.split(''))

  let newGrid = advanceGrid(grid, countNearbyOccupiedSeatsPartOne, 4)
  while (stringifyGrid(grid) !== stringifyGrid(newGrid)) {
    grid = newGrid
    newGrid = advanceGrid(grid, countNearbyOccupiedSeatsPartOne, 4)
  }
  grid = newGrid

  return stringifyGrid(grid).replaceAll(/[\n.L]/g, '').length
}

export function partTwo(input: string): number {
  let grid = input.split('\n').map(line => line.split(''))

  let newGrid = advanceGrid(grid, countNearbyOccupiedSeatsPartTwo, 5)
  while (stringifyGrid(grid) !== stringifyGrid(newGrid)) {
    // console.log(`\n${stringifyGrid(grid)}`)
    grid = newGrid
    newGrid = advanceGrid(grid, countNearbyOccupiedSeatsPartTwo, 5)
  }
  grid = newGrid

  return stringifyGrid(grid).replaceAll(/[\n.L]/g, '').length
}
