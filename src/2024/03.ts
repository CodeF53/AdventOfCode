// https://adventofcode.com/2024/day/3

export function partOne(input: string): number {
  return _.sum([...input.matchAll(/mul\((\d+),(\d+)\)/g)].map(([_match, a, b]) => Number(a) * Number(b)))
}

export function partTwo(input: string): number {
  const operations: string[] = [...input.matchAll(/mul\(\d+,\d+\)|(?:don't|do)\(\)/g)].map(a => a[0])
  let total = 0
  let doStuff = true
  for (const operation of operations) {
    if (operation === 'don\'t()') doStuff = false
    if (operation === 'do()') doStuff = true
    if (!doStuff || !operation.startsWith('mul'))
      continue
    const [,a, b] = /mul\((\d+),(\d+)\)/.exec(operation)!
    total += Number(a) * Number(b)
  }

  return total
}
