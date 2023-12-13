// https://adventofcode.com/2023/day/13

function areEqual(a: string[], b: string[], allowFuzzy: boolean): { equal: boolean, fuzzyUsed: boolean } {
  let differences = 0
  let fuzzyUsed = false

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      differences++
      if (differences > 1 || !allowFuzzy)
        return { equal: false, fuzzyUsed: false }
      fuzzyUsed = true
    }
  }

  return { equal: true, fuzzyUsed }
}

function verifyCenter(center: number, pattern: string[][], seekSmudge = false): boolean {
  let smudgeFound = !seekSmudge

  let botI = center
  let topI = center + 1

  while (botI >= 0 && topI < pattern.length) {
    const { equal, fuzzyUsed } = areEqual(pattern[botI], pattern[topI], !smudgeFound)
    if (!equal)
      return false
    if (fuzzyUsed)
      smudgeFound = true
    botI--
    topI++
  }
  return smudgeFound
}

function findReflectionHorz(pattern: string[][], seekSmudge = false): number {
  for (let i = 0; i < (pattern.length - 1); i++) {
    // ensure its actually a mirror center
    if (verifyCenter(i, pattern, seekSmudge))
      return i + 1
  }
  return -1
}
function findReflectionVert(pattern: string[][], seekSmudge = false): number {
  return findReflectionHorz(_.zip(...pattern) as string[][], seekSmudge)
}

export function partOne(input: string, seekSmudge = false): number {
  const patterns = input.split('\n\n')
    .map(pattern => pattern.split('\n')
      .map(line => line.split('')))

  return _.sum(patterns.map((pattern, i) => {
    const vert = findReflectionVert(pattern, seekSmudge)
    if (vert !== -1)
      return vert
    const horz = findReflectionHorz(pattern, seekSmudge)
    if (horz === -1)
      console.error(i)
    return horz * 100
  }))
}

export function partTwo(input: string): number {
  return partOne(input, true)
}
