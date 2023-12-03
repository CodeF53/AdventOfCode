export function arrayProduct(array: number[]): number {
  return array.reduce((a, b) => a * b, 1)
}
