// https://adventofcode.com/2024/day/5

function getFirstSwap(pages: number[], rules: number[][]): [number, number] {
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]
    const after = pages.slice(0, i + 1)
    for (const [mustBeBefore, targetPage] of rules) {
      if (page !== targetPage || !pages.includes(mustBeBefore)) continue
      if (!after.includes(mustBeBefore))
        return [i, pages.indexOf(mustBeBefore)]
    }
  }

  return [-1, -1]
}

export function partOne(input: string): number {
  const [rules, updates] = input.split('\n\n').map(group => group.split('\n')
    .map(line => line.split(/\||,/).map(Number)))

  let total = 0
  for (const update of updates)
    if (getFirstSwap(update, rules)[0] === -1) total += update[(update.length - 1) / 2]

  return total
}

export function partTwo(input: string): number {
  const [rules, updates] = input.split('\n\n').map(group => group.split('\n')
    .map(line => line.split(/\||,/).map(Number)))

  let total = 0
  for (const update of updates) {
    let invalid = getFirstSwap(update, rules)
    if (invalid[0] === -1) continue
    while (invalid[0] !== -1) {
      [update[invalid[0]], update[invalid[1]]] = [update[invalid[1]], update[invalid[0]]]
      invalid = getFirstSwap(update, rules)
    }

    total += update[(update.length - 1) / 2]
  }

  return total
}
