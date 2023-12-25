// https://adventofcode.com/2023/day/25

class Component {
  static all: Record<string, Component> = {}
  connections: Component[] = []
  constructor(public id: string, connections: string[]) {
    Component.all[id] = this

    this.addConnections(connections)
  }

  addConnections(connections: string[]) {
    for (const connectionId of connections) {
      if (Component.all[connectionId] && !this.connections.includes(Component.all[connectionId]))
        this.connections.push(Component.all[connectionId])
      else
        this.connections.push(new Component(connectionId, []))
    }
  }

  static establishUnsetConnections() {
    for (const component of _.values(Component.all)) {
      for (const connection of component.connections)
        connection.connections.push(component)
      component.connections = _.uniq(component.connections)
    }
  }
}

function initComponents(input: string) {
  Component.all = {}
  for (const componentString of input.split('\n')) {
    const [id, connectionString] = componentString.split(': ')
    const connectionIds = connectionString.split(' ')
    if (Component.all[id])
      Component.all[id].addConnections(connectionIds)
    else
      new Component(id, connectionIds)
  }
  Component.establishUnsetConnections()
}

function findIsland(externalConnections: number): Component[] {
  const seen = new Set<string>()

  const queue: Component[][] = []
  Object.values(Component.all).forEach(comp => queue.push([comp]))

  while (!_.isEmpty(queue)) {
    const entry = queue.shift()!

    const key = entry.map(a => a.id).join('')
    if (seen.has(key)) continue
    seen.add(key)

    const expanded = _.uniq([...entry, ...entry.flatMap(c => c.connections)])
    const outsideConnections = _.difference(expanded, entry)
    if (outsideConnections.length === externalConnections)
      return entry

    queue.splice(_.sortedIndexBy(queue, expanded, 'length'), 0, expanded)
  }

  return []
}

export function partOne(input: string): number {
  initComponents(input)

  const innerNetSize = findIsland(3).length
  const outerNetSize = Object.values(Component.all).length - innerNetSize

  return innerNetSize * outerNetSize
}

export function partTwo(input: string): number {
  return -1
}
