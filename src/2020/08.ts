// https://adventofcode.com/2020/day/8

type Program = { op: string, val: number }[]
function genProgram(input: string): Program {
  return input.split('\n')
    .map((line) => {
      const [op, valStr] = line.split(' ')
      return { op, val: Number.parseInt(valStr) }
    })
}

function runProgram(program: Program) {
  let i = 0
  let accumulator = 0
  const seenOps = new Set<number>()
  while (!seenOps.has(i)) {
    if (i === program.length) return { correctTermination: accumulator }
    if (i > program.length) return { } // oob
    seenOps.add(i)
    const cmd = program[i]
    switch (cmd.op) {
      case 'jmp':
        i += cmd.val
        continue
      case 'nop':
        i++
        continue
      case 'acc':
        accumulator += cmd.val
        i++
        continue
      default:
        throw new Error(`unknown opcode ${cmd.op}`)
    }
  }
  return { infiniteLoop: accumulator }
}

export function partOne(input: string): number {
  const program = genProgram(input)
  return runProgram(program).infiniteLoop!
}

export function partTwo(input: string): number {
  const program = genProgram(input)
  for (let i = 0; i < program.length; i++) {
    if (program[i].op === 'acc') continue

    const modifiedProgram = structuredClone(program)
    if (program[i].op === 'nop')
      modifiedProgram[i].op = 'jmp'
    else // (program[i].op === 'jmp'
      modifiedProgram[i].op = 'nop'

    const result = runProgram(modifiedProgram)
    if (result.correctTermination)
      return result.correctTermination
  }

  return -1
}
