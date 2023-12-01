// https://adventofcode.com/2022/day/7

// find the total size of all directories with size less than 100000
export function partOne(input: string): number {
  formFileStructure(input)
  const smallDirectories = Directory.all.map(directory => directory.getSize()).filter(size => size <= 100000)

  return _.sum(smallDirectories)
}

// get the size of the smallest folder you can yeet to make room for the update
export function partTwo(input: string): number {
  const root = formFileStructure(input)

  // get min space we must clear
  const totalDiskSpace = 70000000
  const totalSpaceUsed = root.getSize()
  const spaceUsedAfterUpdate = (totalSpaceUsed + 30000000)
  const spaceToClear = spaceUsedAfterUpdate - totalDiskSpace

  if (spaceToClear >= totalDiskSpace)
    return -1

  // get directories big enough to make room
  const directorySizes = Directory.all.map(directory => directory.getSize())
  const directoriesBigEnough = directorySizes.filter(size => size >= spaceToClear)
  // find the smallest one
  return _.min(directoriesBigEnough)!
}

function formFileStructure(input: string): Directory {
  const root = new Directory('/')
  let currentDirectory = root

  const commands = input.split('\n$ ').map(command => _.compact(command.split('\n')).map(a => a.split(' '))).slice(1)

  for (const aaa of commands) {
    const command = aaa[0][0]

    switch (command) {
      case 'cd': {
        const argument = aaa[0][1]
        if (argument === '..') {
          currentDirectory = currentDirectory.parent
        }
        else {
          const newDirectory = new Directory(argument, currentDirectory)
          currentDirectory = newDirectory
        }
        break
      }
      case 'ls': {
        const contents = aaa.slice(1)
        contents.forEach((item) => {
          if (item[0] !== 'dir')
            new File(item[1], Number(item[0]), currentDirectory)
        })
        break
      }
      default:
        break
    }
  }

  return root
}

class Directory {
  name: string
  parent: Directory
  children: (Directory | File)[] = []

  constructor(name: string, parent?: Directory) {
    this.name = name
    if (parent) {
      this.parent = parent
      this.parent.children.push(this)
    }
    else {
      this.parent = this
    }
    Directory.all.push(this)
  }

  getSize(): number {
    return _.sum(this.children.map(child => child.getSize()))
  }

  toString(depth = 0): string {
    const indent = ' '.repeat(depth)

    return `${indent}- ${this.name} (dir, size=${this.getSize()})\n${this.children.map((child: Directory | File) => child.toString(depth + 2)).join('\n')}`
  }

  static all: Directory[] = []
}

class File {
  name: string
  size: number

  constructor(name: string, size: number, parent: Directory) {
    this.name = name
    this.size = size

    parent.children.push(this)
  }

  getSize(): number {
    return this.size
  }

  toString(depth = 0): string {
    const indent = ' '.repeat(depth)
    return `${indent}- ${this.name} (file, size=${this.size})`
  }
}
