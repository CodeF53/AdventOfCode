import './globals'
import { exec } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import prompts from 'prompts'
import { DateTime } from 'luxon'
import { getAbsolutePath, padDay } from './startUtil'
import { getInput, saveExamples } from './aocDataUtils'

const currentDateTime = DateTime.now().setZone('UTC-05')
const getSolutionNum: Record<string, () => Promise<{ year: number, day: number }>> = {
  // ran by default
  async ask() { // nice CLI interface for picking what day to run
    const currentYear = currentDateTime.year
    const isDecember = currentDateTime.month === 12
    const maxYear = currentYear - (isDecember ? 0 : 1)
    const { year } = (await prompts({
      type: 'number',
      name: 'year',
      message: `Which year (${maxYear})?`,
      initial: maxYear,
      validate: value => value <= maxYear && value >= 2015,
    })) as { year: number }

    const maxDay = year === maxYear ? currentDateTime.day : 25
    const { day } = (await prompts({
      type: 'number',
      name: 'day',
      message: `Which day (${maxDay})?`,
      initial: maxDay,
      validate: value => value <= maxDay && value >= 1,
    })) as { day: number }

    return { year, day }
  },

  async today() { // instantly resolves to today's date
    const now = DateTime.now().setZone('UTC-05')
    return { year: now.year, day: now.day }
  },

  async race() { // waits until tomorrow (as long as tomorrow is in 15 minutes)
    // Calculate how long until next puzzle releases
    const tomorrowStart = currentDateTime.plus({ days: 1 }).startOf('day')
    const secondsUntilTomorrow = tomorrowStart.diff(currentDateTime, 'seconds').seconds + 1 // + 1 just to be safe and make sure puzzle is actually out

    // if its in less than 15 minutes, wait for release
    if (secondsUntilTomorrow <= 900)
      await new Promise(r => setTimeout(r, secondsUntilTomorrow * 1000))

    return await getSolutionNum.today()
  },
}
const solutionNumGetter = getSolutionNum[process.argv[2]] || getSolutionNum.ask
const { year, day } = await solutionNumGetter()

// check if the solution file exists
const directoryPath = getAbsolutePath(`./${year}/`)
const solutionPath = getAbsolutePath(`./${year}/${padDay(day)}.ts`)
const problemUrl = `https://adventofcode.com/${year}/day/${day}`
// ensure folder exists for file to go into
if (!existsSync(directoryPath)) mkdirSync(directoryPath)
// create template solution if none exists
if (!existsSync(solutionPath)) {
  writeFileSync(solutionPath, `// ${problemUrl}\n\n`
  + 'export function partOne(input: string): number {\n  return -1\n}\n\n'
  + 'export function partTwo(input: string): number {\n  return -1\n}\n')
}
// ! if you aren't using VSCode or WSL, you will want to change these
if (process.argv[2] === 'race') {
  exec(`code ${solutionPath}`) // open solution in vscode
  exec(`explorer.exe ${problemUrl}`) // open problem in default browser
}

// get examples and input for problem
void await Promise.all([saveExamples(year, day), getInput(year, day)])

// Set environment variables
process.env.YEAR = year.toString()
process.env.DAY = day.toString()

// Start tsx
const dev = exec('npm run dev')
dev.stdout!.pipe(process.stdout)
dev.stderr!.pipe(process.stderr)

// TODO: key bind for submitting
