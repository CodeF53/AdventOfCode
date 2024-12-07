import { availableParallelism } from 'node:os'
import { concurrent } from '@bitair/concurrent.js'

/**
 * Creates a threaded version of a given function.
 * @param {Function} func - The original function to be executed on another thread.
 * @param {string} funcFile - The file path or URL of the module containing the original function. `import.meta.url` in most cases
 */
export function asThreaded<I extends any[], O>(func: (...args: I) => O, funcFile: string): (...args: I) => Promise<O> {
  concurrent.config({ maxThreads: availableParallelism() })
  const concurrentThis = concurrent.import(funcFile)

  return async function (...args: I): Promise<O> {
    return ((await concurrentThis.load() as Record<string, Function>)[func.name])(...args) as Promise<O>
  }
}

export function arrayProduct(array: number[]): number {
  return array.reduce((a, b) => a * b, 1)
}

// https://cp-algorithms.com/geometry/area-of-simple-polygon.html
export function getArea(path: Pos[], borderScale: number): number {
  let res = 0

  for (let i = 0; i < path.length; i++) {
    const p = i > 0 ? path[i - 1] : path[path.length - 1]
    const q = path[i]
    // area from the interior
    res += (p.x - q.x) * (p.y + q.y)
    // area of the border tiles
    if (borderScale !== 0) {
      res += Math.abs(p.x - q.x) * borderScale
      res += Math.abs(p.y - q.y) * borderScale
    }
  }
  return (Math.abs(res) / 2) + 1
}

export const directions = ['n', 's', 'e', 'w'] as const
export type Direction = typeof directions[number]
export const diagonals = ['ul', 'ur', 'll', 'lr'] as const
export type Diagonal = typeof diagonals[number]
export const dirDiags: (Direction | Diagonal)[] = [...directions, ...diagonals] as const
export type DirDiag = Direction | Diagonal
export interface Pos {
  x: number
  y: number
}

export function getInverseDir(dir: DirDiag): DirDiag {
  switch (dir) {
    case 'n': return 's'
    case 's': return 'n'
    case 'e': return 'w'
    case 'w': return 'e'
    case 'ul': return 'lr'
    case 'ur': return 'll'
    case 'll': return 'ur'
    case 'lr': return 'ul'
  }
}

export function offsetPos(origin: Pos, dir: DirDiag, amount: number = 1): Pos {
  switch (dir) {
    case 'n': return { x: origin.x, y: origin.y - amount }
    case 's': return { x: origin.x, y: origin.y + amount }
    case 'e': return { x: origin.x + amount, y: origin.y }
    case 'w': return { x: origin.x - amount, y: origin.y }
    case 'ul': return { x: origin.x - 1, y: origin.y - 1 }
    case 'ur': return { x: origin.x + 1, y: origin.y - 1 }
    case 'll': return { x: origin.x - 1, y: origin.y + 1 }
    case 'lr': return { x: origin.x + 1, y: origin.y + 1 }
  }
}

export function rotate90<T extends any[]>(grid: T[]): T[] {
  return _.zip(...grid).map(row => _.reverse(row) as T)
}

// https://www.geeksforgeeks.org/lcm-of-given-array-elements/ simplified to use reduce
export function lcm(arr: number[]): number {
  return arr.reduce((acc, n) => (acc * n) / gcd(acc, n))
}
export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

export function posOOB(pos: Pos, grid: string[] | any[][]): boolean {
  if (pos.x < 0 || pos.y < 0 || pos.x >= grid[0].length || pos.y >= grid.length)
    return true
  return false
}
