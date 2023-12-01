// https://adventofcode.com/2023/day/1

export function partOne(input: string): number {
  // split input into lines, then split every line into characters, then remove every character that isn't a number
  const numbers = input.split('\n').map(entry => entry.split('').filter(Number))

  // take the first and last numbers of each line and turn them into a 2 digit number
  const calibrationValues = numbers.map(line => Number(`${line.at(0)}${line.at(-1)}`))

  return _.sum(calibrationValues)
}

const stringNums = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
export function partTwo(input: string): number {
  // turn string nums into their numerical equivalents, surrounding numerical equivalent with self, as to not fuck up combos like "fiveightwo"
  stringNums.forEach((num, i) => input = input.replaceAll(num, `${num.at(0)}${(i + 1)}${num.at(-1)}`))

  return partOne(input)
}
