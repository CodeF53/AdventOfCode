// https://adventofcode.com/2023/day/11
type Grid = string[][]
interface Coords { x: number, y: number }

interface Expansions {
  horzExpansions: number[]
  vertExpansions: number[]
}

function getGalaxies(grid: Grid): Coords[] {
  return grid.flatMap((line, y) => line.map((pixel, x) => pixel === '#' ? { x, y } : undefined))
    .filter(pixel => pixel !== undefined) as Coords[]
}

function getVertExpansions(grid: Grid): number[] {
  const expansionPoints: number[] = []
  grid.forEach((line, i) => {
    if (line.every(pixel => pixel === '.'))
      expansionPoints.push(i)
  })
  return expansionPoints
}

function getHorzExpansions(grid: Grid): number[] {
  // pivot grid 90 degrees then check using vertical code
  return getVertExpansions(_.zip(...grid) as Grid)
}

function getExpansions(grid: Grid): Expansions {
  return { horzExpansions: getHorzExpansions(grid), vertExpansions: getVertExpansions(grid) }
}

function between(a: number, b: number, x: number) {
  return Math.min(a, b) < x && x < Math.max(a, b)
}
function distance(galaxyA: Coords, galaxyB: Coords, expansions: Expansions, expansionDistance: number) {
  const getEncounteredExpansions = (axis: ('x' | 'y'), expansions: number[]) => {
    return expansions.filter(coord => between(galaxyA[axis], galaxyB[axis], coord)).length
  }
  const encounteredExpansions = getEncounteredExpansions('x', expansions.horzExpansions)
    + getEncounteredExpansions('y', expansions.vertExpansions)

  return Math.abs(galaxyA.x - galaxyB.x) + Math.abs(galaxyA.y - galaxyB.y) + (encounteredExpansions * (expansionDistance))
}

export function partOne(input: string, expansionDistance = 1): number {
  const grid = input.split('\n').map(line => line.split(''))
  const expansions = getExpansions(grid)
  const galaxies = getGalaxies(grid)

  const distances: number[] = []
  galaxies.forEach((galaxy, r) => {
    galaxies.forEach((galaxyB, c) => {
      if (r < c) distances.push(distance(galaxy, galaxyB, expansions, expansionDistance))
    })
  })

  return _.sum(distances)
}

export function partTwo(input: string): number {
  return partOne(input, 1000000 - 1)
}
