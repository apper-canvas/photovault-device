import { Link } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center">
      <div className="text-center">
        <ApperIcon name="ImageOff" size={64} className="text-surface-400 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-surface-900 dark:text-white mb-4">404</h1>
        <p className="text-surface-600 dark:text-surface-400 mb-8 max-w-md">
          The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <ApperIcon name="Home" size={20} />
          <span>Back to Gallery</span>
        </Link>
      </div>
    </div>
  )
}

export default NotFound