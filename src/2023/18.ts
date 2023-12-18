// https://adventofcode.com/2023/day/18

interface Pos {
  x: number
  y: number
}
const directions = ['U', 'D', 'R', 'L'] as const
type Direction = typeof directions[number]
function offsetPos(origin: Pos, dir: Direction): Pos {
  switch (dir) {
    case 'U': return { x: origin.x, y: origin.y - 1 }
    case 'D': return { x: origin.x, y: origin.y + 1 }
    case 'R': return { x: origin.x + 1, y: origin.y }
    case 'L': return { x: origin.x - 1, y: origin.y }
  }
}

function createPath(input: string): { pos: Pos, dir: Direction }[] {
  const instructions = input.split('\n').map(line => line.split(' '))
  let currentPos = { x: 0, y: 0 }
  const path: { pos: Pos, dir: Direction }[] = []
  for (const instruction of instructions) {
    const [direction, count, hexCode] = instruction
    _.times(Number(count), () => {
      currentPos = offsetPos(currentPos, direction as Direction)
      path.push({ pos: currentPos, dir: direction as Direction })
    })
  }

  return path
}

function debugLogGrid(grid: boolean[][]) {
  console.log(
    grid.map(line => line.map(cell => cell ? '#' : '.')
      .join(''))
      .join('\n'),
  )
}

function fill(path: { pos: Pos, dir: Direction }[]): boolean[][] {
  // get bounding box of path
  const minX = _.minBy(path, path => path.pos.x)!.pos.x
  const minY = _.minBy(path, path => path.pos.y)!.pos.y
  const maxX = _.maxBy(path, path => path.pos.x)!.pos.x
  const maxY = _.maxBy(path, path => path.pos.y)!.pos.y
  // create 2d grid
  const width = maxX - minX + 1
  const height = maxY - minY + 1
  const grid: boolean[][] = Array.from({ length: height }, () => Array(width).fill(false) as boolean[])
  const upGrid: boolean[][] = Array.from({ length: height }, () => Array(width).fill(false) as boolean[])
  const dnGrid: boolean[][] = Array.from({ length: height }, () => Array(width).fill(false) as boolean[])
  // mark path as filled on the grid
  for (const { pos, dir } of path) {
    grid[pos.y - minY][pos.x - minX] = true
    // mark ups and downs on grid for fill operation
    if (dir === 'U') {
      upGrid[pos.y - minY][pos.x - minX] = true
      upGrid[pos.y + 1 - minY][pos.x - minX] = true
    }
    if (dir === 'D') {
      dnGrid[pos.y - minY][pos.x - minX] = true
      dnGrid[pos.y - 1 - minY][pos.x - minX] = true
    }
  }
  // debugLogGrid(grid.slice(0, 10))

  // fill grid
  for (let y = 0; y < height; y++) {
    let enclosed = false
    let lastOp
    for (let x = 0; x < width; x++) {
      if (upGrid[y][x] && lastOp !== 'up') {
        enclosed = !enclosed
        lastOp = 'up'
      }
      if (dnGrid[y][x] && lastOp !== 'down') {
        enclosed = !enclosed
        lastOp = 'down'
      }
      if (enclosed)
        grid[y][x] = true
    }
  }
  // debugLogGrid(grid.slice(0, 10))
  return grid
}

export function partOne(input: string): number {
  const path = createPath(input)
  const filled = fill(path)
  return _.sumBy(filled, _.sum)
}

function parseHexInstruction(hexCode: string): { direction: Direction, count: number } {
  console.log(hexCode)
}

function createPathP2(input: string): { pos: Pos, dir: Direction }[] {
  const instructions = input.split('\n').map(line => line.split(' '))
  const currentPos = { x: 0, y: 0 }
  const path: { pos: Pos, dir: Direction }[] = []
  for (const instruction of instructions) {
    const hexCode = instruction[2].slice(2, -1)
    const { direction, count } = parseHexInstruction(hexCode)
    // _.times(Number(count), () => {
    //   currentPos = offsetPos(currentPos, direction as Direction)
    //   path.push({ pos: currentPos, dir: direction as Direction })
    // })
  }

  return path
}

export function partTwo(input: string): number {
  const path = createPathP2(input)
  const filled = fill(path)
  return _.sumBy(filled, _.sum)
}
