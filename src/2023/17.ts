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
  totalCost: number
  distance: number
  constructor(grid: number[][], public pos: Pos, public cost: number, public pathCost: number, public direction: Direction, public moveCount: number, public parent?: Node) {
    this.totalCost = cost + pathCost
    const rows = grid.length
    const cols = grid[0].length
    this.distance = (cols - pos.x) + (rows - pos.y)
  }

  getConnections(grid: number[][]): Node[] {
    const out: Node[] = []
    let moveCount = 1
    const backtrackDir = getInverseDir(this.direction)
    for (const direction of directions) {
      // prevent backtracking
      if (direction === backtrackDir) continue
      // prevent moving too far at once
      if (direction === this.direction) {
        if (this.moveCount >= 3) continue
        moveCount = this.moveCount + 1
      }
      else {
        moveCount = 1
      }
      const pos = offsetPos(this.pos, direction)
      // prevent OOB
      if (pos.x < 0 || pos.y < 0 || pos.y >= grid.length || pos.x >= grid[0].length)
        continue
      const cost = grid[pos.y][pos.x]
      out.push(new Node(grid, pos, cost, this.totalCost, direction, moveCount, this))
    }
    return out
  }

  chain(): Node[] {
    if (!this.parent)
      return [this]
    return [this, ...this.parent.chain()]
  }

  pathPretty(grid: number[][]) {
    const displayGrid: (string | number)[][] = _.cloneDeep(grid)
    const chain = this.chain().reverse().slice(1)
    for (const { pos, direction } of chain)
      displayGrid[pos.y][pos.x] = `\x1B[22m${dirToArr(direction)}\x1B[2m`

    console.log(`\x1B[2m${displayGrid.map(line => line.join('')).join('\n\x1B[2m')}\x1B[0m`)
  }

  key() {
    return `${this.pos.y}${this.direction}${this.pos.x}:${this.moveCount}`
  }
}

function lowestSumPath(grid: number[][]): number {
  const targetY = grid.length - 1
  const targetX = grid[0].length - 1
  const seen = new Set<string>()

  const queue: Node[] = []
  queue.push(new Node(grid, { x: 0, y: 0 }, 0, 0, 'e', 0))

  let minCost = Number.POSITIVE_INFINITY
  let bestPath: Node
  while (!_.isEmpty(queue)) {
    const currentNode = queue.shift() as Node
    const { pos, totalCost } = currentNode

    const key = currentNode.key()
    if (seen.has(key)) continue
    seen.add(key)

    if (pos.x === targetX && pos.y === targetY && totalCost < minCost) {
      minCost = totalCost
      bestPath = currentNode
      continue
    }

    // add connections to this node to the queue
    // (puts them where they need to be so its already sorted)
    for (const connection of currentNode.getConnections(grid))
      queue.splice(_.sortedIndexBy(queue, connection, 'totalCost'), 0, connection)
  }
  bestPath!.pathPretty(grid)
  return minCost
}

export function partOne(input: string): number {
  // ! Test passes, 798 is too high
  const grid = input.split('\n').map(a => a.split('').map(Number))
  return lowestSumPath(grid)
}

export function partTwo(input: string): number {
  // const grid = input.split('\n').map(a => a.split('').map(Number))
  // return lowestSumPath(grid)
  return -1
}
