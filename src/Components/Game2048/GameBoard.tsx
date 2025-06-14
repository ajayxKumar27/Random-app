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
import { themeClasses } from '@/Constants/dummyData'

type GridType = number[][]

const STORAGE_KEY = '2048_game_grid'
const THEMES = ['teal', 'blue', 'purple', 'violet'] as const
type ThemeType = typeof THEMES[number]

const createEmptyGrid = (): GridType => Array.from({ length: 4 }, () => Array(4).fill(0))
const initializeGrid = (): GridType => addRandomTile(addRandomTile(createEmptyGrid()))

const GameBoard: React.FC = () => {
  const [grid, setGrid] = useState<GridType | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [theme, setTheme] = useState<ThemeType>('blue')

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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newGrid))
    boardRef.current?.focus()
  }

  const cycleTheme = () => {
    const currentIndex = THEMES.indexOf(theme)
    const nextTheme = THEMES[(currentIndex + 1) % THEMES.length]
    setTheme(nextTheme)
  }

  return (
    <div className={`min-h-[calc(100vh-64px)] bg-gradient-to-br ${themeClasses[theme].bg} flex flex-col items-center justify-center p-6 sm:p-8 transition-colors duration-300`}>
      <h1 className={`text-6xl md:text-7xl font-extrabold ${themeClasses[theme].text} drop-shadow-md mb-4 select-none`}>
        2048
      </h1>
      <button
          onClick={cycleTheme}
          className={`w-full sm:w-auto mt-2 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-br ${themeClasses[theme].gradientBtn} text-white font-semibold text-base sm:text-lg shadow-md hover:brightness-110 transition cursor-pointer mb-4`}
        >
          Change Theme
        </button>

      <div
        ref={boardRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative grid grid-cols-4 gap-5 bg-white rounded-3xl p-5 shadow-lg max-w-screen-sm w-full touch-none sm:max-w-md overflow-hidden"
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
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <Tile value={val} theme={theme} />
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
            <div className={`w-16 h-16 border-8 border-t-transparent ${themeClasses[theme].border} rounded-full`} />
          </motion.div>
        )}
      </div>

      {gameOver && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-8 text-3xl font-extrabold ${themeClasses[theme].shadow} drop-shadow-md select-none`}
        >
          Game Over!
        </motion.div>
      )}
        
        <button
          onClick={resetGame}
          className={`w-full sm:w-auto mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-br ${themeClasses[theme].gradientBtn} text-white font-semibold text-base sm:text-lg shadow-md hover:brightness-110 transition cursor-pointer`}
        >
          Reset Game
        </button>
      <p className={`mt-6 ${themeClasses[theme].info} text-center select-none max-w-sm tracking-wide`}>
        Use arrow keys or swipe on mobile to move the tiles.
      </p>
    </div>
  )
}

export default GameBoard
