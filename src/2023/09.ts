// https://adventofcode.com/2023/day/9

function allZeros(nums: number[]): boolean {
  return _.every(nums, num => num === 0)
}
function diffPerStep(nums: number[]): number[] {
  return nums.map((b, i, arr) => i === 0 ? 0 : (b - arr[i - 1])).slice(1)
}
function getNextVal(nums: number[]): number {
  if (allZeros(nums)) return 0
  return nums.at(-1)! + getNextVal(diffPerStep(nums))
}

export function partOne(input: string): number {
  const histories = input.split('\n').map(line => line.split(' ').map(Number))
  return _.sum(histories.map(history => getNextVal(history)))
}

function getPrevVal(nums: number[]): number {
  if (allZeros(nums)) return 0
  return nums.at(0)! - getPrevVal(diffPerStep(nums))
}

export function partTwo(input: string): number {
  const histories = input.split('\n').map(line => line.split(' ').map(Number))
  return _.sum(histories.map(history => getPrevVal(history)))
}
