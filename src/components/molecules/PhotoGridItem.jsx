import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Checkbox from '@/components/atoms/Checkbox'
import Text from '@/components/atoms/Text'

const PhotoGridItem = ({ photo, index, selected, onToggleSelection, onDeletePhoto, onPhotoClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative photo-item bg-white dark:bg-surface-800 material-elevation-1 group"
    >
      <img
        src={photo.thumbnailUrl || photo.url}
        alt={photo.name || 'Photo'}
        className="w-full h-full object-cover"
        onClick={() => onPhotoClick(photo)}
        loading="lazy"
      />
      
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Checkbox 
          checked={selected} 
          onClick={(e) => {
            e.stopPropagation()
            onToggleSelection(photo.id)
          }} 
        />
      </div>

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (confirm('Are you sure you want to delete this photo?')) {
              onDeletePhoto(photo.id)
            }
          }}
          className="p-1 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-70 transition-colors"
        >
          <ApperIcon name="Trash2" size={14} />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <Text className="text-white text-sm font-medium truncate">
          {photo.name || 'Untitled'}
        </Text>
<Text className="text-gray-300 text-xs">
          {photo.uploadedAt && format(new Date(photo.uploadedAt), 'MMM d, yyyy')}
          {photo.size && ` • ${Math.round(photo.size / 1024)} KB`}
          {photo.location && ` • ${photo.location}`}
        </Text>
      </div>
    </motion.div>
  )
}

export default PhotoGridItem