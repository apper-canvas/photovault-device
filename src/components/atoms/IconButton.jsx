import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const IconButton = ({ 
  iconName, 
  size = 20, 
  onClick, 
  className = '', 
  children, 
  initial, 
  animate, 
  transition, 
  asMotion = false, 
  ...props 
}) => {
  const Component = asMotion ? motion.button : 'button'

  return (
    <Component
      onClick={onClick}
      className={`p-2 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors ${className}`}
      initial={initial}
      animate={animate}
      transition={transition}
      {...props}
    >
      <ApperIcon name={iconName} size={size} />
      {children}
    </Component>
  )
}

export default IconButton