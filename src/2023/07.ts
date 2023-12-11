// https://adventofcode.com/2023/day/7

const cards = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'] as const
const partTwoCards: Card[] = ['J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A'] as const
type Card = typeof cards[number]
type Hand = Card[]

function getRawValue(hand: Hand): number {
  const cardCounts = _.countBy(hand)
  const counts = _.values(cardCounts)
  const maxCount = _.max(counts)

  // all five cards have the same label
  if (maxCount === 5) return 6
  // four cards have the same label and one card has a different label
  if (maxCount === 4) return 5

  // three cards have the same label
  if (maxCount === 3) {
    // and the remaining two cards share a different label
    if (counts.length === 2) return 4
    // and the remaining two cards are each different from any other card in the hand
    return 3
  }
  // two cards share one label, two other cards share a second label, and the remaining card has a third label
  if (counts.length === 3) return 2
  // two cards share one label, and the other three cards have a different label from the pair and each other
  if (counts.length === 4)
    return 1

  // all cards' labels are distinct
  return 0
}

// transform all jokers to contribute to the biggest set of cards that share a label
function transformJokers(hand: Hand): Hand {
  const cardCounts = _.countBy(hand)
  const bestCardToAdd: string = _.maxBy(_.keys(cardCounts), card => card === 'J' ? 0 : cardCounts[card])!
  return hand.join('').replaceAll('J', bestCardToAdd).split('') as Hand
}

// add decimals to break ties, ex
// hand of [2,3,4,5,6] => 0. 00 01 02 03 04
// hand of [T,J,Q,K,A] => 0. 08 09 10 11 12
function getValue(hand: Hand, partTwo = false): number {
  // switch out value array for one that devalues jokers if part two
  const cardValArr = partTwo ? partTwoCards : cards
  // add to best set by replacing jokers with that set's card if part two
  const transformedHand = partTwo ? transformJokers(hand) : hand

  let out = `${getRawValue(transformedHand).toString()}.`
  hand.forEach((card) => {
    out += cardValArr.indexOf(card).toString().padStart(2, '0')
  })
  return Number(out)
}

function getHandBets(input: string): [Hand, number][] {
  return input.split('\n').map(line => line.split(' ')).map(aaa => [aaa[0].split('') as Hand, Number(aaa[1])])
}

function solve(input: string, partTwo = false) {
  const handBets = getHandBets(input)
  const scoreBets = _.sortBy(handBets.map(([hand, bet]) => [getValue(hand, partTwo), bet]), a => a[0])

  const winnings = scoreBets.map(([_, bet], score) => bet * (score + 1))
  return _.sum(winnings)
}

export function partOne(input: string): number {
  return solve(input)
}

export function partTwo(input: string): number {
  return solve(input, true)
}
