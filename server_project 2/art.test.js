// jest is a test
// describe is defined
// expect is defined
// test is defined

const request = require('supertest')
const express = require('express')
const router = require('../path_to_your_router_file') 

jest.mock('path')
jest.mock('express', () => require('jest-express'))
jest.mock('../utils/util', () => ({
  isDataFileNotPresent: jest.fn(),
  findHighestId: jest.fn(),
  readFileAsJsonString: jest.fn(),
  updateArtworkData: jest.fn()
}))

const app = express()
app.use(express.json())
app.use('/', router)

describe('GET /get-all-art-work', () => {
  test('should respond with all artwork data', async () => {
    const mockArtworks = [{ id: 1, artistId: 101, name: 'Mona Lisa' }]
    const mockArtists = [{ artistId: 101, name: 'Leonardo da Vinci' }]

    require('../utils/util').readFileAsJsonString.mockResolvedValueOnce(mockArtworks)
    require('../utils/util').readFileAsJsonString.mockResolvedValueOnce(mockArtists)

    const response = await request(app).get('/get-all-art-work')
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual([{ ...mockArtworks[0], artistName: 'Leonardo da Vinci' }])
  })

  test('should handle errors', async () => {
    require('../utils/util').readFileAsJsonString.mockRejectedValueOnce(new Error('Error reading data file'))

    const response = await request(app).get('/get-all-art-work')
    expect(response.statusCode).toBe(500)
    expect(response.text).toContain('Data File Reading Error')
  })
})

describe('GET /get-all-art-work/:artistId', () => {
  test('should respond with filtered artwork by artist', async () => {
    const mockArtworks = [{ id: 1, artistId: 101, name: 'Mona Lisa' }]
    const mockArtists = [{ artistId: 101, name: 'Leonardo da Vinci' }]

    require('../utils/util').readFileAsJsonString.mockResolvedValueOnce(mockArtworks)
    require('../utils/util').readFileAsJsonString.mockResolvedValueOnce(mockArtists)

    const response = await request(app).get('/get-all-art-work/101')
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual([{ ...mockArtworks[0], artistName: 'Leonardo da Vinci' }])
  })

  test('should handle errors', async () => {
    require('../utils/util').readFileAsJsonString.mockRejectedValueOnce(new Error('Error reading artwork data'))

    const response = await request(app).get('/get-all-art-work/101')
    expect(response.statusCode).toBe(500)
    expect(response.text).toContain('Data File Reading Error')
  })
})

describe('POST /new-artwork', () => {
  test('should add new artwork successfully', async () => {
    const newArtwork = { name: 'Starry Night', date: '1889', style: 'Post-Impressionism', artist: '102', url: 'url_here' }
    const mockDataList = [{ id: 1, name: 'Mona Lisa', artistId: 101 }]

    require('../utils/util').findHighestId.mockReturnValue(1)
    require('../utils/util').isDataFileNotPresent.mockReturnValue(false)
    require('../utils/util').updateArtworkData.mockResolvedValue()

    const response = await request(app)
      .post('/new-artwork')
      .send(newArtwork)

    expect(response.statusCode).toBe(200)
    expect(response.text).toContain('Added a new artwork in database')
  })

  test('should handle errors when adding fails', async () => {
    const newArtwork = { name: 'Starry Night', date: '1889', style: 'Post-Impressionism', artist: '102', url: 'url_here' }
    require('../utils/util').findHighestId.mockReturnValue(1)
    require('../utils/util').isDataFileNotPresent.mockReturnValue(false)
    require('../utils/util').updateArtworkData.mockRejectedValue(new Error('Failed to update'))

    const response = await request(app)
      .post('/new-artwork')
      .send(newArtwork)

    expect(response.statusCode).toBe(500)
    expect(response.text).toContain('Error, the data did not send and save')
  })
})
