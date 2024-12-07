// https://adventofcode.com/2024/day/7

function possibleVals(numbers: number[], partTwo: boolean): number[] {
  if (numbers.length === 1)
    return numbers
  const out = [
    ...possibleVals([numbers[0] * numbers[1], ...numbers.slice(2)], partTwo),
    ...possibleVals([numbers[0] + numbers[1], ...numbers.slice(2)], partTwo),
  ]
  if (partTwo)
    out.push(...possibleVals([Number(`${numbers[0]}${numbers[1]}`), ...numbers.slice(2)], partTwo))

  return out
}

function canEquationBeTrue(numbers: number[], out: number, partTwo: boolean): boolean {
  return possibleVals(numbers, partTwo).includes(out)
}

export function partOne(input: string, partTwo = false): number {
  const lines = input.split('\n')
  let total = 0
  lines.forEach((line) => {
    const [out, ...numbers] = line.split(/:? /).map(Number)
    if (canEquationBeTrue(numbers, out, partTwo)) total += out
  })
  return total
}

export function partTwo(input: string): number {
  return partOne(input, true)
}
