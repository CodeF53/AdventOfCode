// https://adventofcode.com/2023/day/12

interface Spring {
  springs: string[]
  groups: number[]
}

function solveEntry({ springs, groups }: Spring): number {
  const numSprings = springs.length
  const numGroups = groups.length
  const biggestDamageGroup = _.max(groups)!
  const dp = _.times(numSprings + 1, () => _.times(numGroups + 1, () => _.times(biggestDamageGroup + 1, () => 0)))

  // base cases
  dp[0][0][0] = 1 // Empty arrangement is valid
  let consecutiveBroken = 0
  // Populate base cases for consecutive broken springs:
  let b = true
  _.times(numSprings, (i) => {
    consecutiveBroken = (springs[i] === '#') ? consecutiveBroken + 1 : 0
    if (consecutiveBroken) dp[i + 1][0][consecutiveBroken] = 1
    if (springs[i] === '#') b = false // break
    if (b) dp[i + 1][0][0] = 1
  })

  // dynamic programming
  _.times(numSprings, (i) => {
    const springState = springs[i]
    if (springState === '.' || springState === '?') // functional
      _.times(numGroups, j => dp[i + 1][j + 1][0] = dp[i][j][groups[j]] + dp[i][j + 1][0])
    if (springState === '#' || springState === '?') // broken
      _.times(numGroups + 1, j => _.times(biggestDamageGroup, k => dp[i + 1][j][k + 1] = dp[i][j][k]))
  })

  // combine final states:
  return dp[numSprings][numGroups][0] + dp[numSprings][numGroups - 1][groups[numGroups - 1]]
}

function parseEntry(entryString: string, partTwo: boolean): Spring {
  const [springsString, damagedGroupsString] = entryString.split(' ')
  // lengths of damaged groups in order
  const groups: number[] = Array(partTwo ? 5 : 1).fill(damagedGroupsString.split(',').map(Number)).flat() as number[]
  // array of '.','#',or'?'
  const springs: string[] = Array(partTwo ? 5 : 1).fill(springsString).join('?').replaceAll(/\.{2,}/g, '.').split('')

  return { springs, groups }
}

function parseInput(input: string, partTwo: boolean = false): Spring[] {
  return input.split('\n').map(l => parseEntry(l, partTwo))
}

export function partOne(input: string): number {
  const entries = parseInput(input, false)
  return _.sumBy(entries, solveEntry)
}

export function partTwo(input: string): number {
  const entries = parseInput(input, true)
  return _.sumBy(entries, solveEntry)
}
