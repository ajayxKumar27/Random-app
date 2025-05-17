'use client'
import React, { useEffect, useRef, useState } from 'react'
import Tile from './Tile'
import {
  addRandomTile,
  moveLeft,
  moveRight,
  moveUp,
  moveDown,
  canMove,
} from '@/lib/2048GameLogic'
import { AnimatePresence, motion } from 'framer-motion'

type GridType = number[][]
const STORAGE_KEY = '2048_game_grid'

const createEmptyGrid = (): GridType => Array.from({ length: 4 }, () => Array(4).fill(0))
const initializeGrid = (): GridType => addRandomTile(addRandomTile(createEmptyGrid()))

const GameBoard: React.FC = () => {
  const [grid, setGrid] = useState<GridType | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [hasMoved, setHasMoved] = useState(false)
  const boardRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedGrid = localStorage.getItem(STORAGE_KEY)
      const initialGrid = savedGrid ? (JSON.parse(savedGrid) as GridType) : initializeGrid()
      setGrid(initialGrid)
      boardRef.current?.focus()
    }
  }, [])

  useEffect(() => {
    if (!grid) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(grid))
    setGameOver(!canMove(grid))
  }, [grid])

  const handleMove = (direction: string) => {
    if (!grid || gameOver) return

    let newGrid: GridType | null = null
    if (direction === 'left') newGrid = moveLeft(grid)
    else if (direction === 'right') newGrid = moveRight(grid)
    else if (direction === 'up') newGrid = moveUp(grid)
    else if (direction === 'down') newGrid = moveDown(grid)

    if (newGrid && JSON.stringify(newGrid) !== JSON.stringify(grid)) {
      setGrid(addRandomTile(newGrid))
      setHasMoved(true)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key.includes('Arrow')) e.preventDefault()
    if (e.key === 'ArrowLeft') handleMove('left')
    if (e.key === 'ArrowRight') handleMove('right')
    if (e.key === 'ArrowUp') handleMove('up')
    if (e.key === 'ArrowDown') handleMove('down')
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStartX.current = touch.clientX
    touchStartY.current = touch.clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0]
    const dx = touch.clientX - touchStartX.current
    const dy = touch.clientY - touchStartY.current

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 30) handleMove('right')
      else if (dx < -30) handleMove('left')
    } else {
      if (dy > 30) handleMove('down')
      else if (dy < -30) handleMove('up')
    }
  }

  const resetGame = () => {
    const newGrid = initializeGrid()
    setGrid(newGrid)
    setGameOver(false)
    setHasMoved(false)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newGrid))
    boardRef.current?.focus()
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500 flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl md:text-7xl font-extrabold text-white drop-shadow-lg mb-8 select-none">
        2048
      </h1>

      <div
        ref={boardRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative grid grid-cols-4 gap-4 bg-gray-900 rounded-xl p-4 shadow-2xl max-w-screen-sm  w-full
          touch-none sm:max-w-md overflow-hidden"
        style={{ outline: 'none', aspectRatio: '1 / 1' }}
      >
        {grid ? (
          <AnimatePresence>
            {grid.flat().map((val, i) => (
              <motion.div
                key={i}
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <Tile value={val} />
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <motion.div
            className="flex items-center justify-center col-span-4 row-span-4"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
          >
            <div className="w-16 h-16 border-8 border-t-transparent border-white rounded-full" />
          </motion.div>
        )}
      </div>

      {gameOver && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-3xl font-extrabold text-red-600 drop-shadow-lg select-none"
        >
          Game Over!
        </motion.div>
      )}

      <button
        onClick={resetGame}
        className="mt-8 px-6 py-3 rounded-full bg-white text-gray-900 font-semibold text-lg shadow-lg hover:bg-yellow-400 hover:text-white transition-all duration-300 cursor-pointer"
      >
        Reset Game
      </button>

      <p className="mt-6 text-white text-center select-none max-w-sm">
        Use arrow keys or swipe on mobile to move the tiles.
      </p>
    </div>
  )
}

export default GameBoard
