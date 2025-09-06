// https://adventofcode.com/2020/day/10

export function partOne(input: string): number {
  const adapters = input.split('\n').map(Number).toSorted((a, b) => a - b)
  // our laptop is 3 jolts higher in joltage than the highest rated adapter in our bag
  adapters.push(adapters.at(-1)! + 3)

  const joltageDifferences = adapters.map((adapter, i) => {
    const priorAdapter = adapters[i - 1] ?? 0 // if we are at the first adapter in the chain, prior joltage is that of outlet (0)
    return adapter - priorAdapter
  })
  const summedDiffrences = _.countBy(joltageDifferences)
  console.log(summedDiffrences)
  return summedDiffrences['1'] * summedDiffrences['3']
}

export function partTwo(input: string): number {
  // nah
  return -1
}
