// https://adventofcode.com/2020/day/7

type BagMap = Map<string, Map<string, number>>

function constructBagMap(input: string): BagMap {
  // { "light red": {"bright white": 1, "muted yellow": 2}] }
  const bagMap = new Map() as BagMap

  for (const line of input.split('\n')) {
    const [, bagType, contentStr] = /^(.*?) bags contain (.*)\.$/.exec(line)!
    if (contentStr === 'no other bags') continue

    const contents = new Map<string, number>()
    contentStr.split(', ').forEach((aaa) => {
      const [, countStr, bagType] = /^(\d+) (.*?) bag/.exec(aaa)!
      contents.set(bagType, Number(countStr))
    })
    bagMap.set(bagType, contents)
  }

  return bagMap
}

function getPossibleContainers(rootBagType: string, bagMap: BagMap) {
  const containers = new Set<string>()
  const exploredBagTypes = new Set<string>()
  const bagTypesToExplore = [rootBagType]

  while (bagTypesToExplore.length > 0) {
    const bagType = bagTypesToExplore.shift()!
    exploredBagTypes.add(bagType)

    for (const [aaa, contents] of bagMap.entries()) {
      if (exploredBagTypes.has(aaa)) continue
      if (!contents.keys().toArray().includes(bagType)) continue

      containers.add(aaa)
      bagTypesToExplore.push(aaa)
    }
  }

  return containers
}

export function partOne(input: string): number {
  const bagMap = constructBagMap(input)

  return getPossibleContainers('shiny gold', bagMap).size
}

function getBagCost(rootBagType: string, bagMap: BagMap): number {
  const contents = bagMap.get(rootBagType)
  if (contents === undefined) return 0
  let cost = 0
  for (const [bagType, count] of contents.entries()) {
    cost += count
    cost += getBagCost(bagType, bagMap) * count
  }
  return cost
}

export function partTwo(input: string): number {
  const bagMap = constructBagMap(input)

  return getBagCost('shiny gold', bagMap)
}
