import { motion } from 'framer-motion'
import clsx from 'classnames'

interface TileProps {
  value: number
}

const getTileColor = (val: number): string => {
  const colors: Record<number, string> = {
    0: 'bg-white', // clean white for empty
    2: 'bg-sky-100 text-sky-900',
    4: 'bg-sky-200 text-sky-900',
    8: 'bg-lavender-200 text-purple-900 shadow-sm',
    16: 'bg-lavender-300 text-purple-900 shadow-sm',
    32: 'bg-purple-300 text-purple-800 shadow-md',
    64: 'bg-purple-400 text-purple-800 shadow-md',
    128: 'bg-indigo-300 text-indigo-900 shadow-lg',
    256: 'bg-indigo-400 text-indigo-900 shadow-lg',
    512: 'bg-blue-300 text-blue-900 shadow-lg',
    1024: 'bg-blue-400 text-blue-900 shadow-lg',
    2048: 'bg-violet-500 text-white shadow-xl',
  }
  return colors[val] || 'bg-sky-200 text-sky-900'
}

const Tile: React.FC<TileProps> = ({ value }) => {
  return (
    <motion.div
      className={clsx(
        'w-full aspect-square',
        'flex items-center justify-center',
        'font-extrabold text-xl sm:text-2xl md:text-3xl',
        'rounded-lg select-none',
        'border border-gray-200',
        getTileColor(value)
      )}
      layout
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      aria-label={value !== 0 ? value.toString() : 'empty'}
      role="gridcell"
    >
      {value !== 0 ? value : ''}
    </motion.div>
  )
}

export default Tile
