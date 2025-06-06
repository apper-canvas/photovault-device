import TopAppBar from '@/components/organisms/TopAppBar'
import AlbumSidebar from '@/components/organisms/AlbumSidebar'
import FeatureSection from '@/components/organisms/FeatureSection'
import PhotoViewerModal from '@/components/molecules/PhotoViewerModal'
import ApperIcon from '@/components/ApperIcon'
import ToggleButton from '@/components/atoms/ToggleButton'

const HomePageTemplate = ({
  // App Bar props
  searchTerm,
  onSearchChange,
  selectedPhotosCount,
  onDeleteSelected,
  viewMode,
  onToggleViewMode,
  darkMode,
  onToggleDarkMode,
  onShowUpload,
  // Sidebar props
  albums,
  selectedAlbum,
  onSelectAlbum,
  allPhotosCount,
  // Main content props
  filteredPhotos,
  onTogglePhotoSelection,
  onDeletePhoto,
  showUpload,
  onCloseUpload,
  onPhotosUploaded,
  // Photo Viewer props
  selectedPhoto,
  onClosePhotoViewer,
}) => {
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 transition-colors">
      <TopAppBar
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        selectedPhotosCount={selectedPhotosCount}
        onDeleteSelected={onDeleteSelected}
        viewMode={viewMode}
        onToggleViewMode={onToggleViewMode}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
        onUploadClick={onShowUpload}
      />

      <div className="flex">
        <AlbumSidebar
          albums={albums}
          selectedAlbum={selectedAlbum}
          onSelectAlbum={onSelectAlbum}
          allPhotosCount={allPhotosCount}
        />

        <main className="flex-1 p-4 lg:p-6">
          <FeatureSection
            photos={filteredPhotos}
            viewMode={viewMode}
            selectedPhotos={selectedPhotosCount > 0 ? true : false} 
            // This is a boolean prop to indicate if any photos are selected for styling
            onToggleSelection={onTogglePhotoSelection}
            onDeletePhoto={onDeletePhoto}
            onPhotoClick={onClosePhotoViewer} // Renamed to clarify usage as opening the viewer
            showUpload={showUpload}
            onCloseUpload={onCloseUpload}
            onPhotosUploaded={onPhotosUploaded}
          />
        </main>
      </div>

      <PhotoViewerModal 
        photo={selectedPhoto} 
        onClose={onClosePhotoViewer} 
      />

      <ToggleButton
        onClick={onShowUpload}
        className="fixed bottom-6 right-6 lg:hidden w-14 h-14 rounded-full material-elevation-3 flex items-center justify-center"
      >
        <ApperIcon name="Plus" size={24} />
      </ToggleButton>
    </div>
  )
}

export default HomePageTemplate