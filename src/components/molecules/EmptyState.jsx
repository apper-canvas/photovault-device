import ApperIcon from '@/components/ApperIcon'
import Text from '@/components/atoms/Text'
import ToggleButton from '@/components/atoms/ToggleButton'

const EmptyState = ({ onUploadClick }) => {
  return (
    <div className="text-center py-16">
      <ApperIcon name="Images" size={64} className="text-surface-300 dark:text-surface-600 mx-auto mb-4" />
      <Text as="h3" className="text-lg font-medium text-surface-900 dark:text-white mb-2">
        No photos yet
      </Text>
      <Text className="text-surface-500 dark:text-surface-400 mb-6">
        Upload your first photos to get started
      </Text>
      <ToggleButton onClick={onUploadClick} className="inline-flex">
        <ApperIcon name="Upload" size={20} />
        <span>Upload Photos</span>
      </ToggleButton>
    </div>
  )
}

export default EmptyState