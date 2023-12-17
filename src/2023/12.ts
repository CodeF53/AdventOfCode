// https://adventofcode.com/2023/day/12
import _ from 'lodash'
import { asThreaded } from '../utils'

function isValid(springs: string[], damagedGroups: number[]): boolean {
  const givenDamagedGroups = _.reject(springs.join('').split(/\.+/), _.isEmpty).map(damagedGroup => damagedGroup.length)
  return _.isEqual(givenDamagedGroups, damagedGroups)
}

export function solveEntry(entry: string): number {
  const [springsString, damagedGroupsString] = entry.split(' ')
  const damagedGroups: number[] = damagedGroupsString.split(',').map(Number) // lengths of damaged groups in order
  const springs: string[] = springsString.split('') // array of '.','#',or'?'
  let count = 0

  const numUnknown = _.sumBy(springs, spring => spring === '?' ? 1 : 0)
  const unknownIndices = springs.map((s, i) => [s, i]).filter(([s]) => s === '?').map(([_s, i]) => i)
  for (let i = 0; i < 2 ** numUnknown; i++) {
    const attempt = [...springs]

    for (let aaa = 0; aaa < numUnknown; aaa++) {
      const val = (i >> aaa) & 1
      const unknownIndex = unknownIndices[aaa]
      attempt[unknownIndex] = val ? '.' : '#'
    }

    if (isValid(attempt, damagedGroups))
      count++
  }

  return count
}

export async function partOne(input: string): Promise<number> {
  const tasks = []
  const solveEntryParallel = asThreaded(solveEntry, import.meta.url)
  for (const entry of input.split('\n'))
    tasks.push(solveEntryParallel(entry))

  return _.sum(await Promise.all(tasks))
}

function unfold(entry: string): string {
  const [springsString, damagedGroupsString] = entry.split(' ')
  return `${`${springsString}?`.repeat(5).slice(0, -1)} ${`${damagedGroupsString},`.repeat(5).slice(0, -1)}`
}

export function partTwo(input: string): number {
  const unfolded = input.split('\n').map(unfold).join('\n')
  console.log('unfolded')
  return partOne(unfolded)
}
