// https://adventofcode.com/2023/day/3

// The engineer explains that an engine part seems to be missing from the engine, but nobody can figure out which one.
// If you can add up all the part numbers in the engine schematic, it should be easy to work out which part is missing.

// any number adjacent to a symbol, even diagonally, is a "part number" and should be included in your sum. (Periods (.) do not count as a symbol.)

interface location {
  line: number
  index: number
  match: string
}

const symbolRegex = /[^\d\.]/g
const partRegex = /\b\d{1,3}\b/g
function findRegexMatches(line: string, regex: RegExp, lineNumber: number): location[] {
  return [...line.matchAll(regex)].map(match => ({
    line: lineNumber,
    index: match.index!,
    match: match[0],
  }))
}

function getSymbolsAndParts(input: string): { symbols: location[], parts: location[] } {
  const lines = input.split('\n')

  const symbols: location[] = []
  const parts: location[] = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    // find symbols
    symbols.push(...findRegexMatches(line, symbolRegex, i))
    // find parts
    parts.push(...findRegexMatches(line, partRegex, i))
  }

  return { symbols, parts }
}

function touching(part: location, symbol: location) {
  if (symbol.match.length > 1)
    throw new Error('ALWAYS CALL TOUCHING WITH PART AS FIRST ARG AND SYMBOL AS SECOND')

  // within correct height range?
  if (symbol.line > part.line + 1 || symbol.line < part.line - 1)
    return false

  // within correct index range?
  if (symbol.index > part.index + part.match.length || symbol.index < part.index - 1)
    return false

  return true
}

function touchingAny(part: location, symbols: location[]) {
  return symbols.some(symbol => touching(part, symbol))
}

export function partOne(input: string): number {
  const { symbols, parts } = getSymbolsAndParts(input)

  const partsTouchingSymbols = parts.filter(part => touchingAny(part, symbols))

  return _.sum(partsTouchingSymbols.map(part => Number(part.match)))
}

function getTouching(cog: location, parts: location[]) {
  const out: location[] = []
  parts.forEach((part) => {
    if (touching(part, cog)) out.push(part)
  })
  return out
}

export function partTwo(input: string): number {
  const { symbols, parts } = getSymbolsAndParts(input)

  // get cogs
  const cogs = symbols.filter(symbol => symbol.match === '*')

  // get all the parts that each cog is touching
  const cogContacts = cogs.map(cog => getTouching(cog, parts))

  // get all gears (cogs that touch 2 parts)
  const gears = cogContacts.filter(contacts => contacts.length === 2)

  // srdfgiofsdjoigfsdj
  return _.sum(gears.map(gear => gear.map(part => Number(part.match)).reduce((a, b) => a * b, 1)))
}
