import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import { getInput, padDay } from './util.js'

// #region Process arguments
const currentDate = new Date()
const isDecember = currentDate.getMonth() === 11
const { year, day, part } = yargs(hideBin(process.argv)).options({
  year: {
    default: isDecember ? currentDate.getFullYear() : -1,
    describe: 'AOC challenge year',
    type: 'number',
  },
  day: {
    default: isDecember ? currentDate.getDate() : -1,
    describe: 'AOC challenge day',
    type: 'number',
  },
  part: {
    default: -1,
    describe: 'AOC challenge part (-1 for all parts)',
    type: 'number',
  },
}).argv as { year: number, day: number, part: number }

// only allow implicit days in december
if (day === -1 || year === -1)
  throw new Error('Specify which solution to run with `npm start -- --year=20XX --day=XX`')
// #endregion

// run specified solution
interface SolutionFunctions {
  partOne: (input: string) => unknown
  partTwo: (input: string) => unknown
}

const solutionPath = `${year}/${padDay(day)}`
let solution
try {
  solution = (await import(`./${solutionPath}.js`)) as SolutionFunctions
}
catch (error) {
  throw new Error(`No solution exists for ${year} ${day}, please create src/${solutionPath}.ts`)
}

const { partOne, partTwo } = solution

const input = await getInput(year, day)

function ppAndTime(func: (input: string) => unknown) {
  const start = performance.now()
  const answer = func(input)
  const end = performance.now()
  const time = `${(end - start).toFixed(3)}ms`

  console.log(`Day ${day} ${func.name}: ${answer as any}\t${time}`)
}

switch (part) {
  case 1:
    ppAndTime(partOne)
    break
  case 2:
    ppAndTime(partTwo)
    break
  default:
    ppAndTime(partOne)
    ppAndTime(partTwo)
    break
}
