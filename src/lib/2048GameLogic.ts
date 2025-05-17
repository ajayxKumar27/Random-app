// src/lib/2048GameLogic.ts

type GridType = number[][]

export const addRandomTile = (grid: number[][]): number[][] => {
  const emptyCells: { x: number; y: number }[] = []

  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      if (grid[y][x] === 0) emptyCells.push({ x, y })
    }
  }

  if (emptyCells.length === 0) return grid

  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
  const newGrid = grid.map((row) => [...row]) // deep copy

  newGrid[randomCell.y][randomCell.x] = Math.random() < 0.9 ? 2 : 4

  return newGrid
}


const slide = (row: number[]) => {
  const newRow = row.filter((n) => n !== 0)
  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2
      newRow[i + 1] = 0
    }
  }
  return [...newRow.filter((n) => n !== 0), ...Array(4 - newRow.filter((n) => n !== 0).length).fill(0)]
}

export const moveLeft = (grid: GridType): GridType => {
  return grid.map((row) => slide(row))
}

export const moveRight = (grid: GridType): GridType => {
  return grid.map((row) => slide(row.reverse()).reverse())
}

export const moveUp = (grid: GridType): GridType => {
  const newGrid = Array.from({ length: 4 }, (_, r) =>
    Array.from({ length: 4 }, (_, c) => grid[c][r])
  )
  const moved = moveLeft(newGrid)
  return Array.from({ length: 4 }, (_, r) =>
    Array.from({ length: 4 }, (_, c) => moved[c][r])
  )
}

export const moveDown = (grid: GridType): GridType => {
  const newGrid = Array.from({ length: 4 }, (_, r) =>
    Array.from({ length: 4 }, (_, c) => grid[c][r])
  )
  const moved = moveRight(newGrid)
  return Array.from({ length: 4 }, (_, r) =>
    Array.from({ length: 4 }, (_, c) => moved[c][r])
  )
}
export const canMove = (grid: number[][]): boolean => {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) return true // Empty cell available

      // Check right neighbor
      if (c < 3 && grid[r][c] === grid[r][c + 1]) return true

      // Check bottom neighbor
      if (r < 3 && grid[r][c] === grid[r + 1][c]) return true
    }
  }
  return false
}