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
