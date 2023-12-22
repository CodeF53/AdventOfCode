// https://adventofcode.com/2023/day/17
import { type Direction, type Pos, directions, getInverseDir, offsetPos } from '../utils'

function dirToArr(dir: Direction) {
  switch (dir) {
    case 'n': return '^'
    case 's': return 'v'
    case 'e': return '>'
    case 'w': return '<'
  }
}

class Node {
  static grid: number[][]
  static gridWidth: number
  static gridHeight: number
  static minMoveDist: number
  static maxMoveDist: number
  static seen: Set<string>
  static initNode(grid: number[][], minMoveDist: number, maxMoveDist: number) {
    Node.grid = grid
    Node.gridWidth = grid[0].length
    Node.gridHeight = grid.length
    Node.minMoveDist = minMoveDist
    Node.maxMoveDist = maxMoveDist
    Node.seen = new Set()
  }

  totalCost: number
  constructor(public pos: Pos, public cost: number, public pathCost: number, public direction: Direction, public moveCount: number, public parent?: Node) {
    this.totalCost = cost + pathCost
  }

  getConnections(): Node[] {
    const out: Node[] = []
    let moveCount = 1
    const backtrackDir = getInverseDir(this.direction)
    for (const direction of directions) {
      // prevent backtracking
      if (direction === backtrackDir) continue
      // if moving in the same direction, prevent moving too far at once
      if (direction === this.direction) {
        if (this.moveCount >= Node.maxMoveDist) continue
        moveCount = this.moveCount + 1
      }
      // if changing direction, prevent changing before moving minimum amount
      else {
        if (this.moveCount < Node.minMoveDist) continue
        moveCount = 1
      }
      const pos = offsetPos(this.pos, direction)
      // prevent OOB
      if (pos.x < 0 || pos.y < 0 || pos.y >= Node.gridHeight || pos.x >= Node.gridWidth)
        continue

      // check if we have seen this before creating it
      const key = `${pos.y}${direction}${pos.x}:${moveCount}`
      if (Node.seen.has(key)) continue
      Node.seen.add(key)

      const cost = Node.grid[pos.y][pos.x]

      out.push(new Node(pos, cost, this.totalCost, direction, moveCount, this))
    }
    return out
  }

  chain(): Node[] {
    if (!this.parent)
      return [this]
    return [...this.parent.chain(), this]
  }

  pathPretty() {
    const displayGrid: (string | number)[][] = _.cloneDeep(Node.grid)
    const chain = this.chain().slice(1)
    for (const { pos, direction } of chain)
      displayGrid[pos.y][pos.x] = `\x1B[22m${dirToArr(direction)}\x1B[2m`

    console.log(`\x1B[2m${displayGrid.map(line => line.join('')).join('\n\x1B[2m')}\x1B[0m`)
  }

  key() {
    return `${this.pos.y}${this.direction}${this.pos.x}:${this.moveCount}`
  }
}

function lowestSumPath(): number {
  const targetY = Node.gridHeight - 1
  const targetX = Node.gridWidth - 1

  const queue: Node[] = []
  queue.push(new Node({ x: 0, y: 0 }, 0, 0, 'e', 0))

  let minCost = Number.POSITIVE_INFINITY
  let bestPath: Node
  while (!_.isEmpty(queue)) {
    const currentNode = queue.shift() as Node
    const { pos, totalCost } = currentNode

    if (pos.x === targetX && pos.y === targetY && totalCost < minCost) {
      minCost = totalCost
      bestPath = currentNode
      continue
    }

    // add connections to this node to the queue
    // (puts them where they need to be so its already sorted)
    for (const connection of currentNode.getConnections())
      queue.splice(_.sortedIndexBy(queue, connection, 'totalCost'), 0, connection)
  }
  bestPath!.pathPretty()

  return minCost
}

export function partOne(input: string): number {
  Node.initNode(input.split('\n').map(a => a.split('').map(Number)), 0, 3)
  return lowestSumPath()
}

export function partTwo(input: string): number {
  Node.initNode(input.split('\n').map(a => a.split('').map(Number)), 4, 10)
  return lowestSumPath()
}
