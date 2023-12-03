import './globals'
import { exec } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import prompts from 'prompts'
import { DateTime } from 'luxon'
import { getAbsolutePath, padDay } from './startUtil'

const currentDateTime = DateTime.now().setZone('UTC-05')

// #region get puzzle
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
// #endregion

// check if the solution file exists
const directoryPath = getAbsolutePath(`./${year}/`)
const solutionPath = `${year}/${padDay(day)}`
try {
  await import(`./${solutionPath}`)
}
catch (error) {
  const { createFile } = (await prompts({
    type: 'confirm',
    name: 'createFile',
    message: `src/${solutionPath}.ts doesn't exist, do you want to create it?`,
    initial: true,
  })) as { createFile: boolean }

  if (!createFile)
    process.exit()

  // ensure folder exists for file to go into
  if (!existsSync(directoryPath))
    mkdirSync(directoryPath)
  // create template file
  writeFileSync(getAbsolutePath(`./${solutionPath}.ts`), `// https://adventofcode.com/${year}/day/${day}\n\n`
  + '//\nexport function partOne(input: string): number {\n  return -1\n}\n\n'
  + '//\nexport function partTwo(input: string): number {\n  return -1\n}\n')
}

// Set environment variables
process.env.YEAR = year.toString()
process.env.DAY = day.toString()

// Start tsx
const dev = exec('npm run dev')
dev.stdout!.pipe(process.stdout)
dev.stderr!.pipe(process.stderr)
