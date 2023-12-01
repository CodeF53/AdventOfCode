// https://adventofcode.com/2023/day/1

export function partOne(input: string): number {
  // split input into lines, then split every line into characters, then remove every character that isn't a number
  const numbers = input.split('\n').map(entry => entry.split('').filter(Number))
  // take the first and last numbers of each line and turn them into a 2 digit number
  const fuck = numbers.map(line => Number(`${line.at(0)}${line.at(-1)}`))
  // add those fucks up
  return _.sum(fuck)
}

const stringNums = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
export function partTwo(input: string): number {
  // turn string nums into their numerical equivalents, surrounding numerical equivalent with self, as to not fuck up combos like "eightwo"
  stringNums.forEach((num, i) => input = input.replaceAll(num, `${num}${(i + 1)}${num}`))

  return partOne(input)
}
