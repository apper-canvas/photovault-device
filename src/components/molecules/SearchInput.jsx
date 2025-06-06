import ApperIcon from '@/components/ApperIcon'
import Input from '@/components/atoms/Input'

const SearchInput = ({ searchTerm, onSearchChange, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <ApperIcon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
      <Input
        placeholder="Search photos..."
        value={searchTerm}
        onChange={onSearchChange}
        className="w-full"
      />
    </div>
  )
}

export default SearchInput