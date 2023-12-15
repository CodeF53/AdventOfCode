// https://adventofcode.com/2023/day/15

function hash(str: string): number {
  let out = 0
  for (const char of str) {
    const charCode = char.charCodeAt(0)
    out += charCode
    out *= 17
    out %= 256
  }
  return out
}

export function partOne(input: string): number {
  return _.sum(input.split(',').map(hash))
}

let boxes: Record<string, number>[]

function lenseBoxShit(str: string) {
  const [, label, operation, num] = /(\w+)(=|-)(\d*)/.exec(str)!
  const box = hash(label)

  if (operation === '=')
    boxes[box][label] = Number(num)
  else
    delete boxes[box][label]
}

function focusingPower(box: Record<string, number>, boxIndex: number): number {
  return _.sum(Object.values(box).map((v, i) => (boxIndex + 1) * v * (i + 1)))
}

export function partTwo(input: string): number {
  boxes = Array.from({ length: 256 }, () => ({}))
  input.split(',').map(lenseBoxShit)
  return _.sum(boxes.map(focusingPower))
}
