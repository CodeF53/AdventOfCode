// https://adventofcode.com/2022/day/2
import _ from 'lodash'

enum Move {
  Rock = 0,
  Paper,
  Scissors,
}
enum Outcome {
  Lose = 0,
  Tie,
  Win,
}
// parse input into array of [Move, (Move|Outcome)]
function cleanInput(input: string): [Move, number][] {
  return input.split('\n').map(row => ['ABC'.indexOf(row[0]), 'XYZ'.indexOf(row[2])])
}

// The score for a single round is
// - the score for the shape you selected (1 for Rock, 2 for Paper, and 3 for Scissors)
// - plus the score for the outcome of the round (0 if you lost, 3 if the round was a draw, and 6 if you won).
function getRoundValue(playerMove: Move, outcome: Outcome) {
  return (playerMove + 1) + (outcome * 3)
}

// second column is our Move, determine round outcomes to get each round's value
export function partOne(input: string): number {
  const moveTable: [Move, Move][] = cleanInput(input)

  const roundValues = moveTable.map(([enemyMove, playerMove]) =>
    getRoundValue(playerMove, getRoundOutcome(enemyMove, playerMove)),
  )
  return _.sum(roundValues)
}
function getRoundOutcome(enemyMove: Move, playerMove: Move): Outcome {
  return (playerMove - enemyMove + 4) % 3
}

// second column is how to fix the match, determine our Move to get each round's value
export function partTwo(input: string): number {
  const moveTable: [Move, Outcome][] = cleanInput(input)

  const roundValues = moveTable.map(([enemyMove, outcome]) =>
    getRoundValue(getPlayerMove(enemyMove, outcome), outcome),
  )
  return _.sum(roundValues)
}
function getPlayerMove(enemyMove: Move, outcome: Outcome) {
  return (enemyMove + outcome + 2) % 3
}
