import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

// pads numbers with leading 0's to get them to 2 digits, 1 => "01"
// used for file names of solutions and inputs to ensure proper ordering
export const padDay = (day: number): string => day.toString().padStart(2, '0')

export function getAbsolutePath(relativePath: string) {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  return join(__dirname, relativePath)
}
