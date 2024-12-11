// https://adventofcode.com/2024/day/9

export function partOne(input: string): number {
  const report = input.split('').map(Number).flatMap((n, i) =>
    Array<number>(n).fill(i % 2 === 0 ? i / 2 : -1))

  let freeIndex = report.indexOf(-1)
  while (freeIndex !== -1) {
    const file = report.pop()!
    if (file === -1) {
      freeIndex = report.indexOf(-1)
      continue
    }
    report[freeIndex] = file
    freeIndex = report.indexOf(-1)
  }
  return _.sum(report.map((id, i) => id * i))
}

export function partTwo(input: string): number {
  // if (input.length > 50) return -1
  const report = input.split('').map(Number).flatMap((n, i) =>
    (i % 2 === 0 ? `${i / 2}` : '.').repeat(n))
  let comp = report.join('')
  // console.log(comp)
  for (let i = report.length - 1; i >= 0; i -= 2) {
    const file = report[i]
    const fileIndex = report.slice(0, i).join('').length
    const spaceIndex = comp.search(new RegExp(`\\.{${file.length}}`))
    if (spaceIndex === -1 || spaceIndex > fileIndex) continue
    comp = comp.slice(0, spaceIndex)
    + file
    + comp.slice(spaceIndex + file.length, fileIndex)
    + '.'.repeat(file.length)
    + comp.slice(fileIndex + file.length)
    // console.log(comp)
  }

  return _.sum(comp.split('').map((id, i) => (Number(id) || 0) * i))
  // current: 107872758896 too low
  // also seen: 111117079115 too low
}
