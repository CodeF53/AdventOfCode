// https://adventofcode.com/2020/day/13

export function partOne(input: string): number {
  const [arriveAtStr, busChart] = input.split('\n')
  const iGetAtTheStopAt = Number(arriveAtStr)
  let earliestValidArrivalTime = Number.MAX_SAFE_INTEGER
  let answer = -1
  for (const bus of busChart.split(',')) {
    if (bus === 'x') continue
    const busID = Number(bus)
    let i = 0
    while (i * busID < iGetAtTheStopAt) i++
    if (i * busID < earliestValidArrivalTime) {
      earliestValidArrivalTime = i * busID
      const waitTime = i * busID - iGetAtTheStopAt
      answer = busID * waitTime
    }
  }

  return answer
}

export function partTwo(input: string): number {
  return -1
}
