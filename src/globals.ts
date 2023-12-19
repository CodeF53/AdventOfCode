import type { LoDashStatic } from 'lodash'
import lodash from 'lodash'

// make lodash global while covering TypeScript's loud sobs of "YOU CAN'T DO THAT"
// eslint-disable-next-line ts/no-unsafe-member-access
(globalThis as any)._ = lodash

declare global {
  // convince TypeScript not to scream when it sees lodash used in other files
  const _: LoDashStatic

  interface Pos {
    x: number
    y: number
  }
}
