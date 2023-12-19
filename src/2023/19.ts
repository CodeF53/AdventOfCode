import { arrayProduct } from '../utils'

// https://adventofcode.com/2023/day/19
const categories = ['x', 'm', 'a', 's'] as const
type Category = typeof categories[number]
type Part = Record<Category, number>
type Operation = '>' | '<'
interface Rule {
  condition(part: Part): boolean
  category?: Category
  operation?: Operation
  compareNum?: number
  to: string
}

function createRule(ruleStr: string): Rule {
  if (!ruleStr.includes(':')) {
    return {
      condition() { return true },
      to: ruleStr,
    }
  }
  const [conditionStr, to] = ruleStr.split(':')
  const condition = eval(`({x,m,a,s})=>(${conditionStr})`) as (part: Part) => boolean
  // part 2 stuff
  const category = conditionStr[0] as Category
  const operation = conditionStr[1] as Operation
  const compareNum = Number(conditionStr.slice(2))
  return { condition, category, operation, compareNum, to }
}

function parseInput(input: string): [Part[], Record<string, Rule[]>] {
  const [workflowStrs, partsStrings] = input.split('\n\n').map(g => g.split('\n'))
  const parts = JSON.parse(`[${partsStrings.join().replaceAll(/(\w)=/g, '"$1":')}]`) as Part[]
  const workflows: Record<string, Rule[]> = {}
  for (const workflowStr of workflowStrs) {
    const [name, rulesStr] = workflowStr.slice(0, -1).split('{')
    const rules = rulesStr.split(',').map(createRule)
    workflows[name] = rules
  }

  return [parts, workflows]
}

function runWorkflow(part: Part, workflow: Rule[]): string {
  for (const rule of workflow) {
    if (rule.condition(part))
      return rule.to
  }
  throw new Error('bad workflow or part')
}

function runPart(part: Part, workflows: Record<string, Rule[]>) {
  let to = 'in'
  while (to !== 'A' && to !== 'R')
    to = runWorkflow(part, workflows[to])
  return to === 'A'
}

export function partOne(input: string): number {
  const [parts, workflows] = parseInput(input)
  let sum = 0
  for (const part of parts) {
    if (runPart(part, workflows))
      sum += _.sum(Object.values(part))
  }

  return sum
}

class NumRange {
  size: number
  constructor(public min: number, public max: number) {
    this.size = max - min
  }

  split(operation: Operation, compareNum: number): { rTrue?: NumRange, rFalse?: NumRange } {
    if (operation === '<') {
      if (this.max < compareNum)
        return { rTrue: this }
      if (this.min >= compareNum)
        return { rFalse: this }

      return { rTrue: new NumRange(this.min, compareNum - 1), rFalse: new NumRange(compareNum, this.max) }
    }
    if (this.min > compareNum)
      return { rTrue: this }
    if (this.max <= compareNum)
      return { rFalse: this }
    return { rTrue: new NumRange(compareNum + 1, this.max), rFalse: new NumRange(this.min, compareNum) }
  }

  toString() {
    return `${this.min}..${this.max}`
  }
}

class PartRange {
  x!: NumRange
  m!: NumRange
  a!: NumRange
  s!: NumRange
  constructor() {
    for (const category of categories)
      this[category] = new NumRange(1, 4000)
  }

  runRule({ category, operation, compareNum, to }: Rule, originalKey: string): Record<string, PartRange> {
    if (!category)
      return { [to]: this }

    const { rTrue, rFalse } = this[category].split(operation!, compareNum!)
    const out: Record<string, PartRange> = {}
    if (rTrue) {
      const trueOut = _.cloneDeep(this)
      trueOut[category] = rTrue
      out[to] = trueOut
    }
    if (rFalse) {
      this[category] = rFalse
      out[originalKey] = this
    }

    return out
  }

  size() {
    return arrayProduct(categories.map(cat => this[cat].size))
  }

  toString() {
    return `size: ${this.size()}\n${categories.map(cat => `  ${cat}: ${this[cat].toString()}`).join('\n')}`
  }
}

export function partTwo(input: string): number {
  const [, workflows] = parseInput(input)

  const ranges: Record<string, PartRange[]> = { in: [new PartRange()] }
  while (_.some(Object.keys(ranges), key => key !== 'A' && key !== 'R')) {
    _.forIn(ranges, (workflowRanges, workflowName) => {
      if (workflowName === 'A' || workflowName === 'R')
        return

      for (const rule of workflows[workflowName]) {
        const range = workflowRanges.pop()
        if (!range) continue

        // if (rule.category)
        //   console.log('splitting', `${workflowName}[${rule.category}]`, range[rule.category].toString())
        const processedRanges = range.runRule(rule, workflowName)
        // if (rule.category) {
        //   console.log(' ', rule.category, rule.operation, rule.compareNum)
        //   _.forIn(processedRanges, (v, k) => console.log(k, v[rule.category!].toString()))
        //   console.log('\n')
        // }
        // else {
        //   console.log(workflowName, '->', Object.keys(processedRanges)[0], '\n')
        // }

        _.forIn(processedRanges, (value, key) => {
          if (ranges[key] === undefined) ranges[key] = []
          ranges[key].push(value)
        })
      }
      if (workflowRanges.length === 0)
        delete ranges[workflowName]
    })
  }
  console.log(ranges.A.map(range => range.toString()).join('\n\n'))

  return _.sumBy(ranges.A, range => range.size())
}
// expected 167409079868000
// got      167010937327821
