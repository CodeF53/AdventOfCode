// https://adventofcode.com/2023/day/5

function processInput(input: string): { seeds: number[], sections: string[] } {
  const sections = input.split('\n\n')
  // remove first line and process it into seeds
  const seeds = sections.shift()!.split(': ')[1].split(' ').map(Number)

  return { seeds, sections }
}

function convertStep(ids: number[], section: string): number[] {
  const outIds: number[] = []

  const maps = section.split('\n')
  maps.shift()
  maps.forEach((map) => {
    const [destinationMin, sourceMin, rangeLength] = map.split(' ').map(Number)
    const sourceMax = sourceMin + rangeLength - 1

    // take ids to convert out of source id array
    const idsToConvert = _.remove(ids, id => id >= sourceMin && id <= sourceMax)

    while (idsToConvert.length > 0) {
      const id = idsToConvert.pop()!
      outIds.push(destinationMin + (id - sourceMin))
    }
  })
  outIds.push(...ids)

  return outIds
}

export function partOne(input: string): number {
  const { seeds, sections } = processInput(input)

  let shit = seeds
  sections.forEach(section => shit = convertStep(shit, section))

  return _.min(shit)!
}

// ! this is wrong and you are supposed to find a more clever way to get part 2, I just brute-forced it though.
export function partTwo(input: string): number {
  const processedInput = processInput(input)
  const { sections } = processedInput
  const seedRanges = _.chunk(processedInput.seeds, 2)

  let minPlotSize: number = Number.MAX_VALUE
  seedRanges.forEach(([min, length], rangeI) => {
    const max = min + length
    for (let i = min; i < max; i += 65536) {
      console.log(`range ${rangeI + 1}/${seedRanges.length}\t${i}/${max}\t${_.round(((i - min) / length) * 100, 2)}%`)

      let shit = _.range(i, Math.min(i + 65536, max))
      sections.forEach(section => shit = convertStep(shit, section))
      const minShit = _.min(shit)!
      if (minShit < minPlotSize)
        minPlotSize = minShit
    }
  })

  return minPlotSize
}
