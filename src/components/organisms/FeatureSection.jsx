import { useState, useRef } from 'react'
import { toast } from 'react-toastify'
import photoService from '@/services/api/photoService'
import PhotoGallery from '@/components/organisms/PhotoGallery'
import UploadModal from '@/components/organisms/UploadModal'
import EmptyState from '@/components/molecules/EmptyState'

const FeatureSection = ({ 
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
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  
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
  }

  return (
    <div className="space-y-6">
      <UploadModal 
        showUpload={showUpload}
        onCloseUpload={onCloseUpload}
        onFilesSelected={handleFileUpload}
        uploading={uploading}
        uploadProgress={uploadProgress}
      />

      {photos.length === 0 ? (
        <EmptyState onUploadClick={() => onCloseUpload(false)} />
      ) : (
        <PhotoGallery 
          photos={photos}
          viewMode={viewMode}
          selectedPhotos={selectedPhotos}
          onToggleSelection={onToggleSelection}
          onDeletePhoto={onDeletePhoto}
          onPhotoClick={onPhotoClick}
        />
      )}
    </div>
  )
}

export default FeatureSection