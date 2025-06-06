import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import UploadZone from '@/components/molecules/UploadZone'
import Text from '@/components/atoms/Text'

const UploadModal = ({ showUpload, onCloseUpload, onFilesSelected, uploading, uploadProgress }) => {
  if (!showUpload) return null

  return (
    <AnimatePresence>
      {showUpload && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onCloseUpload}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-surface-800 rounded-2xl p-6 max-w-md w-full material-elevation-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <Text as="h2" className="text-lg font-medium text-surface-900 dark:text-white">
                Upload Photos
              </Text>
              <button
                onClick={onCloseUpload}
                className="p-1 text-surface-400 hover:text-surface-600 rounded"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <UploadZone
              onFilesSelected={onFilesSelected}
              uploading={uploading}
              uploadProgress={uploadProgress}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default UploadModal