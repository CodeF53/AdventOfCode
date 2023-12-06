// https://adventofcode.com/2023/day/6
import { arrayProduct } from '../utils'

interface RaceData {
  time: number
  distance: number
}

function getWinningHoldTimes(raceData: RaceData): number[] {
  const winningHoldTimes: number[] = []

  for (let timeHeld = 1; timeHeld < raceData.time; timeHeld++) {
    const velocity = timeHeld
    const timeRemaining = raceData.time - timeHeld
    const distance = velocity * timeRemaining

    if (distance > raceData.distance)
      winningHoldTimes.push(timeHeld)
  }

  return winningHoldTimes
}

export function partOne(input: string): number {
  const raceDatas: RaceData[] = _.zip(...input.split('\n').map(line => line.split(/: +/)[1].split(/ +/).map(Number))).map(([time, distance]) => ({ time: time!, distance: distance! }))
  return arrayProduct(raceDatas.map(raceData => getWinningHoldTimes(raceData).length))
}

export function partTwo(input: string): number {
  const [time, distance] = input.split('\n').map(line => Number(line.split(/: +/)[1].replaceAll(' ', '')))
  return getWinningHoldTimes({ time, distance }).length
}
