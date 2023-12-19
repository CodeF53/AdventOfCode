// https://adventofcode.com/2023/day/18
import { getArea } from '../utils'

const directions = ['U', 'D', 'R', 'L'] as const
type Direction = typeof directions[number]
function offsetPos(origin: Pos, dir: Direction, amount: number): Pos {
  switch (dir) {
    case 'U': return { x: origin.x, y: origin.y - amount }
    case 'D': return { x: origin.x, y: origin.y + amount }
    case 'R': return { x: origin.x + amount, y: origin.y }
    case 'L': return { x: origin.x - amount, y: origin.y }
  }
}

function parseInstruction(instruction: string[]): { direction: Direction, count: number } {
  const direction = instruction[0] as Direction
  const count = Number(instruction[1])
  return { direction, count }
}

function parseHexInstruction(hexCode: string): { direction: Direction, count: number } {
  let direction: Direction
  switch (hexCode.at(-1)) {
    case '0':
      direction = 'R'
      break
    case '1':
      direction = 'D'
      break
    case '2':
      direction = 'L'
      break
    case '3':
      direction = 'U'
      break
    default: throw new Error(`Unexpected Direction code ${hexCode.at(-1)}`)
  }
  return { direction, count: Number.parseInt(hexCode.slice(0, -1), 16) }
}

function createPath(input: string, hexInstructions: boolean = false): Pos[] {
  const instructions = input.split('\n').map(line => line.split(' '))
  let currentPos = { x: 0, y: 0 }
  const path: Pos[] = []
  for (const instruction of instructions) {
    // parse instruction
    const { direction, count } = hexInstructions
      ? parseHexInstruction(instruction[2].slice(2, -1))
      : parseInstruction(instruction)
    // go to next point
    currentPos = offsetPos(currentPos, direction, count)
    path.push(currentPos)
  }

  return path
}

export function partOne(input: string, hexInstructions: boolean = false): number {
  const path = createPath(input, hexInstructions)
  return getArea(path, 1)
}

export function partTwo(input: string): number {
  return partOne(input, true)
}
