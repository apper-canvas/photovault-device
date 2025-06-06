import { motion } from 'framer-motion'

const ToggleButton = ({ 
  onClick, 
  className = '', 
  children, 
  asMotion = false, 
  ...props 
}) => {
  const Component = asMotion ? motion.button : 'button'

  return (
    <Component
      onClick={onClick}
      className={`flex items-center space-x-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors ripple-effect ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

export default ToggleButton