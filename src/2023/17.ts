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
}

function lowestSumPath(grid: number[][]): number {
  const rows = grid.length
  const cols = grid[0].length
  const visited: Record<Direction, { totalCost: number, moveCount: number }[][]> = {}
  for (const direction of directions)
    visited[direction] = Array.from({ length: rows }, () => Array(cols).fill({ totalCost: Number.POSITIVE_INFINITY, moveCount: Number.POSITIVE_INFINITY }) as { totalCost: number, moveCount: number }[])

  let queue: Node[] = []
  queue.push(new Node(grid, { x: 0, y: 0 }, 0, 0, 'n', 0))

  let minCost = Number.POSITIVE_INFINITY
  let bestPath: Node
  let nodesSearched = 0
  while (!_.isEmpty(queue)) {
    nodesSearched++
    if (nodesSearched % 50000 === 0)
      console.log(`${nodesSearched} nodes searched.`)

    const currentNode = queue.shift() as Node
    const { pos, totalCost, direction, moveCount } = currentNode
    const visitCache = visited[direction][pos.y][pos.x]

    if (visitCache.totalCost <= totalCost && visitCache.moveCount <= moveCount)
      continue
    if (pos.x === cols - 1 && pos.y === rows - 1 && totalCost < minCost) {
      minCost = totalCost
      bestPath = currentNode
      console.log(`${nodesSearched} nodes searched.`)
      continue
    }

    visited[direction][pos.y][pos.x] = { totalCost, moveCount }

    queue.push(...currentNode.getConnections(grid))
    queue = _.sortBy(queue, ['totalCost'])
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
  const grid = input.split('\n').map(a => a.split('').map(Number))
  return lowestSumPath(grid)
}
