// https://adventofcode.com/2022/day/11
import _ from 'lodash'

let ultraWorried: boolean
export function partOne(input: string): number {
  ultraWorried = false
  return monkeyBusiness(input, 20)
}

export function partTwo(input: string): number {
  ultraWorried = true
  return monkeyBusiness(input, 10000)
}

function monkeyBusiness(input: string, numRounds: number): number {
  createMonkeys(input)
  _.times(numRounds, Monkey.round)

  const busiestMonkeys = _.sortBy(Monkey.all, 'inspectCount').slice(-2).map(monkey => monkey.inspectCount)

  return busiestMonkeys[0] * busiestMonkeys[1]
}

function createMonkeys(input: string) {
  Monkey.all.length = 0
  Monkey.superMod = 1
  input.split('\n\n').forEach(monkeyDetails => new Monkey(monkeyDetails))
}

class Monkey {
  items: number[] = []
  operation: (old: number) => number
  testNum: number
  falseIndex: number
  trueIndex: number
  inspectCount = 0

  constructor(details: string) {
    const detailLines = details.split('\n').slice(1).map(line => line.split(': ', 2)[1])

    this.items = detailLines[0].split(', ').map(Number)
    // eslint-disable-next-line no-eval, ts/no-unsafe-assignment
    this.operation = eval(`(old)=>${detailLines[1].split('= ')[1]}`)
    this.testNum = Number(detailLines[2].split('by ')[1])
    this.trueIndex = Number(detailLines[3].split('monkey ')[1])
    this.falseIndex = Number(detailLines[4].split('monkey ')[1])

    Monkey.all.push(this)
    Monkey.superMod *= this.testNum
  }

  turn() {
    while (this.items.length > 0) {
      let item = this.items.pop()!
      // Monkey Inspect
      item = this.operation(item)
      // Human Relief (doesn't happen when ultra worried)
      if (!ultraWorried) item = _.floor(item / 3)
      item %= Monkey.superMod

      // Test and throw
      const testResult = item % this.testNum === 0
      Monkey.all[testResult ? this.trueIndex : this.falseIndex].items.push(item)

      this.inspectCount++
    }
  }

  static round() {
    Monkey.all.forEach(monkey => monkey.turn())
  }

  static superMod = 1 // % inspected items by this amount to keep numbers manageable
  static all: Monkey[] = []
}
