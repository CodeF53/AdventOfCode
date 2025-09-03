// https://adventofcode.com/2020/day/6

function parseGroups(input: string) {
  return input.split('\n\n')
    .map(group => group.split('\n').map(person => person.split('')))
}

export function partOne(input: string): number {
  const uniqueAnswers = parseGroups(input).map(group => new Set(group.flat()))
  return _.sumBy(uniqueAnswers, answers => answers.size)
}

export function partTwo(input: string): number {
  const commonAnswers = parseGroups(input).map(group => _.intersection(...group))
  return _.sumBy(commonAnswers, answers => answers.length)
}
