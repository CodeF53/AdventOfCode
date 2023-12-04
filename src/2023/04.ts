// https://adventofcode.com/2023/day/4

interface Card {
  winningNums: number[]
  nums: number[]
}

// winning numbers | numbers you have
function splitfuck(input: string): Card[] {
  const fuck = input.split('\n').map(line => line.split(': ')[1].split('|').map(section => _.reject(section.split(' '), _.isEmpty).map(Number)))
  return fuck.map(entry => ({ winningNums: entry[0], nums: entry[1] }))
}

function getCardValue({ winningNums, nums }: Card) {
  return Math.floor(2 ** (nums.filter(num => winningNums.includes(num)).length - 1))
}

//
export function partOne(input: string): number {
  const cards: Card[] = splitfuck(input)
  const fuck = cards.map(getCardValue)
  return _.sum(fuck)
}

//
export function partTwo(input: string): number {
  return -1
}
