// https://adventofcode.com/2023/day/4

interface Card {
  winningNums: number[]
  nums: number[]
}

function getCards(input: string): Card[] {
  // get cards, but in the format [[winNums, nums]]
  const cardLikeArrays = input.split('\n').map(line => line.split(': ')[1].split(' | ').map(section => section.split(/ +/).map(Number)))
  // turn into array of objects instead for better types & readability
  return cardLikeArrays.map(entry => ({ winningNums: entry[0], nums: entry[1] }))
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
      cardCounts[c] += cardCounts[i]
  }

  return _.sum(cardCounts)
}
