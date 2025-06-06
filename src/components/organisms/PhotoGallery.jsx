import PhotoGridItem from '@/components/molecules/PhotoGridItem'
import PhotoListItem from '@/components/molecules/PhotoListItem'

const PhotoGallery = ({ 
  photos, 
  viewMode, 
  selectedPhotos = [], 
  onToggleSelection, 
  onDeletePhoto, 
  onPhotoClick 
}) => {
  return (
    <div className={viewMode === 'grid' ? 'photo-grid' : 'space-y-3'}>
      {photos.map((photo, index) => 
        viewMode === 'grid' ? (
          <PhotoGridItem 
            key={photo.id} 
            photo={photo} 
            index={index} 
            selected={selectedPhotos.includes(photo.id)}
            onToggleSelection={onToggleSelection}
            onDeletePhoto={onDeletePhoto}
            onPhotoClick={onPhotoClick}
          />
        ) : (
          <PhotoListItem 
            key={photo.id} 
            photo={photo} 
            index={index} 
            selected={selectedPhotos.includes(photo.id)}
            onToggleSelection={onToggleSelection}
            onDeletePhoto={onDeletePhoto}
            onPhotoClick={onPhotoClick}
          />
        )
      )}
    </div>
  )
}

export default PhotoGallery