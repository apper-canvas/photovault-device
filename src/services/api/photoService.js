import photoData from '../mockData/photo.json'

// Simulate API delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory storage
let photos = [...photoData]

const photoService = {
  async getAll() {
    await delay(300)
    return [...photos]
  },

  async getById(id) {
    await delay(200)
    const photo = photos.find(p => p.id === id)
    return photo ? { ...photo } : null
  },

  async create(photoData) {
    await delay(400)
    const newPhoto = {
      id: Date.now().toString(),
      ...photoData,
      uploadedAt: new Date().toISOString()
    }
    photos.push(newPhoto)
    return { ...newPhoto }
  },

  async update(id, updateData) {
    await delay(350)
    const index = photos.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Photo not found')
    }
    photos[index] = { ...photos[index], ...updateData }
    return { ...photos[index] }
  },

  async delete(id) {
    await delay(250)
    const index = photos.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Photo not found')
    }
    const deletedPhoto = photos.splice(index, 1)[0]
    return { ...deletedPhoto }
  },

  async getByAlbum(albumId) {
    await delay(300)
    return photos.filter(p => p.albumIds?.includes(albumId)).map(p => ({ ...p }))
  },

  async search(term) {
    await delay(250)
    const searchTerm = term.toLowerCase()
    return photos.filter(p => 
      p.name?.toLowerCase().includes(searchTerm) ||
      p.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    ).map(p => ({ ...p }))
  }
}

export default photoService