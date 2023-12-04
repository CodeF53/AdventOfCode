// https://adventofcode.com/2023/day/4

interface Card {
  winningNums: number[]
  nums: number[]
}

function getCards(input: string): Card[] {
  const fuck = input.split('\n').map(line => line.split(': ')[1].split('|').map(section => _.reject(section.split(' '), _.isEmpty).map(Number)))
  return fuck.map(entry => ({ winningNums: entry[0], nums: entry[1] }))
}

function getNumWinningNumbers({ winningNums, nums }: Card) {
  return nums.filter(num => winningNums.includes(num)).length
}

function getP1CardValue(card: Card) {
  return Math.floor(2 ** (getNumWinningNumbers(card) - 1))
}

export function partOne(input: string): number {
  const cards: Card[] = getCards(input)
  const cardValues = cards.map(getP1CardValue)
  return _.sum(cardValues)
}

export function partTwo(input: string): number {
  const cards: Card[] = getCards(input)

  const cardWinningNumberCounts = cards.map(getNumWinningNumbers)

  // determine card counts from duplication rules
  const cardCounts = _.fill(Array(cardWinningNumberCounts.length), 1)
  for (let i = 0; i < cardWinningNumberCounts.length - 1; i++) {
    const winNumCount = cardWinningNumberCounts[i]

    for (let c = i + 1; c < Math.min(i + winNumCount + 1, cardWinningNumberCounts.length); c++)
      cardCounts[c] += cardCounts[i] * 1
  }

  return _.sum(cardCounts)
}
