// https://adventofcode.com/2020/day/14

function setBit(num: bigint, bit: bigint, value: string): bigint {
  if (value === '1')
    return num | (1n << bit)
  if (value === '0')
    return num & ~(1n << bit)
  return num
}

function applyMask(num: bigint, mask: string[]): bigint {
  mask.forEach((v, i) => num = setBit(num, BigInt(i), v))
  return num
}

export function partOne(input: string): number {
  const lines = input.split('\n')
  let mask: string[] = []
  const mem: bigint[] = []
  for (const line of lines) {
    const [target, value] = line.split(' = ')
    if (target === 'mask') {
      mask = value.split('').toReversed()
      continue
    }
    const memIndex = Number.parseInt(/^mem\[(\d+)\]$/.exec(target)![1])
    mem[memIndex] = applyMask(BigInt(value), mask)
  }
  return _.sum(mem)
}

export function partTwo(input: string): number {
  return -1
}
