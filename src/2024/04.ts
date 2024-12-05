// https://adventofcode.com/2024/day/4

import type { Diagonal, DirDiag, Pos } from '../utils'
import { getInverseDir, offsetPos } from '../utils'

const cutDirDiags: DirDiag[] = ['n', 'w', 'ul', 'ur']

function posOOB(pos: Pos, grid: string[]): boolean {
  if (pos.x < 0 || pos.y < 0 || pos.x >= grid[0].length || pos.y >= grid.length)
    return true
  return false
}

function countXMAS(aPos: Pos, grid: string[]): number {
  let count = 0
  for (const dir of cutDirDiags) {
    const invDir = getInverseDir(dir)
    const posA = offsetPos(aPos, dir)
    const posB = offsetPos(aPos, invDir)
    if (posOOB(posA, grid) || posOOB(posB, grid)) continue
    const valA = grid[posA.y][posA.x]
    const valB = grid[posB.y][posB.x]
    if (valA === 'S') {
      if (valB !== 'M') continue
      const offsetX = offsetPos(posB, invDir)
      if (posOOB(offsetX, grid)) continue
      if (grid[offsetX.y][offsetX.x] === 'X') {
        count++
        continue
      }
    }
    else if (valA === 'M') {
      if (valB !== 'S') continue
      const offsetX = offsetPos(posA, dir)
      if (posOOB(offsetX, grid)) continue
      if (grid[offsetX.y][offsetX.x] === 'X') {
        count++
        continue
      }
    }
  }

  return count
}

export function partOne(input: string): number {
  const grid = input.split('\n')
  let count = 0
  for (let y = 0; y < grid.length; y++) {
    let x = grid[y].indexOf('A')
    while (x !== -1) {
      count += countXMAS({ x, y }, grid)
      grid[y] = grid[y].replace('A', '.')
      x = grid[y].indexOf('A')
    }
  }
  return count
}

function validMAS(aPos: Pos, grid: string[]): boolean {
  for (const [dirA, dirB] of ([['ul', 'lr'], ['ur', 'll']] as Diagonal[][])) {
    const posA = offsetPos(aPos, dirA)
    const posB = offsetPos(aPos, dirB)
    if (posOOB(posA, grid) || posOOB(posB, grid)) return false
    const valA = grid[posA.y][posA.x]
    const valB = grid[posB.y][posB.x]
    if (!['M', 'S'].includes(valA)) return false
    if (valB !== (valA === 'M' ? 'S' : 'M')) return false
  }

  return true
}

export function partTwo(input: string): number {
  const grid = input.split('\n')
  let count = 0
  for (let y = 0; y < grid.length; y++) {
    let x = grid[y].indexOf('A')
    while (x !== -1) {
      if (validMAS({ x, y }, grid)) count++
      grid[y] = grid[y].replace('A', '.')
      x = grid[y].indexOf('A')
    }
  }
  return count
}
