import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import IconButton from '@/components/atoms/IconButton'
import ToggleButton from '@/components/atoms/ToggleButton'
import SearchInput from '@/components/molecules/SearchInput'
import Text from '@/components/atoms/Text'

const TopAppBar = ({
  searchTerm,
  onSearchChange,
  selectedPhotosCount,
  onDeleteSelected,
  viewMode,
  onToggleViewMode,
  darkMode,
  onToggleDarkMode,
  onUploadClick,
}) => {
  return (
    <header className="bg-white dark:bg-surface-800 material-elevation-2 sticky top-0 z-50">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Text as="h1" className="text-xl font-medium text-surface-900 dark:text-white">
              PhotoVault
            </Text>
            <SearchInput
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
              className="hidden sm:block w-64"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            {selectedPhotosCount > 0 && (
              <ToggleButton
                asMotion
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={onDeleteSelected}
                className="bg-red-500 hover:bg-red-600 px-3 py-2"
              >
                <ApperIcon name="Trash2" size={16} />
                <span className="hidden sm:inline">Delete ({selectedPhotosCount})</span>
              </ToggleButton>
            )}
            
            <IconButton 
              iconName={viewMode === 'grid' ? 'List' : 'Grid'} 
              size={20} 
              onClick={onToggleViewMode} 
            />
            
            <IconButton 
              iconName={darkMode ? 'Sun' : 'Moon'} 
              size={20} 
              onClick={onToggleDarkMode} 
            />
            
            <ToggleButton onClick={onUploadClick} className="hidden sm:inline-flex">
              <ApperIcon name="Upload" size={16} />
              <span>Upload</span>
            </ToggleButton>
          </div>
        </div>
        
        <SearchInput
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          className="mt-3 sm:hidden"
        />
      </div>
    </header>
  )
}

export default TopAppBar