import AlbumSidebarItem from '@/components/molecules/AlbumSidebarItem'
import Text from '@/components/atoms/Text'

const AlbumSidebar = ({ albums, selectedAlbum, onSelectAlbum, allPhotosCount }) => {
  return (
    <aside className="w-64 bg-white dark:bg-surface-800 material-elevation-1 min-h-screen hidden lg:block">
      <div className="p-4">
        <Text as="h2" className="text-sm font-medium text-surface-600 dark:text-surface-400 uppercase tracking-wide mb-3">
          Albums
        </Text>
        <div className="space-y-1">
          <AlbumSidebarItem
            album={{ id: 'all', name: 'All Photos' }}
            selected={selectedAlbum === 'all'}
            onClick={() => onSelectAlbum('all')}
            photoCount={allPhotosCount}
          />
          
          {albums.map((album) => (
            <AlbumSidebarItem
              key={album.id}
              album={album}
              selected={selectedAlbum === album.id}
              onClick={() => onSelectAlbum(album.id)}
              photoCount={album.photoCount || 0}
            />
          ))}
        </div>
      </div>
    </aside>
  )
}

export default AlbumSidebar