import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import photoService from '../services/api/photoService'
import { format } from 'date-fns'

const MainFeature = ({ 
  photos, 
  viewMode, 
  selectedPhotos, 
  onToggleSelection, 
  onDeletePhoto,
  onPhotoClick,
  showUpload,
  onCloseUpload,
  onPhotosUploaded
}) => {
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    handleFileUpload(files)
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    handleFileUpload(files)
  }

  const handleFileUpload = async (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length === 0) {
      toast.error('Please select valid image files')
      return
    }

    setUploading(true)
    const newPhotos = []

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i]
      const fileId = `upload-${Date.now()}-${i}`
      
      try {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 20) {
          setUploadProgress(prev => ({ ...prev, [fileId]: progress }))
          await new Promise(resolve => setTimeout(resolve, 100))
        }

        // Create photo object
        const photo = {
          name: file.name.replace(/\.[^/.]+$/, ""),
          url: URL.createObjectURL(file),
          thumbnailUrl: URL.createObjectURL(file),
          size: file.size,
          width: 1920, // Mock dimensions
          height: 1080,
          uploadedAt: new Date().toISOString(),
          takenAt: new Date().toISOString(),
          albumIds: []
        }

        const savedPhoto = await photoService.create(photo)
        newPhotos.push(savedPhoto)
        
        setUploadProgress(prev => {
          const updated = { ...prev }
          delete updated[fileId]
          return updated
        })

      } catch (error) {
        toast.error(`Failed to upload ${file.name}`)
        setUploadProgress(prev => {
          const updated = { ...prev }
          delete updated[fileId]
          return updated
        })
      }
    }

    setUploading(false)
    onPhotosUploaded(newPhotos)
    toast.success(`${newPhotos.length} photos uploaded successfully`)
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const PhotoGridItem = ({ photo, index }) => (
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
      
      {/* Selection Checkbox */}
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleSelection(photo.id)
          }}
          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
            selectedPhotos.includes(photo.id)
              ? 'bg-primary border-primary text-white'
              : 'bg-white border-surface-300 hover:border-primary'
          }`}
        >
          {selectedPhotos.includes(photo.id) && <ApperIcon name="Check" size={12} />}
        </button>
      </div>

      {/* Action Menu */}
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

      {/* Photo Info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-white text-sm font-medium truncate">{photo.name || 'Untitled'}</p>
        <p className="text-gray-300 text-xs">
          {photo.uploadedAt && format(new Date(photo.uploadedAt), 'MMM d, yyyy')}
        </p>
      </div>
    </motion.div>
  )

  const PhotoListItem = ({ photo, index }) => (
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
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleSelection(photo.id)
          }}
          className={`absolute -top-2 -left-2 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
            selectedPhotos.includes(photo.id)
              ? 'bg-primary border-primary text-white'
              : 'bg-white border-surface-300 opacity-0 group-hover:opacity-100'
          }`}
        >
          {selectedPhotos.includes(photo.id) && <ApperIcon name="Check" size={12} />}
        </button>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-surface-900 dark:text-white truncate">
          {photo.name || 'Untitled'}
        </h3>
        <p className="text-sm text-surface-500 dark:text-surface-400">
          {photo.uploadedAt && format(new Date(photo.uploadedAt), 'MMM d, yyyy h:mm a')}
        </p>
        <p className="text-xs text-surface-400 dark:text-surface-500">
          {photo.width && photo.height && `${photo.width} × ${photo.height}`}
          {photo.size && ` • ${Math.round(photo.size / 1024)} KB`}
        </p>
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

  const EmptyState = () => (
    <div className="text-center py-16">
      <ApperIcon name="Images" size={64} className="text-surface-300 dark:text-surface-600 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-2">No photos yet</h3>
      <p className="text-surface-500 dark:text-surface-400 mb-6">
        Upload your first photos to get started
      </p>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
      >
        <ApperIcon name="Upload" size={20} />
        <span>Upload Photos</span>
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Upload Modal */}
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
                <h2 className="text-lg font-medium text-surface-900 dark:text-white">Upload Photos</h2>
                <button
                  onClick={onCloseUpload}
                  className="p-1 text-surface-400 hover:text-surface-600 rounded"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              <div
                className={`upload-zone p-8 text-center transition-all ${dragOver ? 'drag-over' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <ApperIcon name="Upload" size={32} className="text-surface-400 mx-auto mb-3" />
                <p className="text-surface-600 dark:text-surface-400 mb-2">
                  Drag and drop photos here
                </p>
                <p className="text-sm text-surface-500 dark:text-surface-500 mb-4">
                  or click to browse
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Select Files'}
                </button>
              </div>

              {/* Upload Progress */}
              {Object.keys(uploadProgress).length > 0 && (
                <div className="mt-4 space-y-2">
                  {Object.entries(uploadProgress).map(([fileId, progress]) => (
                    <div key={fileId} className="flex items-center space-x-3">
                      <div className="flex-1 bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-surface-500">{progress}%</span>
                    </div>
                  ))}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photos Display */}
      {photos.length === 0 ? (
        <EmptyState />
      ) : (
        <div className={viewMode === 'grid' ? 'photo-grid' : 'space-y-3'}>
          {photos.map((photo, index) => 
            viewMode === 'grid' ? (
              <PhotoGridItem key={photo.id} photo={photo} index={index} />
            ) : (
              <PhotoListItem key={photo.id} photo={photo} index={index} />
            )
          )}
        </div>
      )}
    </div>
  )
}

export default MainFeature