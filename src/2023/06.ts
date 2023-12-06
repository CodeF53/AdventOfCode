// https://adventofcode.com/2023/day/6
import { arrayProduct } from '../utils'

function getWinningHoldTimes(raceTime: number, recordDistance: number) {
  const winningHoldTimes: number[] = []

  for (let timeHeld = 1; timeHeld < raceTime; timeHeld++) {
    const velocity = timeHeld
    const timeRemaining = raceTime - timeHeld
    const distance = velocity * timeRemaining

    if (distance > recordDistance)
      winningHoldTimes.push(timeHeld)
  }

  return winningHoldTimes
}

export function partOne(input: string): number {
  const fuck = _.zip(...input.split('\n').map(line => line.split(/: +/)[1].split(/ +/).map(Number))).map(([time, dist]) => ({ time, dist }))
  const sdfiogsdf = fuck.map(({ time, dist }) => getWinningHoldTimes(time!, dist!).length)
  return arrayProduct(sdfiogsdf)
}

export function partTwo(input: string): number {
  const fuck = input.split('\n').map(line => Number(line.split(/: +/)[1].replaceAll(' ', '')))

  return getWinningHoldTimes(fuck[0], fuck[1]).length
}
