// https://adventofcode.com/2020/day/5

function decodeBinaryStr(str: string, zeroChar: string): number {
  let out = 0
  for (const char of str.split('')) {
    out <<= 1
    if (char !== zeroChar) out += 1
  }
  return out
}

function decodeSeatId(pass: string): number {
  const rowEnc = pass.slice(0, 7)
  const colEnc = pass.slice(7)
  const row = decodeBinaryStr(rowEnc, 'F')
  const col = decodeBinaryStr(colEnc, 'L')
  return row * 8 + col
}

export function partOne(input: string): number {
  const boardingPasses = input.split('\n')
  const seatIds = boardingPasses.map(decodeSeatId)
  return _.max(seatIds)!
}

export function partTwo(input: string): number {
  const boardingPasses = input.split('\n')
  const seatIds = boardingPasses.map(decodeSeatId).toSorted((a, b) => a - b)
  for (let i = 0; i < seatIds.length - 1; i++) {
    const testSeatA = seatIds[i]
    const testSeatB = seatIds[i + 1]
    const diff = testSeatB - testSeatA
    if (diff !== 1) return testSeatA + 1
  }
  return -1
}
