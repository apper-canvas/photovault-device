import { toast } from 'react-toastify'

// Initialize ApperClient
const { ApperClient } = window.ApperSDK
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

const photoService = {
  async getAll() {
    try {
      const tableName = 'photo'
      const tableFields = ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'url', 'thumbnail_url', 'size', 'width', 'height', 'uploaded_at', 'taken_at', 'album_ids']
      
      const params = {
        fields: tableFields,
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      }

      const response = await apperClient.fetchRecords(tableName, params)
      
      if (!response?.success) {
        console.error(response?.message || 'Failed to fetch photos')
        toast.error(response?.message || 'Failed to fetch photos')
        return []
      }

      // Map database fields to UI expected format
      const photos = response.data?.map(photo => ({
        id: photo.Id,
        name: photo.Name,
        tags: photo.Tags,
        owner: photo.Owner,
        url: photo.url,
        thumbnailUrl: photo.thumbnail_url,
        size: photo.size,
        width: photo.width,
        height: photo.height,
        uploadedAt: photo.uploaded_at,
        takenAt: photo.taken_at,
        albumIds: photo.album_ids?.split(',') || [],
        createdOn: photo.CreatedOn,
        createdBy: photo.CreatedBy,
        modifiedOn: photo.ModifiedOn,
        modifiedBy: photo.ModifiedBy
      })) || []

      return photos
    } catch (error) {
      console.error('Error fetching photos:', error)
      toast.error('Failed to load photos')
      return []
    }
  },

  async getById(id) {
    try {
      const tableName = 'photo'
      const tableFields = ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'url', 'thumbnail_url', 'size', 'width', 'height', 'uploaded_at', 'taken_at', 'album_ids']
      
      const params = {
        fields: tableFields
      }

      const response = await apperClient.getRecordById(tableName, id, params)
      
      if (!response?.success) {
        console.error(response?.message || 'Failed to fetch photo')
        return null
      }

      if (!response.data) {
        return null
      }

      // Map database fields to UI expected format
      const photo = {
        id: response.data.Id,
        name: response.data.Name,
        tags: response.data.Tags,
        owner: response.data.Owner,
        url: response.data.url,
        thumbnailUrl: response.data.thumbnail_url,
        size: response.data.size,
        width: response.data.width,
        height: response.data.height,
        uploadedAt: response.data.uploaded_at,
        takenAt: response.data.taken_at,
        albumIds: response.data.album_ids?.split(',') || [],
        createdOn: response.data.CreatedOn,
        createdBy: response.data.CreatedBy,
        modifiedOn: response.data.ModifiedOn,
        modifiedBy: response.data.ModifiedBy
      }

      return photo
    } catch (error) {
      console.error(`Error fetching photo with ID ${id}:`, error)
      return null
    }
  },

  async create(photoData) {
    try {
      const tableName = 'photo'
      
      // Only include Updateable fields
      const params = {
        records: [{
          Name: photoData.name,
          Tags: photoData.tags || '',
          Owner: photoData.owner || '',
          url: photoData.url,
          thumbnail_url: photoData.thumbnailUrl || photoData.url,
          size: photoData.size || 0,
          width: photoData.width || 0,
          height: photoData.height || 0,
          uploaded_at: photoData.uploadedAt || new Date().toISOString(),
          taken_at: photoData.takenAt || new Date().toISOString(),
          album_ids: Array.isArray(photoData.albumIds) ? photoData.albumIds.join(',') : ''
        }]
      }

      const response = await apperClient.createRecord(tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${failedRecords}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulRecords.length > 0) {
          const createdPhoto = successfulRecords[0].data
          toast.success('Photo created successfully')
          
          // Map database fields to UI expected format
          return {
            id: createdPhoto.Id,
            name: createdPhoto.Name,
            tags: createdPhoto.Tags,
            owner: createdPhoto.Owner,
            url: createdPhoto.url,
            thumbnailUrl: createdPhoto.thumbnail_url,
            size: createdPhoto.size,
            width: createdPhoto.width,
            height: createdPhoto.height,
            uploadedAt: createdPhoto.uploaded_at,
            takenAt: createdPhoto.taken_at,
            albumIds: createdPhoto.album_ids?.split(',') || []
          }
        }
      }
      
      throw new Error('No successful records created')
    } catch (error) {
      console.error('Error creating photo:', error)
      toast.error('Failed to create photo')
      throw error
    }
  },

  async update(id, updateData) {
    try {
      const tableName = 'photo'
      
      // Only include Updateable fields and Id
      const params = {
        records: [{
          Id: parseInt(id),
          ...(updateData.name !== undefined && { Name: updateData.name }),
          ...(updateData.tags !== undefined && { Tags: updateData.tags }),
          ...(updateData.owner !== undefined && { Owner: updateData.owner }),
          ...(updateData.url !== undefined && { url: updateData.url }),
          ...(updateData.thumbnailUrl !== undefined && { thumbnail_url: updateData.thumbnailUrl }),
          ...(updateData.size !== undefined && { size: updateData.size }),
          ...(updateData.width !== undefined && { width: updateData.width }),
          ...(updateData.height !== undefined && { height: updateData.height }),
          ...(updateData.uploadedAt !== undefined && { uploaded_at: updateData.uploadedAt }),
          ...(updateData.takenAt !== undefined && { taken_at: updateData.takenAt }),
          ...(updateData.albumIds !== undefined && { album_ids: Array.isArray(updateData.albumIds) ? updateData.albumIds.join(',') : updateData.albumIds })
        }]
      }

      const response = await apperClient.updateRecord(tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${failedUpdates}`)
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulUpdates.length > 0) {
          const updatedPhoto = successfulUpdates[0].data
          toast.success('Photo updated successfully')
          
          // Map database fields to UI expected format
          return {
            id: updatedPhoto.Id,
            name: updatedPhoto.Name,
            tags: updatedPhoto.Tags,
            owner: updatedPhoto.Owner,
            url: updatedPhoto.url,
            thumbnailUrl: updatedPhoto.thumbnail_url,
            size: updatedPhoto.size,
            width: updatedPhoto.width,
            height: updatedPhoto.height,
            uploadedAt: updatedPhoto.uploaded_at,
            takenAt: updatedPhoto.taken_at,
            albumIds: updatedPhoto.album_ids?.split(',') || []
          }
        }
      }
      
      throw new Error('No successful records updated')
    } catch (error) {
      console.error('Error updating photo:', error)
      toast.error('Failed to update photo')
      throw error
    }
  },

  async delete(id) {
    try {
      const tableName = 'photo'
      const recordIds = Array.isArray(id) ? id.map(i => parseInt(i)) : [parseInt(id)]
      
      const params = {
        RecordIds: recordIds
      }

      const response = await apperClient.deleteRecord(tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${failedDeletions}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulDeletions.length > 0) {
          toast.success(`${successfulDeletions.length} photo(s) deleted successfully`)
          return true
        }
      }
      
      return false
    } catch (error) {
      console.error('Error deleting photo:', error)
      toast.error('Failed to delete photo')
      throw error
    }
  },

  async getByAlbum(albumId) {
    try {
      const tableName = 'photo'
      const tableFields = ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'url', 'thumbnail_url', 'size', 'width', 'height', 'uploaded_at', 'taken_at', 'album_ids']
      
      const params = {
        fields: tableFields,
        where: [{
          fieldName: 'album_ids',
          operator: 'Contains',
          values: [albumId]
        }],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      }

      const response = await apperClient.fetchRecords(tableName, params)
      
      if (!response?.success) {
        console.error(response?.message || 'Failed to fetch photos by album')
        return []
      }

      // Map database fields to UI expected format
      const photos = response.data?.map(photo => ({
        id: photo.Id,
        name: photo.Name,
        tags: photo.Tags,
        owner: photo.Owner,
        url: photo.url,
        thumbnailUrl: photo.thumbnail_url,
        size: photo.size,
        width: photo.width,
        height: photo.height,
        uploadedAt: photo.uploaded_at,
        takenAt: photo.taken_at,
        albumIds: photo.album_ids?.split(',') || []
      })) || []

      return photos
    } catch (error) {
      console.error('Error fetching photos by album:', error)
      return []
    }
  },

  async search(term) {
    try {
      const tableName = 'photo'
      const tableFields = ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'url', 'thumbnail_url', 'size', 'width', 'height', 'uploaded_at', 'taken_at', 'album_ids']
      
      const params = {
        fields: tableFields,
        where: [{
          fieldName: 'Name',
          operator: 'Contains',
          values: [term]
        }],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      }

      const response = await apperClient.fetchRecords(tableName, params)
      
      if (!response?.success) {
        console.error(response?.message || 'Failed to search photos')
        return []
      }

      // Map database fields to UI expected format
      const photos = response.data?.map(photo => ({
        id: photo.Id,
        name: photo.Name,
        tags: photo.Tags,
        owner: photo.Owner,
        url: photo.url,
        thumbnailUrl: photo.thumbnail_url,
        size: photo.size,
        width: photo.width,
        height: photo.height,
        uploadedAt: photo.uploaded_at,
        takenAt: photo.taken_at,
        albumIds: photo.album_ids?.split(',') || []
      })) || []

      return photos
    } catch (error) {
      console.error('Error searching photos:', error)
      return []
    }
  }
}

export default photoService