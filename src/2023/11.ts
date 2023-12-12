// https://adventofcode.com/2023/day/11
type Grid = string[][]
interface GalaxyCoords { x: number, y: number }

function expandSpaceVert(grid: Grid): Grid {
  const gridA = _.cloneDeep(grid)
  let clonedLines = 0
  grid.forEach((line, i) => {
    if (line.every(pixel => pixel === '.')) {
      gridA.splice(i + clonedLines, 0, line)
      clonedLines++
    }
  })
  return gridA
}

function expandSpaceHorz(grid: Grid): Grid {
  return _.zip(...expandSpaceVert(_.zip(...grid) as Grid)) as Grid
}

function expandSpace(grid: Grid): Grid {
  return expandSpaceHorz(expandSpaceVert(grid))
}

function distance(galaxyA: GalaxyCoords, galaxyB: GalaxyCoords) {
  return Math.abs(galaxyA.x - galaxyB.x)
    + Math.abs(galaxyA.y - galaxyB.y)
}

function getGalaxies(grid: Grid): GalaxyCoords[] {
  return grid.flatMap((line, y) => line.map((pixel, x) => pixel === '#' ? { x, y } : undefined))
    .filter(pixel => pixel !== undefined) as GalaxyCoords[]
}

export function partOne(input: string): number {
  const grid = expandSpace(input.split('\n').map(line => line.split('')))

  const galaxies = getGalaxies(grid)
  const distances: number[] = []
  galaxies.forEach((galaxy, r) => {
    galaxies.forEach((galaxyB, c) => {
      if (r < c)
        distances.push(distance(galaxy, galaxyB))
    })
  })

  return _.sum(distances)
}

function getVerticalExpansions(grid: Grid): number[] {
  const expansionPoints: number[] = []
  grid.forEach((line, i) => {
    if (line.every(pixel => pixel === '.'))
      expansionPoints.push(i)
  })
  return expansionPoints
}

interface Expansions {
  horizontalExpansions: number[]
  verticalExpansions: number[]
}

function getHorizontalExpansions(grid: Grid): number[] {
  return getVerticalExpansions(_.zip(...grid) as Grid)
}

function getSpaceExpansions(grid: Grid): Expansions {
  return { horizontalExpansions: getHorizontalExpansions(grid), verticalExpansions: getVerticalExpansions(grid) }
}

function between(a: number, b: number, x: number): boolean {
  return Math.min(a, b) < x && x < Math.max(a, b)
}

function distanceP2(galaxyA: GalaxyCoords, galaxyB: GalaxyCoords, expansions: Expansions) {
  const getEncounteredExpansions = (axis: ('x' | 'y'), expansions: number[]) => {
    return expansions.filter(coord => between(galaxyA[axis], galaxyB[axis], coord)).length
  }
  const encounteredExpansions = getEncounteredExpansions('x', expansions.horizontalExpansions)
    + getEncounteredExpansions('y', expansions.verticalExpansions)

  return Math.abs(galaxyA.x - galaxyB.x) + Math.abs(galaxyA.y - galaxyB.y) + (encounteredExpansions * (1000000 - 1))
}

export function partTwo(input: string): number {
  const grid = input.split('\n').map(line => line.split(''))
  const expansions = getSpaceExpansions(grid)

  const galaxies = _.reject(grid.flatMap((line, y) => line.map((pixel, x) => pixel === '#' ? { x, y } : undefined)), _.isUndefined) as GalaxyCoords[]
  const distances: number[] = []
  galaxies.forEach((galaxy, r) => {
    galaxies.forEach((galaxyB, c) => {
      if (r < c)
        distances.push(distanceP2(galaxy, galaxyB, expansions))
    })
  })

  return _.sum(distances)
}
