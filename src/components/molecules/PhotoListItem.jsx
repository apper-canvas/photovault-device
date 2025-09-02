import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Checkbox from '@/components/atoms/Checkbox'
import Text from '@/components/atoms/Text'

const PhotoListItem = ({ photo, index, selected, onToggleSelection, onDeletePhoto, onPhotoClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02 }}
      className="flex items-center space-x-4 p-4 bg-white dark:bg-surface-800 rounded-lg material-elevation-1 hover:material-elevation-2 transition-shadow cursor-pointer group"
      onClick={() => onPhotoClick(photo)}
    >
      <div className="relative">
        <img
          src={photo.thumbnailUrl || photo.url}
          alt={photo.name || 'Photo'}
          className="w-16 h-16 object-cover rounded-lg"
          loading="lazy"
        />
        <Checkbox
          checked={selected}
          onClick={(e) => {
            e.stopPropagation()
            onToggleSelection(photo.id)
          }}
          className="absolute -top-2 -left-2 opacity-0 group-hover:opacity-100"
        />
      </div>

      <div className="flex-1 min-w-0">
        <Text as="h3" className="font-medium text-surface-900 dark:text-white truncate">
          {photo.name || 'Untitled'}
        </Text>
        <Text className="text-sm text-surface-500 dark:text-surface-400">
          {photo.uploadedAt && format(new Date(photo.uploadedAt), 'MMM d, yyyy h:mm a')}
        </Text>
<Text className="text-xs text-surface-400 dark:text-surface-500">
          {photo.width && photo.height && `${photo.width} × ${photo.height}`}
          {photo.size && ` • ${Math.round(photo.size / 1024)} KB`}
          {photo.location && ` • ${photo.location}`}
        </Text>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          if (confirm('Are you sure you want to delete this photo?')) {
            onDeletePhoto(photo.id)
          }
        }}
        className="p-2 text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
      >
        <ApperIcon name="Trash2" size={16} />
      </button>
    </motion.div>
  )
}

export default PhotoListItem