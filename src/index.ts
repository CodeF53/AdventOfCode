import './globals'
import { padDay } from './util'

const year = Number(process.env.YEAR)
const day = Number(process.env.DAY)
const input = process.env.INPUT!
if (!year || !day || !input)
  throw new Error('do `npm start` instead of `npm run dev`')

// run specified solution
interface SolutionFunctions {
  partOne: (input: string) => unknown
  partTwo: (input: string) => unknown
}
const solution = (await import(`./${year}/${padDay(day)}`)) as SolutionFunctions

const { partOne, partTwo } = solution

function ppAndTime(func: (input: string) => unknown) {
  const start = performance.now()
  const answer = func(input)
  const end = performance.now()
  const time = `${(end - start).toFixed(3)}ms`

  console.log(`Day ${day} ${func.name}: ${answer as any}\t${time}`)
}

ppAndTime(partOne)
ppAndTime(partTwo)
