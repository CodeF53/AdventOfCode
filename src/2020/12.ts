// https://adventofcode.com/2020/day/12

import { type Direction, type Pos, offsetPos } from '../utils'

function rotateShip(currentDir: Direction, angleToRotate: number): Direction {
  const currentAngle = (function () {
    switch (currentDir) {
      case 'n': return 0
      case 'e': return 90
      case 's': return 180
      case 'w': return 270
    }
  }())
  const newAngle = (currentAngle + angleToRotate + 360) % 360
  switch (newAngle) {
    case 0: return 'n'
    case 90: return 'e'
    case 180: return 's'
    case 270: return 'w'
    default: throw new Error('noncardinal rotation')
  }
}

function manhattanDist(pos: Pos): number {
  return Math.abs(pos.x) + Math.abs(pos.y)
}

export function partOne(input: string): number {
  let shipPos = { x: 0, y: 0 }
  let shipFacing: Direction = 'e'

  for (const commandStr of input.split('\n')) {
    const action = commandStr[0].toLowerCase() // lowercase because my grid lib uses lowercase cardinal dirs
    const value = Number(commandStr.slice(1))

    switch (action) {
      case 'f':
        shipPos = offsetPos(shipPos, shipFacing, value)
        continue
      case 'r':
        shipFacing = rotateShip(shipFacing, value)
        continue
      case 'l':
        shipFacing = rotateShip(shipFacing, -value)
        continue
      case 'n': case 'e': case 's': case 'w':
        shipPos = offsetPos(shipPos, action, value)
        continue
    }
  }

  return manhattanDist(shipPos)
}

function rotateWaypoint(wayPointPos: Pos, rotation: number): Pos {
  if (rotation < 0) rotation = 360 + rotation

  switch (rotation) {
    case 90:
      return { x: -wayPointPos.y, y: wayPointPos.x }
    case 180:
      return { x: -wayPointPos.x, y: -wayPointPos.y }
    case 270:
      return { x: wayPointPos.y, y: -wayPointPos.x }
    case 0: case 360:
      return wayPointPos
    default:
      throw new Error(`noncardinal rotation ${rotation}`)
  }
}

export function partTwo(input: string): number {
  const shipPos = { x: 0, y: 0 }
  let wayPointPos = { x: 10, y: -1 }

  for (const commandStr of input.split('\n')) {
    const action = commandStr[0].toLowerCase() // lowercase because my grid lib uses lowercase cardinal dirs
    const value = Number(commandStr.slice(1))

    switch (action) {
      case 'f':
        shipPos.x += wayPointPos.x * value
        shipPos.y += wayPointPos.y * value
        continue
      case 'r':
        wayPointPos = rotateWaypoint(wayPointPos, value)
        continue
      case 'l':
        wayPointPos = rotateWaypoint(wayPointPos, -value)
        continue
      case 'n': case 'e': case 's': case 'w':
        wayPointPos = offsetPos(wayPointPos, action, value)
        continue
    }
  }

  return manhattanDist(shipPos)
}
