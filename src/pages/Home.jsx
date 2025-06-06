import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import photoService from '../services/api/photoService'
import albumService from '../services/api/albumService'
import { format } from 'date-fns'

const Home = () => {
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
    // Apply dark mode class to document
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

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-surface-600 dark:text-surface-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 transition-colors">
      {/* Top App Bar */}
      <header className="bg-white dark:bg-surface-800 material-elevation-2 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-medium text-surface-900 dark:text-white">PhotoVault</h1>
              <div className="relative hidden sm:block">
                <ApperIcon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search photos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-surface-100 dark:bg-surface-700 border-0 rounded-lg focus:ring-2 focus:ring-primary text-surface-900 dark:text-white placeholder-surface-500 w-64"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {selectedPhotos.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={handleDeleteSelected}
                  className="flex items-center space-x-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <ApperIcon name="Trash2" size={16} />
                  <span className="hidden sm:inline">Delete ({selectedPhotos.length})</span>
                </motion.button>
              )}
              
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
              >
                <ApperIcon name={viewMode === 'grid' ? 'List' : 'Grid'} size={20} />
              </button>
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
              >
                <ApperIcon name={darkMode ? 'Sun' : 'Moon'} size={20} />
              </button>
              
              <button
                onClick={() => setShowUpload(true)}
                className="flex items-center space-x-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors ripple-effect"
              >
                <ApperIcon name="Upload" size={16} />
                <span className="hidden sm:inline">Upload</span>
              </button>
            </div>
          </div>
          
          {/* Mobile Search */}
          <div className="relative mt-3 sm:hidden">
            <ApperIcon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              placeholder="Search photos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-100 dark:bg-surface-700 border-0 rounded-lg focus:ring-2 focus:ring-primary text-surface-900 dark:text-white placeholder-surface-500"
            />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-surface-800 material-elevation-1 min-h-screen hidden lg:block">
          <div className="p-4">
            <h2 className="text-sm font-medium text-surface-600 dark:text-surface-400 uppercase tracking-wide mb-3">Albums</h2>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedAlbum('all')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  selectedAlbum === 'all' 
                    ? 'bg-primary text-white' 
                    : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
                }`}
              >
                <ApperIcon name="Images" size={20} />
                <span>All Photos</span>
                <span className="ml-auto text-xs bg-surface-200 dark:bg-surface-600 px-2 py-1 rounded-full">
                  {photos.length}
                </span>
              </button>
              
              {albums.map((album) => (
                <button
                  key={album.id}
                  onClick={() => setSelectedAlbum(album.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    selectedAlbum === album.id 
                      ? 'bg-primary text-white' 
                      : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
                  }`}
                >
                  <ApperIcon name="Folder" size={20} />
                  <span className="truncate">{album.name || 'Untitled Album'}</span>
                  <span className="ml-auto text-xs bg-surface-200 dark:bg-surface-600 px-2 py-1 rounded-full">
                    {album.photoCount || 0}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          <MainFeature 
            photos={filteredPhotos}
            viewMode={viewMode}
            selectedPhotos={selectedPhotos}
            onToggleSelection={togglePhotoSelection}
            onDeletePhoto={handleDeletePhoto}
            onPhotoClick={setSelectedPhoto}
            showUpload={showUpload}
            onCloseUpload={() => setShowUpload(false)}
            onPhotosUploaded={(newPhotos) => {
              setPhotos([...photos, ...newPhotos])
              setShowUpload(false)
            }}
          />
        </main>
      </div>

      {/* Photo Viewer Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.name}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg">
                <h3 className="font-medium">{selectedPhoto.name}</h3>
                <p className="text-sm text-gray-300">
                  {selectedPhoto.takenAt && format(new Date(selectedPhoto.takenAt), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={() => setShowUpload(true)}
        className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-primary text-white rounded-full material-elevation-3 flex items-center justify-center ripple-effect hover:bg-primary-dark transition-colors"
      >
        <ApperIcon name="Plus" size={24} />
      </button>
    </div>
  )
}

export default Home