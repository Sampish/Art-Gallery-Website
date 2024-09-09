const path = require('path')

const express = require('express')
const router = express.Router()
// const fs = require('fs')

const {
  isDataFileNotPresent,
  findHighestId,
  readFileAsJsonString,
  updateArtworkData
} = require('../utils/util')

/* GET home page. */
router.get('/get-all-art-work', async function (req, res, next) {
  try {
    const filePath = path.join(__dirname, '../data/data.json')
    const artistFilePath = path.join(__dirname, '../data/data2.json')
    const artworkData = await readFileAsJsonString(filePath)
    const artistData = await readFileAsJsonString(artistFilePath)

    if (!artworkData || !artistData) {
      throw new Error('Error reading data file')
    }

    const artistMap = new Map()

    artistData.forEach(artist => {
      artistMap.set(artist.artistId, artist.name)
    })

    const artWorkWithArtistName = artworkData.map(artWork => {
      const artistName = artistMap.get(artWork.artistId)
      return { ...artWork, artistName }
    })

    res.json(artWorkWithArtistName)
  } catch (error) {
    console.error()
    res.status(500).send('Data File Reading Error')
  }
})

router.get('/get-all-art-work/:artistId', async function (req, res, next) {
  try {
    const artistId = parseInt(req.params.artistId)
    const filePath = path.join(__dirname, '../data/data.json')
    const artistFilePath = path.join(__dirname, '../data/data2.json')
    const artworkData = await readFileAsJsonString(filePath)
    const artistData = await readFileAsJsonString(artistFilePath)

    if (!artworkData) {
      throw new Error('Error reading artwork data')
    }

    const artistMap = new Map()

    artistData.forEach(artist => {
      artistMap.set(artist.artistId, artist.name)
    })

    const artistArtworks = artworkData.filter(artwork => artwork.artistId === artistId)

    const artWorkWithArtistName = artistArtworks.map(artWork => {
      const artistName = artistMap.get(artWork.artistId)
      return { ...artWork, artistName }
    })

    res.send(artWorkWithArtistName)
  } catch (error) {
    console.error(error)
    res.status(500).send('Data File Reading Error')
  }
})

/// For new artwork
router.post('/new-artwork', function (req, res) {
  const filePath = path.join(__dirname, '../data/data.json')
  let dataList = require('../data/data.json')

  const hightestId = findHighestId(dataList)
  const id = hightestId + 1
  const name = req.body.name
  const date = req.body.date
  const style = req.body.style
  const artistId = parseInt(req.body.artist)
  const url = req.body.url
  const newArtwork = { id, name, date, style, artistId, url }
  const copiedArtWorkData = { ...dataList }

  if (isDataFileNotPresent(filePath)) {
    res.send('Data file not present')
  } else {
    try {
      dataList.push(newArtwork)
      updateArtworkData(filePath, dataList)
      res.send('Added a new artwork in database')
    } catch (error) {
      console.error('Error:', error)
      dataList = [...copiedArtWorkData]
      res.send('Error, the data did not send and save')
    }
  }
})

module.exports = router
