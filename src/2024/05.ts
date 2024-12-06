// https://adventofcode.com/2024/day/5

// returns true if array was already valid
function swapInvalid(pages: number[], rules: number[][]): Promise<boolean> {
  const validRules = rules.filter(rule => pages.includes(rule[0]) && pages.includes(rule[1]))

  return new Promise((r) => {
    pages.forEach((page, i) => {
      for (const [mustBeBefore, targetPage] of validRules) {
        if (page !== targetPage) continue
        const indexBefore = pages.indexOf(mustBeBefore)
        if (indexBefore > i) {
          [pages[i], pages[indexBefore]] = [pages[indexBefore], pages[i]]
          r(false)
        }
      }
    })
    r(true)
  })
}

export async function partOne(input: string): Promise<number> {
  const [rules, updates] = input.split('\n\n').map(group => group.split('\n')
    .map(line => line.split(/\||,/).map(Number)))

  let total = 0
  for (const update of updates)
    if (await swapInvalid(update, rules)) total += update[(update.length - 1) / 2]

  return total
}

export async function partTwo(input: string): Promise<number> {
  const [rules, updates] = input.split('\n\n').map(group => group.split('\n')
    .map(line => line.split(/\||,/).map(Number)))

  let total = 0
  for (const update of updates) {
    if (await swapInvalid(update, rules)) continue
    while (!(await swapInvalid(update, rules))) { /* empty */ }

    total += update[(update.length - 1) / 2]
  }

  return total
}
