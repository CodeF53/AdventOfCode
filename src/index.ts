import './globals'
import { getExamples, getInput } from './aocDataUtils'
import { padDay } from './startUtil'

const year = Number(process.env.YEAR)
const day = Number(process.env.DAY)
if (!year || !day)
  throw new Error('do `npm start` instead of `npm run dev`')

// ! I dislike getting these here, as it means we re-read their cache every reload, but I can't find pass big inputs through process.env, need alternative
const [input, examples] = await Promise.all([
  getInput(year, day),
  getExamples(year, day),
])

// run specified solution
type SolutionResult = Promise<{ toString: () => string }>
interface SolutionFunctions {
  partOne: (input: string) => SolutionResult
  partTwo: (input: string) => SolutionResult
}
const solution = (await import(`./${year}/${padDay(day)}`)) as SolutionFunctions

const { partOne, partTwo } = solution

async function ppAndTime(func: (input: string) => SolutionResult) {
  if (func.name !== 'partOne' && func.name !== 'partTwo')
    return
  console.log(`\nDay ${day} ${func.name}:`)

  // test case
  if (examples[func.name]) {
    const testData = examples[func.name]!
    const testAnswer = (await func(testData.input)).toString()
    const testCorrect = testAnswer === testData.output
    console.log(` Test: ${testCorrect ? '✅' : `❌ expected ${testData.output} got`} ${testAnswer}`)
  }

  // real answer w/ timings
  // const start = performance.now()
  // const answer = await func(input)
  // const end = performance.now()
  // const time = `${(end - start).toFixed(3)}ms`
  // console.log(` Real: ${answer.toString()}\t${time}`)
}

await ppAndTime(partOne)
await ppAndTime(partTwo)
