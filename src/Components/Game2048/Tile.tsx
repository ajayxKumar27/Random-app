import { motion } from 'framer-motion'
import clsx from 'classnames'

interface TileProps {
  value: number
}

const getTileColor = (val: number): string => {
  const colors: Record<number, string> = {
    0: 'bg-gray-800',
    2: 'bg-yellow-100 text-gray-900',
    4: 'bg-yellow-200 text-gray-900',
    8: 'bg-orange-400 text-white shadow-lg',
    16: 'bg-orange-500 text-white shadow-lg',
    32: 'bg-red-500 text-white shadow-lg',
    64: 'bg-red-600 text-white shadow-lg',
    128: 'bg-green-400 text-white shadow-lg',
    256: 'bg-green-500 text-white shadow-lg',
    512: 'bg-blue-400 text-white shadow-lg',
    1024: 'bg-blue-500 text-white shadow-lg',
    2048: 'bg-purple-600 text-white shadow-xl',
  }
  return colors[val] || 'bg-gray-700 text-white'
}

const Tile: React.FC<TileProps> = ({ value }) => {
  return (
    <motion.div
      className={clsx(
        'w-full aspect-square',  // fill container cell & keep square
        'flex items-center justify-center',
        'font-extrabold text-xl sm:text-2xl md:text-3xl',  // scalable font size
        'rounded-lg shadow-inner select-none',
        getTileColor(value)
      )}
      layout
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      aria-label={value !== 0 ? value.toString() : 'empty'}
      role="gridcell"
    >
      {value !== 0 ? value : ''}
    </motion.div>

  )
}

export default Tile
