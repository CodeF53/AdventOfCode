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
