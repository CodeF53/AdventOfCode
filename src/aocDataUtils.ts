import './globals'
import 'dotenv/config'
import { existsSync, writeFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { load as parseHTML } from 'cheerio'
import { getAbsolutePath, padDay } from './startUtil'

export async function getInput(year: number, day: number): Promise<string> {
  // try to read input from cache
  const cachePath = getAbsolutePath(`./${year}/${padDay(day)}.input`)
  if (existsSync(cachePath))
    return readFile(cachePath, 'utf-8')

  // otherwise, fetch input and save it
  const input = await fetchInput(year, day)
  writeFileSync(cachePath, input)

  return input
}

async function fetchInput(year: number, day: number): Promise<string> {
  const url = `https://adventofcode.com/${year}/day/${day}/input`
  const headers = getAocHeaders()
  const resp = await fetch(url, { headers })

  if (resp.status !== 200)
    throw new Error(`Failed to get input data for ${year}/${day}`)

  return (await resp.text())
    .slice(0, -1) // remove trailing newline
}

export interface ProblemExamples {
  partOne: { input: string, output: string }
  partTwo?: { input: string, output: string }
}

export async function saveExamples(year: number, day: number) {
  const cachePath = getAbsolutePath(`./${year}/${padDay(day)}.ex.json`)
  // if we already have the examples for part one and two for specified day, don't get it.
  if (existsSync(cachePath) && (await import(cachePath) as ProblemExamples).partTwo)
    return

  // fetch problem
  const url = `https://adventofcode.com/${year}/day/${day}`
  const headers = getAocHeaders()
  const resp = await fetch(url, { headers })
  if (!resp.ok) throw new Error(`Failed to fetch data. Status: ${resp.status}`)
  const html = await resp.text()

  // parse
  const doc = parseHTML(html)
  // get all the article elements
  const articles = doc('article')
  if (articles.length < 1 || articles.length > 2)
    throw new Error('Unexpected article count found, expected one or two.')
  // get input/output for each part
  const examples = articles.map((i, article) => {
    // get version of article we can use .find() on
    const parseArticle = doc(article)
    const input = parseArticle.find('pre > code').first().text().trim()
    const output = parseArticle.find('p > code > em').last().text()
    return { input, output }
  })

  // format
  const example: ProblemExamples = { partOne: examples[0] }
  if (examples.length === 2)
    example.partTwo = examples[1]
  // save
  writeFileSync(cachePath, `${JSON.stringify(example, undefined, '  ')}\n`)
}

function getAocHeaders(): Headers {
  const token = process.env.AOC_TOKEN
  if (!token) throw new Error('No AOC Token given! Follow instructions in README.md')
  return new Headers({ Cookie: `session=${token}` })
}

export async function getExamples(year: number, day: number): Promise<ProblemExamples> {
  return (await import(getAbsolutePath(`./${year}/${padDay(day)}.ex.json`))) as ProblemExamples
}
