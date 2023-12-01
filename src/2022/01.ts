// https://adventofcode.com/2022/day/1

// returns how much calories you would get by eating the fattest elf
export function partOne(input: string): number {
  const elfCalories = inputToElfCalories(input)
  const fattestElf = _.max(elfCalories)!

  return fattestElf
}

// returns how much calories you would get by eating the fattest 3 elves
export function partTwo(input: string): number {
  const elfCalories = inputToElfCalories(input)

  const elvesLeanestToFattest = elfCalories.sort()
  const fattest3Elves = elvesLeanestToFattest.slice(-3)
  return _.sum(fattest3Elves)
}

// sums caloric value of each elves organs, returning an array of every elf and how many calories eating them would give
function inputToElfCalories(input: string): number[] {
  return input.split('\n\n').map(items => _.sum(items.split('\n').map(Number)))
}
