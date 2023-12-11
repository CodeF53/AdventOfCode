// https://adventofcode.com/2023/day/8

type Instruction = 'L' | 'R'
type Links = Record<Instruction, string>
type Guide = Record<string, Links>

function parseInput(input: string): { instructions: Instruction[], guide: Guide } {
  const aa = input.split('\n\n')
  const instructions = aa[0].split('') as Instruction[]
  const guide: Guide = {}
  aa[1].split('\n').forEach((linkStr) => {
    const [location, connectStr] = linkStr.split(' = ')
    const [left, right] = connectStr.split(', ')
    guide[location] = { L: left.slice(1), R: right.slice(0, -1) }
  })

  return { instructions, guide }
}

function getSteps(startLocation: string, endCondition: (location: string) => boolean, instructions: Instruction[], guide: Guide) {
  let currentLocation = startLocation
  let steps = 0
  while (!endCondition(currentLocation)) {
    const direction = instructions[steps % instructions.length]
    const newLocation = guide[currentLocation][direction]
    currentLocation = newLocation
    steps++
  }
  return steps
}

export function partOne(input: string): number {
  const { instructions, guide } = parseInput(input)

  return getSteps('AAA', location => location === 'ZZZ', instructions, guide)
}

export function partTwo(input: string): number {
  const { instructions, guide } = parseInput(input)
  const startLocations = _.keys(guide).filter(location => location.endsWith('A'))
  const stepsPerLocation = startLocations.map(startLocation => getSteps(startLocation, location => location.endsWith('Z'), instructions, guide))

  return lcm(stepsPerLocation)
}

// https://www.geeksforgeeks.org/lcm-of-given-array-elements/ simplified to use reduce
function lcm(arr: number[]): number {
  return arr.reduce((acc, n) => (acc * n) / gcd(acc, n))
}
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}
