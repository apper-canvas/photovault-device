import { useRef, useState } from 'react'
import ApperIcon from '@/components/ApperIcon'
import ToggleButton from '@/components/atoms/ToggleButton'
import Text from '@/components/atoms/Text'

const UploadZone = ({ onFilesSelected, uploading, uploadProgress }) => {
  const [dragOver, setDragOver] = useState(false)
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
    onFilesSelected(files)
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    onFilesSelected(files)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <div
        className={`upload-zone p-8 text-center transition-all ${dragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <ApperIcon name="Upload" size={32} className="text-surface-400 mx-auto mb-3" />
        <Text className="text-surface-600 dark:text-surface-400 mb-2">
          Drag and drop photos here
        </Text>
        <Text className="text-sm text-surface-500 dark:text-surface-500 mb-4">
          or click to browse
        </Text>
        <ToggleButton
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Select Files'}
        </ToggleButton>
      </div>

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
    </>
  )
}

export default UploadZone