// https://adventofcode.com/2020/day/9

function findInvalidElement(xmas: Uint32Array, preambleLength: number) {
  outerLoop: for (let i = preambleLength; i < xmas.length; i++) {
    const window = xmas.slice(i - preambleLength, i)
    const element = xmas[i]

    for (const itemA of window) {
      for (const itemB of window) {
        if (itemA === itemB) continue

        if (itemA + itemB === element)
          continue outerLoop
      }
    }
    // bad path
    return { value: element, index: i }
  }

  return { value: -1, index: -1 }
}

export function partOne(input: string): number {
  const preambleLength = input.split('\n').length > 50 ? 25 : 5
  const xmas = new Uint32Array(input.split('\n').map(Number))
  return findInvalidElement(xmas, preambleLength).value
}

export function partTwo(input: string): number {
  const preambleLength = input.split('\n').length > 50 ? 25 : 5
  const xmas = new Uint32Array(input.split('\n').map(Number))

  const invalidElm = findInvalidElement(xmas, preambleLength)
  const window = xmas.slice(0, invalidElm.index)

  outerLoop: for (let rangeStart = 0; rangeStart < window.length - 2; rangeStart++) {
    for (let rangeEnd = rangeStart + 2; rangeEnd <= window.length; rangeEnd++) {
      const range = xmas.slice(rangeStart, rangeEnd)
      const rangeSum = _.sum(range)
      if (rangeSum === invalidElm.value) {
        return _.min(range)! + _.max(range)!
      }
      if (rangeSum > invalidElm.value)
        continue outerLoop
    }
  }

  return -1
}
