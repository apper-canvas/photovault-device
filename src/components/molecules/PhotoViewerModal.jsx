import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Text from '@/components/atoms/Text'

const PhotoViewerModal = ({ photo, onClose }) => {
  if (!photo) return null

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={photo.url}
              alt={photo.name}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg">
              <Text as="h3" className="font-medium">
                {photo.name}
              </Text>
              <Text className="text-sm text-gray-300">
                {photo.takenAt && format(new Date(photo.takenAt), 'MMM d, yyyy')}
              </Text>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PhotoViewerModal