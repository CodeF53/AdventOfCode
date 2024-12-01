// https://adventofcode.com/2024/day/1

function cutLocations(input: string): [number[], number[]] {
  const aa = input.split('\n').map(line => line.split(/\s+/).map(Number))
  return [aa.flatMap(a => a[0]), aa.flatMap(a => a[1])]
}

export function partOne(input: string): number {
  const [one, two] = cutLocations(input).map(a => a.toSorted())
  let sum = 0
  for (let i = 0; i < one.length; i++)
    sum += Math.abs(one[i] - two[i])

  return sum
}

export function partTwo(input: string): number {
  const [one, two] = cutLocations(input).map(a => a.toSorted())

  const maxes: Record<number, number> = {}
  for (const num of two) {
    if (maxes[num] === undefined)
      maxes[num] = 1
    else maxes[num]++
  }

  let sum = 0
  for (const num of one)
    sum += num * (maxes[num] || 0)

  return sum
}
