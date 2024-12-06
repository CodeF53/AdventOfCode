// https://adventofcode.com/2024/day/5

function cutInput(input: string): number[][][] {
  return input.split('\n\n').map(group => group.split('\n')
    .map(line => line.split(/\||,/).map(Number)))
}

// returns true if array was already valid
function swapInvalid(pages: number[], rules: number[][]): Promise<boolean> {
  return new Promise((r) => {
    rules.forEach(([mustBeBefore, target]) => {
      const [indexBefore, iT] = [pages.indexOf(mustBeBefore), pages.indexOf(target)]
      if (indexBefore === -1 || iT === -1) return
      if (indexBefore < iT) return
      [pages[iT], pages[indexBefore]] = [pages[indexBefore], pages[iT]]
      r(false)
    })
    r(true)
  })
}

export async function partOne(input: string): Promise<number> {
  const [rules, updates] = cutInput(input)

  let total = 0
  for (const update of updates)
    if (await swapInvalid(update, rules)) total += update[(update.length - 1) / 2]

  return total
}

export async function partTwo(input: string): Promise<number> {
  const [rules, updates] = cutInput(input)

  let total = 0
  for (const update of updates) {
    if (await swapInvalid(update, rules)) continue
    while (!(await swapInvalid(update, rules))) { /* empty */ }

    total += update[(update.length - 1) / 2]
  }

  return total
}
