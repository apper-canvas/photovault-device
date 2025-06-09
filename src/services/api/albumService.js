import { toast } from 'react-toastify'

// Initialize ApperClient
const { ApperClient } = window.ApperSDK
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

const albumService = {
  async getAll() {
    try {
      const tableName = 'album'
      const tableFields = ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'cover_photo_id', 'created_at', 'photo_count']
      
      const params = {
        fields: tableFields,
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      }

      const response = await apperClient.fetchRecords(tableName, params)
      
      if (!response?.success) {
        console.error(response?.message || 'Failed to fetch albums')
        toast.error(response?.message || 'Failed to fetch albums')
        return []
      }

      // Map database fields to UI expected format
      const albums = response.data?.map(album => ({
        id: album.Id,
        name: album.Name,
        tags: album.Tags,
        owner: album.Owner,
        coverPhotoId: album.cover_photo_id,
        createdAt: album.created_at || album.CreatedOn,
        photoCount: album.photo_count || 0,
        createdOn: album.CreatedOn,
        createdBy: album.CreatedBy,
        modifiedOn: album.ModifiedOn,
        modifiedBy: album.ModifiedBy
      })) || []

      return albums
    } catch (error) {
      console.error('Error fetching albums:', error)
      toast.error('Failed to load albums')
      return []
    }
  },

  async getById(id) {
    try {
      const tableName = 'album'
      const tableFields = ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'cover_photo_id', 'created_at', 'photo_count']
      
      const params = {
        fields: tableFields
      }

      const response = await apperClient.getRecordById(tableName, id, params)
      
      if (!response?.success) {
        console.error(response?.message || 'Failed to fetch album')
        return null
      }

      if (!response.data) {
        return null
      }

      // Map database fields to UI expected format
      const album = {
        id: response.data.Id,
        name: response.data.Name,
        tags: response.data.Tags,
        owner: response.data.Owner,
        coverPhotoId: response.data.cover_photo_id,
        createdAt: response.data.created_at || response.data.CreatedOn,
        photoCount: response.data.photo_count || 0,
        createdOn: response.data.CreatedOn,
        createdBy: response.data.CreatedBy,
        modifiedOn: response.data.ModifiedOn,
        modifiedBy: response.data.ModifiedBy
      }

      return album
    } catch (error) {
      console.error(`Error fetching album with ID ${id}:`, error)
      return null
    }
  },

  async create(albumData) {
    try {
      const tableName = 'album'
      
      // Only include Updateable fields
      const params = {
        records: [{
          Name: albumData.name,
          Tags: albumData.tags || '',
          Owner: albumData.owner || '',
          cover_photo_id: albumData.coverPhotoId ? parseInt(albumData.coverPhotoId) : null,
          created_at: albumData.createdAt || new Date().toISOString(),
          photo_count: albumData.photoCount || 0
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
          const createdAlbum = successfulRecords[0].data
          toast.success('Album created successfully')
          
          // Map database fields to UI expected format
          return {
            id: createdAlbum.Id,
            name: createdAlbum.Name,
            tags: createdAlbum.Tags,
            owner: createdAlbum.Owner,
            coverPhotoId: createdAlbum.cover_photo_id,
            createdAt: createdAlbum.created_at,
            photoCount: createdAlbum.photo_count || 0
          }
        }
      }
      
      throw new Error('No successful records created')
    } catch (error) {
      console.error('Error creating album:', error)
      toast.error('Failed to create album')
      throw error
    }
  },

  async update(id, updateData) {
    try {
      const tableName = 'album'
      
      // Only include Updateable fields and Id
      const params = {
        records: [{
          Id: parseInt(id),
          ...(updateData.name !== undefined && { Name: updateData.name }),
          ...(updateData.tags !== undefined && { Tags: updateData.tags }),
          ...(updateData.owner !== undefined && { Owner: updateData.owner }),
          ...(updateData.coverPhotoId !== undefined && { cover_photo_id: updateData.coverPhotoId ? parseInt(updateData.coverPhotoId) : null }),
          ...(updateData.createdAt !== undefined && { created_at: updateData.createdAt }),
          ...(updateData.photoCount !== undefined && { photo_count: updateData.photoCount })
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
          const updatedAlbum = successfulUpdates[0].data
          toast.success('Album updated successfully')
          
          // Map database fields to UI expected format
          return {
            id: updatedAlbum.Id,
            name: updatedAlbum.Name,
            tags: updatedAlbum.Tags,
            owner: updatedAlbum.Owner,
            coverPhotoId: updatedAlbum.cover_photo_id,
            createdAt: updatedAlbum.created_at,
            photoCount: updatedAlbum.photo_count || 0
          }
        }
      }
      
      throw new Error('No successful records updated')
    } catch (error) {
      console.error('Error updating album:', error)
      toast.error('Failed to update album')
      throw error
    }
  },

  async delete(id) {
    try {
      const tableName = 'album'
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
          toast.success(`${successfulDeletions.length} album(s) deleted successfully`)
          return true
        }
      }
      
      return false
    } catch (error) {
      console.error('Error deleting album:', error)
      toast.error('Failed to delete album')
      throw error
    }
  }
}

export default albumService
export default albumService