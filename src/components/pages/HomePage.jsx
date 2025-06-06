import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import photoService from '@/services/api/photoService'
import albumService from '@/services/api/albumService'
import HomePageTemplate from '@/components/templates/HomePageTemplate'
import Loader from '@/components/atoms/Loader'
import ApperIcon from '@/components/ApperIcon'
import Text from '@/components/atoms/Text'

const HomePage = () => {
  const [photos, setPhotos] = useState([])
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedPhotos, setSelectedPhotos] = useState([])
  const [viewMode, setViewMode] = useState('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAlbum, setSelectedAlbum] = useState('all')
  const [darkMode, setDarkMode] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  useEffect(() => {
    loadData()
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const loadData = async () => {
    setLoading(true)
    try {
      const [photosResult, albumsResult] = await Promise.all([
        photoService.getAll(),
        albumService.getAll()
      ])
      setPhotos(photosResult || [])
      setAlbums(albumsResult || [])
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load photos')
    } finally {
      setLoading(false)
    }
  }

  const filteredPhotos = photos.filter(photo => {
    if (!photo) return false
    const matchesSearch = photo.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
    const matchesAlbum = selectedAlbum === 'all' || photo.albumIds?.includes(selectedAlbum) || false
    return matchesSearch && matchesAlbum
  })

  const handleDeletePhoto = async (photoId) => {
    try {
      await photoService.delete(photoId)
      setPhotos(photos.filter(p => p.id !== photoId))
      setSelectedPhotos(selectedPhotos.filter(id => id !== photoId))
      toast.success('Photo deleted successfully')
    } catch (err) {
      toast.error('Failed to delete photo')
    }
  }

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedPhotos.map(id => photoService.delete(id)))
      setPhotos(photos.filter(p => !selectedPhotos.includes(p.id)))
      setSelectedPhotos([])
      toast.success(`${selectedPhotos.length} photos deleted`)
    } catch (err) {
      toast.error('Failed to delete photos')
    }
  }

  const togglePhotoSelection = (photoId) => {
    setSelectedPhotos(prev => 
      prev.includes(photoId) 
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    )
  }

  const handlePhotosUploaded = (newPhotos) => {
    setPhotos(prevPhotos => [...prevPhotos, ...newPhotos])
    setShowUpload(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
        <Loader />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
          <Text className="text-surface-600 dark:text-surface-400">{error}</Text>
        </div>
      </div>
    )
  }

  return (
    <HomePageTemplate
      searchTerm={searchTerm}
      onSearchChange={(e) => setSearchTerm(e.target.value)}
      selectedPhotosCount={selectedPhotos.length}
      onDeleteSelected={handleDeleteSelected}
      viewMode={viewMode}
      onToggleViewMode={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
      darkMode={darkMode}
      onToggleDarkMode={() => setDarkMode(!darkMode)}
      onShowUpload={() => setShowUpload(true)}
      albums={albums}
      selectedAlbum={selectedAlbum}
      onSelectAlbum={setSelectedAlbum}
      allPhotosCount={photos.length}
      filteredPhotos={filteredPhotos}
      onTogglePhotoSelection={togglePhotoSelection}
      onDeletePhoto={handleDeletePhoto}
      showUpload={showUpload}
      onCloseUpload={() => setShowUpload(false)}
      onPhotosUploaded={handlePhotosUploaded}
      selectedPhoto={selectedPhoto}
      onClosePhotoViewer={setSelectedPhoto}
    />
  )
}

export default HomePage