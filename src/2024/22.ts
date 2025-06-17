// https://adventofcode.com/2024/day/22

const mod = (a: number, b: number) => ((a % b) + b) % b
const prune = (a: number) => mod(a, 16777216)

function evolveSecret(secret: number): number {
  secret = prune(secret ^ (secret * 64))
  secret = prune(secret ^ Math.floor(secret / 32))
  secret = prune(secret ^ (secret * 2048))
  return secret
}

function evolveSecretN(secret: number, n: number): number {
  _.times(n, () => secret = evolveSecret(secret))
  return secret
}

export function partOne(input: string): number {
  return Iterator.from(input.split('\n'))
    .map(secret => evolveSecretN(Number(secret), 2000))
    .reduce((acc, v) => acc + v, 0)
}

type SequenceMap = Map<string, number>
function getSequenceMap(secret: number) {
  const sequenceMap: SequenceMap = new Map()

  const sequence = []
  let lastValue = secret % 10
  for (let i = 0; i <= 2000; i++) {
    secret = evolveSecret(secret)
    const newVal = secret % 10
    const diff = newVal - lastValue
    sequence.push(diff)
    lastValue = newVal

    if (sequence.length < 4) continue
    const sequenceKey = sequence.slice(-4).toString()
    if (sequenceMap.has(sequenceKey)) continue
    sequenceMap.set(sequence.slice(-4).toString(), newVal)
  }

  return sequenceMap
}

export function partTwo(input: string): number {
  const sequenceMaps = input.split('\n')
    .map(line => getSequenceMap(Number(line)))

  // const sequencesToCheck = new Set(sequenceMaps.flatMap(sequenceValues => sequenceValues.keys().toArray()))
  // for (const sequence of sequencesToCheck) {
  //   const sequenceValue = Iterator.from(sequenceMaps)
  //     .map(sequenceMap => sequenceMap.get(sequence) ?? 0)
  //     .reduce((acc, v) => acc + v, 0)
  //   if (sequenceValue > currentMaxProfit)
  //     currentMaxProfit = sequenceValue
  // }
  const sequenceValues = new Map<string, number>()
  for (const sequenceMap of sequenceMaps) {
    for (const [sequence, value] of sequenceMap)
      sequenceValues.set(sequence, (sequenceValues.get(sequence) ?? 0) + value)
  }

  let currentMaxProfit = Number.MIN_SAFE_INTEGER
  for (const sequenceValue of sequenceValues.values()) {
    if (sequenceValue > currentMaxProfit)
      currentMaxProfit = sequenceValue
  }

  return currentMaxProfit
}
