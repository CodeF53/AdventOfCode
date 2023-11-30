import { existsSync, writeFile } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import _ from 'lodash'
import 'dotenv/config'

// pads numbers with leading 0's to get them to 2 digits, 1 => "01"
// used for file names of solutions and inputs to ensure proper ordering
export const padDay = (day: number): string => day.toString().padStart(2, '0')

const __dirname = dirname(fileURLToPath(import.meta.url))

export async function getInput(year: number, day: number): Promise<string> {
  // try to read input from cache
  const cachePath = join(__dirname, `./${year}/${padDay(day)}.input`)
  if (existsSync(cachePath))
    return await readFile(cachePath, 'utf-8')

  // otherwise, fetch input and save it
  const input = await fetchInput(year, day)
  writeFile(cachePath, input, _.noop)

  return input
}

async function fetchInput(year: number, day: number): Promise<string> {
  const token = process.env.AOC_TOKEN
  if (!token)
    throw new Error('No AOC Token given! Follow instructions in README.md')

  const url = `https://adventofcode.com/${year}/day/${day}/input`
  const headers = new Headers({ Cookie: `session=${token}` })

  const resp = await fetch(url, { headers })

  if (resp.status !== 200)
    throw new Error(`Failed to get input data for ${year}/${day}`)

  return await resp.text()
}
