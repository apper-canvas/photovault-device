import albumData from '../mockData/album.json'

// Simulate API delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory storage
let albums = [...albumData]

const albumService = {
  async getAll() {
    await delay(250)
    return [...albums]
  },

  async getById(id) {
    await delay(200)
    const album = albums.find(a => a.id === id)
    return album ? { ...album } : null
  },

  async create(albumData) {
    await delay(400)
    const newAlbum = {
      id: Date.now().toString(),
      photoCount: 0,
      createdAt: new Date().toISOString(),
      ...albumData
    }
    albums.push(newAlbum)
    return { ...newAlbum }
  },

  async update(id, updateData) {
    await delay(350)
    const index = albums.findIndex(a => a.id === id)
    if (index === -1) {
      throw new Error('Album not found')
    }
    albums[index] = { ...albums[index], ...updateData }
    return { ...albums[index] }
  },

  async delete(id) {
    await delay(250)
    const index = albums.findIndex(a => a.id === id)
    if (index === -1) {
      throw new Error('Album not found')
    }
    const deletedAlbum = albums.splice(index, 1)[0]
    return { ...deletedAlbum }
  }
}

export default albumService