import ApperIcon from '@/components/ApperIcon'
import Text from '@/components/atoms/Text'

const AlbumSidebarItem = ({ album, selected, onClick, photoCount }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
        selected 
          ? 'bg-primary text-white' 
          : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
      }`}
    >
      <ApperIcon name={album.id === 'all' ? 'Images' : 'Folder'} size={20} />
      <Text as="span" className="truncate">
        {album.name || 'Untitled Album'}
      </Text>
      <Text as="span" className="ml-auto text-xs bg-surface-200 dark:bg-surface-600 px-2 py-1 rounded-full">
        {photoCount}
      </Text>
    </button>
  )
}

export default AlbumSidebarItem