// https://adventofcode.com/2024/day/2

function isReportSafe(report: number[]): boolean {
  const directionUp = report[0] < report[1]
  for (let i = 0; i < report.length; i++) {
    const level = report[i]
    const priorLevel = report[i - 1]

    // unsafe if adjacent levels vary than more than 3
    const difference = Math.abs(level - priorLevel)
    if (difference > 3 || difference === 0) return false

    if (i > 0) {
      if (directionUp && level < priorLevel)
        return false
      if (!directionUp && level > priorLevel)
        return false
    }
  }
  return true
}

export function partOne(input: string): number {
  const reports = input.split('\n').map(line => line.split(/\s+/).map(Number))
  return reports.filter(isReportSafe).length
}

function isReportSafe2(report: number[]): boolean {
  if (isReportSafe(report)) return true

  // brute force check remove single levels
  for (let i = 0; i < report.length; i++) {
    const testReport = [...report].toSpliced(i, 1)
    if (isReportSafe(testReport)) return true
  }

  return false
}

export function partTwo(input: string): number {
  const reports = input.split('\n').map(line => line.split(/\s+/).map(Number))
  return reports.filter(isReportSafe2).length
}
