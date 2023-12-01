// https://adventofcode.com/202 /day/

// The heightmap shows the local area from above broken into a grid of lowercase letters
// - where a is the lowest elevation, z is highest
// Also included on the heightmap are marks for
// - current position (S), which has elevation a
// - best signal (E) which has elevation z.

// You'd like to reach E, but to save energy, you should do it in as few steps as possible.
// During each step, you can move exactly one square up, down, left, or right.
// To avoid needing to get out your climbing gear, the elevation of the destination square can be at most one higher than the elevation of your current square;
// the elevation of the destination square can be much lower than the elevation of your current square.

//
export function partOne(input: string): number {
  const heightMap = createHeightMap(input)
  renderMap(heightMap)
  return -1
}

//
export function partTwo(input: string): number {
  return -1
}

function getColor(number: number) {
  if (number === 0) return '161f6f'
  if (number === 1) return '2140a3'
  if (number === 2) return '3669d5'
  if (number === 3) return '2488d5'
  if (number === 4) return '1aa9d0'
  if (number === 5) return '00d8ff'
  if (number === 6) return 'a6704e'
  if (number === 7) return '86b24f'
  if (number === 8) return '785c28'

  return _.round(number * 10.2 - 10).toString(16).padStart(2, '0').repeat(3)
}
function hexToAnsi(color: string): string {
  return `\x1B[48;2;${Number.parseInt(color.slice(0, 2), 16)};${Number.parseInt(color.slice(2, 4), 16)};${Number.parseInt(color.slice(4, 6), 16)}m`
}
const alphabet = 'abcdefghijklmnopqrstuvwxyz'
function getBkg(letter: string) {
  const num = alphabet.indexOf(letter)
  let color = '000000'
  if (num !== -1)
    color = getColor(num)
  else if (letter === 'S')
    color = '00ff00'
  else if (letter === 'E')
    color = 'ff0000'
  return hexToAnsi(color)
}
const resetAnsi = '\x1B[0m'
const redTextAnsi = '\x1B[31m'

function renderMap(heightMap: string[][]) {
  heightMap.forEach((row) => {
    const rowString = row.map((cell) => {
      return `${getBkg(cell)} `
    }).join('')
    console.log(`${redTextAnsi}${rowString}${resetAnsi}`)
  })
}

function createHeightMap(input: string): string[][] {
  return input.split('\n').map(row => row.split(''))
}
