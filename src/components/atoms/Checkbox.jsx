import ApperIcon from '@/components/ApperIcon'

const Checkbox = ({ checked, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
        checked
          ? 'bg-primary border-primary text-white'
          : 'bg-white border-surface-300 hover:border-primary'
      } ${className}`}
    >
      {checked && <ApperIcon name="Check" size={12} />}
    </button>
  )
}

export default Checkbox