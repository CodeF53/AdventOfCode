// https://adventofcode.com/2023/day/7

const cards = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'] as const
type Card = typeof cards[number]
type Hand = Card[]

function getValue(hand: Hand): number {
  // todo: determine value from 0-6 using magic

  // todo: add decimals to the end to break ties, ex
  // hand of [2,3,4,5,6] => 0. 00 01 02 03 04
  // hand of [T,J,Q,K,A] => 0. 08 09 10 11 12

  return 0
}

function getHandBets(input: string): [Hand, number][] {
  return input.split('\n').map(line => line.split(' ')).map(aaa => [aaa[0].split('') as Hand, Number(aaa[1])])
}

export function partOne(input: string): number {
  const handBets = getHandBets(input)
  console.log(getValue(handBets.map(a => a[0])[0]))
  return -1
}

export function partTwo(input: string): number {
  return -1
}
