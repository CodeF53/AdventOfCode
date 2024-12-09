// https://adventofcode.com/2024/day/8

import { type Pos, posOOB } from '../utils'

function getAntiodeSets(grid: string[][]): Pos[][] {
  const antennaGroups: Record<string, Pos[]> = {}
  grid.forEach((line, y) => line.forEach((char, x) => {
    if (/\w/.exec(char)) antennaGroups[char] = [...(antennaGroups[char] || []), { y, x }]
  }))
  return Object.values(antennaGroups)
}

function debugOutput(grid: string[][], uniqueAntiNodes: Set<string>) {
  for (const antinode of uniqueAntiNodes) {
    const [x, y] = antinode.split(',').map(Number)
    grid[y][x] = '#'
  }
  console.log(grid.map(line => line.join('')).join('\n'))
}

export function partOne(input: string): number {
  const grid = input.split('\n').map(line => line.split(''))
  const uniqueAntiNodes = new Set<string>()
  for (const antGroup of getAntiodeSets(grid)) {
    antGroup.forEach((antA, iA) => {
      antGroup.forEach((antB, iB) => {
        if (iB >= iA) return
        const offset = { x: antB.x - antA.x, y: antB.y - antA.y }
        const offsetedPosA = { x: antA.x - offset.x, y: antA.y - offset.y }
        const offsetedPosB = { x: antB.x + offset.x, y: antB.y + offset.y }
        if (!posOOB(offsetedPosA, grid))
          uniqueAntiNodes.add(`${offsetedPosA.x},${offsetedPosA.y}`)
        if (!posOOB(offsetedPosB, grid))
          uniqueAntiNodes.add(`${offsetedPosB.x},${offsetedPosB.y}`)
      })
    })
  }
  // debugOutput(grid, uniqueAntiNodes)

  return uniqueAntiNodes.size
}

export function partTwo(input: string): number {
  const grid = input.split('\n').map(line => line.split(''))
  const uniqueAntiNodes = new Set<string>()
  for (const antGroup of getAntiodeSets(grid)) {
    antGroup.forEach((antA, iA) => {
      antGroup.forEach((antB, iB) => {
        if (iB === iA) return

        const offset = { x: antB.x - antA.x, y: antB.y - antA.y }
        let offsetedPosA = { x: antA.x - offset.x, y: antA.y - offset.y }
        let i = 0
        while (!posOOB(offsetedPosA, grid)) {
          uniqueAntiNodes.add(`${offsetedPosA.x},${offsetedPosA.y}`)
          i++
          offsetedPosA = { x: antA.x - offset.x * i, y: antA.y - offset.y * i }
        }
        offsetedPosA = { x: antA.x + offset.x, y: antA.y + offset.y }
        i = 0
        while (!posOOB(offsetedPosA, grid)) {
          uniqueAntiNodes.add(`${offsetedPosA.x},${offsetedPosA.y}`)
          i++
          offsetedPosA = { x: antA.x + offset.x * i, y: antA.y + offset.y * i }
        }
      })
    })
  }
  // debugOutput(grid, uniqueAntiNodes)

  return uniqueAntiNodes.size
}
