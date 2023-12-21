// https://adventofcode.com/2023/day/20
abstract class Module {
  targets: Module[] = []
  constructor(public targetIds: string[], public id: string) {
    Module.all[id] = this
  }

  // fills in values for stuff
  init() {
    this.targets = this.targetIds.map((id) => {
      if (Module.all[id])
        return Module.all[id]
      return new DumbModule([], id)
    })
  }

  // given a pulse from a specific module,
  // returns the pulse it would sent to targets after receiving that pulse (if any)
  abstract receivePulse(id: string, pulse: boolean): boolean | undefined

  static all: Record<string, Module> = {}
}

class FlipFlop extends Module {
  state: boolean = false

  receivePulse(id: string, pulse: boolean) {
    // if receive low, flip state and send new state
    if (pulse === false) {
      this.state = !this.state
      return this.state
    }
  }
}

class Conjunction extends Module {
  recentReceived: Record<string, boolean> = {}

  receivePulse(id: string, pulse: boolean) {
    this.recentReceived[id] = pulse

    return _.values(this.recentReceived).includes(false)
  }

  init() {
    super.init()
    // get all the stuff that will input into us
    const inputs: Module[] = _.values(Module.all).filter(module => module.targetIds.includes(this.id))
    inputs.forEach(inputModule => this.recentReceived[inputModule.id] = false)
  }
}

class DumbModule extends Module {
  receivePulse(_id: string, inputPulse: boolean): boolean | undefined {
    return inputPulse
  }
}

function initModules(input: string) {
  // reset global vars
  Module.all = {}
  // create modules
  input.split('\n').forEach((line) => {
    const [idString, targetString] = line.split(' -> ')
    const targets = targetString.split(', ')

    const idTrim = idString.slice(1)
    switch (idString[0]) {
      case '%':
        new FlipFlop(targets, idTrim)
        break
      case '&':
        new Conjunction(targets, idTrim)
        break
      default:
        new DumbModule(targets, idString)
        break
    }
  })
  new DumbModule(['broadcaster'], 'button')
  _.values(Module.all).forEach(module => module.init())
}

function pressButton(button: DumbModule) {
  const toSend: [boolean, Module][] = [[false, button]]
  let highPulseCount = 0
  let lowPulseCount = 0

  while (toSend.length > 0) {
    const [pulse, module] = toSend.shift()!
    const { id, targets } = module

    if (pulse) highPulseCount += targets.length
    else lowPulseCount += targets.length

    for (const target of targets) {
      // console.log(id, pulse ? '-high->' : '-low->', target.id)
      const response = target.receivePulse(id, pulse)
      if (response !== undefined)
        toSend.push([response, target])
    }
  }

  return { lowPulseCount, highPulseCount }
}

export function partOne(input: string): number {
  initModules(input)
  const button: DumbModule = Module.all.button

  let lowPulseTotal = 0
  let highPulseTotal = 0
  for (let i = 0; i < 1_000; i++) {
    const { lowPulseCount, highPulseCount } = pressButton(button)

    lowPulseTotal += lowPulseCount
    highPulseTotal += highPulseCount
  }

  return lowPulseTotal * highPulseTotal
}

export function partTwo(input: string): number {
  return -1
}
