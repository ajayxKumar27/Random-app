import { motion } from 'framer-motion'
import clsx from 'classnames'

interface TileProps {
  value: number
  theme: 'teal' | 'blue' | 'purple' | 'violet'
}

const getTileColor = (val: number, theme: TileProps['theme']): string => {
  const palette: Record<TileProps['theme'], Record<number, string>> = {
    teal: {
      0: 'bg-white',
      2: 'bg-teal-100 text-teal-900',
      4: 'bg-teal-200 text-teal-900',
      8: 'bg-teal-300 text-white',
      16: 'bg-teal-400 text-white',
      32: 'bg-teal-500 text-white',
      64: 'bg-teal-600 text-white',
      128: 'bg-teal-700 text-white',
      256: 'bg-teal-800 text-white',
      512: 'bg-teal-900 text-white',
      1024: 'bg-teal-700 text-white shadow-md',
      2048: 'bg-teal-900 text-white shadow-lg',
    },
    blue: {
      0: 'bg-white',
      2: 'bg-blue-100 text-blue-900',
      4: 'bg-blue-200 text-blue-900',
      8: 'bg-blue-300 text-white',
      16: 'bg-blue-400 text-white',
      32: 'bg-blue-500 text-white',
      64: 'bg-blue-600 text-white',
      128: 'bg-blue-700 text-white',
      256: 'bg-blue-800 text-white',
      512: 'bg-blue-900 text-white',
      1024: 'bg-blue-700 text-white shadow-md',
      2048: 'bg-blue-900 text-white shadow-lg',
    },
    purple: {
      0: 'bg-white',
      2: 'bg-purple-100 text-purple-900',
      4: 'bg-purple-200 text-purple-900',
      8: 'bg-purple-300 text-white',
      16: 'bg-purple-400 text-white',
      32: 'bg-purple-500 text-white',
      64: 'bg-purple-600 text-white',
      128: 'bg-purple-700 text-white',
      256: 'bg-purple-800 text-white',
      512: 'bg-purple-900 text-white',
      1024: 'bg-purple-700 text-white shadow-md',
      2048: 'bg-purple-900 text-white shadow-lg',
    },
    violet: {
      0: 'bg-white',
      2: 'bg-violet-100 text-violet-900',
      4: 'bg-violet-200 text-violet-900',
      8: 'bg-violet-300 text-white',
      16: 'bg-violet-400 text-white',
      32: 'bg-violet-500 text-white',
      64: 'bg-violet-600 text-white',
      128: 'bg-violet-700 text-white',
      256: 'bg-violet-800 text-white',
      512: 'bg-violet-900 text-white',
      1024: 'bg-violet-700 text-white shadow-md',
      2048: 'bg-violet-900 text-white shadow-lg',
    },
  }

  return palette[theme][val] || palette[theme][0]
}

const Tile: React.FC<TileProps> = ({ value, theme }) => {
  return (
    <motion.div
      className={clsx(
        'w-full aspect-square',
        'flex items-center justify-center',
        'font-extrabold text-xl sm:text-2xl md:text-3xl',
        'rounded-lg select-none border border-gray-100',
        getTileColor(value, theme)
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