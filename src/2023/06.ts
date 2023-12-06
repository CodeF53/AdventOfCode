// https://adventofcode.com/2023/day/6
import { arrayProduct } from '../utils'

interface RaceData {
  time: number
  distance: number
}

function getWinningHoldTimes(raceData: RaceData): number {
  let numWinningTimes = 0

  for (let timeHeld = 1; timeHeld < raceData.time; timeHeld++) {
    const velocity = timeHeld
    const timeRemaining = raceData.time - timeHeld
    const distance = velocity * timeRemaining

    if (distance > raceData.distance)
      numWinningTimes++
  }

  return numWinningTimes
}

function partialParseInput<T>(input: string, mapFn: (value: string) => T): T[] {
  return input.split('\n').map(line => mapFn(line.split(/: +/)[1]))
}

export function partOne(input: string): number {
  const raceDatas = _.zip(...partialParseInput(input, line => line.split(/ +/).map(Number))) as [[number, number]]
  return arrayProduct(raceDatas.map(([time, distance]) => getWinningHoldTimes({ time, distance })))
}

export function partTwo(input: string): number {
  const [time, distance] = partialParseInput(input, line => Number(line.replaceAll(' ', '')))
  return getWinningHoldTimes({ time, distance })
}
