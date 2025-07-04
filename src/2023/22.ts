// https://adventofcode.com/2023/day/22

const axes = ['x', 'y', 'z'] as const
type Axis = typeof axes[number]
type Pos3d = Record<Axis, number>

class Brick {
  static all: Brick[] = []
  min: Pos3d
  max: Pos3d

  supportedBy: Brick[] = []
  supporting: Brick[] = []
  tree: Brick[] = []

  constructor(brickStr: string) {
    const posPairs = _.zip(...brickStr.split('~').map(posStr => posStr.split(',').map(Number)))
    this.min = _.zipObject(axes, posPairs.map(_.min)) as Pos3d
    this.max = _.zipObject(axes, posPairs.map(_.max)) as Pos3d
    Brick.all.push(this)
  }

  intersectXY(brick: Brick): boolean {
    if (this.max.x < brick.min.x || brick.max.x < this.min.x)
      return false
    if (this.max.y < brick.min.y || brick.max.y < this.min.y)
      return false
    return true
  }

  fall(fallDist: number) {
    this.min.z -= fallDist
    this.max.z -= fallDist
  }

  static gravity() {
    Brick.all = _.sortBy(Brick.all, b => b.max.z)

    for (const brickA of Brick.all) {
      const aIndex = Brick.all.indexOf(brickA)
      const toScan = Brick.all.slice(0, aIndex).reverse()

      let maxIntersectedZ = 0
      for (const brickB of toScan) {
        const bMaxZ = brickB.max.z
        if (brickA.min.z <= bMaxZ)
          continue
        if (!brickA.intersectXY(brickB))
          continue
        if (bMaxZ > maxIntersectedZ) {
          maxIntersectedZ = bMaxZ
          break
        }
      }
      const fallDist = brickA.min.z - maxIntersectedZ - 1
      brickA.fall(fallDist)
      // re-sort the array by removing brickA from it's old position and adding it to the new position where it belongs
      Brick.all.splice(aIndex, 1)
      Brick.all.splice(_.sortedIndexBy(Brick.all, brickA, b => b.max.z), 0, brickA)
    }
  }

  static genSupportInfo() {
    Brick.all = _.sortBy(Brick.all, b => b.min.z)

    for (const brickA of Brick.all) {
      const aMaxZ = brickA.max.z
      const toScan = Brick.all.slice(Brick.all.indexOf(brickA) + 1)

      for (const brickB of toScan) {
        const bMinZ = brickB.min.z
        if (aMaxZ + 1 < bMinZ)
          break
        if (!brickA.intersectXY(brickB))
          continue

        brickA.supporting.push(brickB)
        brickB.supportedBy.push(brickA)
      }
    }
  }

  safeToDestroy(): boolean {
    // does not support any other bricks
    if (this.supporting.length === 0) return true
    // stuff would fall
    for (const supported of this.supporting) {
      if (supported.supportedBy.length === 1) return false
    }
    // stuff would still be supported by something else
    return true
  }

  getTree(): Brick[] {
    if (this.tree.length > 0)
      return this.tree
    this.tree = _.uniq([this, ...this.supporting.flatMap(b => b.getTree())])
    return this.tree
  }

  chainReaction(): Brick[] {
    const tree = this.getTree()

    // remove links from tree that are externally supported
    const out: Brick[] = []
    const brokenBranches: Brick[] = []
    for (const brick of tree) {
      // exclude root from external support check
      if (brick === this) continue

      if (brick.supportedBy.some(support => !tree.includes(support))) {
        brokenBranches.push(...brick.tree)
        continue
      }

      out.push(brick)
    }
    _.pullAll(out, brokenBranches)

    return out
  }
}

function parseInput(input: string) {
  Brick.all = []
  input.split('\n').forEach(brickStr => new Brick(brickStr))
  Brick.gravity()
  Brick.genSupportInfo()
}

export function partOne(input: string): number {
  parseInput(input)
  return _.sumBy(Brick.all, b => b.safeToDestroy() ? 1 : 0)
}

export function partTwo(input: string): number {
  parseInput(input)
  return _.sumBy(Brick.all, b => b.chainReaction().length)
}
