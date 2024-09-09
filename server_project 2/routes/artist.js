const express = require('express')
const router = express.Router()
const path = require('path')

const {
  isDataFileNotPresent,
  findHighestId,
  readFileAsJsonString,
  updateArtworkData
} = require('../utils/util')

router.get('/get-all-artist', function (req, res, next) {
  const filePath = path.join(__dirname, '../data/data2.json')
  readFileAsJsonString(filePath)
    .then(result => {
      if (result === false) {
        res.json('Error reading the data')
      } else {
        res.json(result)
      }
    })
})

router.post('/new-artist', function (req, res) {
  const filePath = path.join(__dirname, '../data/data2.json')
  let dataList = require('../data/data2.json')

  const hightestId = findHighestId(dataList)
  const id = hightestId + 1
  const name = req.body.name
  const birth = req.body.birth
  const death = req.body.death
  const newArtist = { id, name, birth, death }
  const copiedArtistsData = { ...dataList }

  if (isDataFileNotPresent(filePath)) {
    res.send('Data file not present')
  } else {
    try {
      dataList.push(newArtist)
      updateArtworkData(filePath, dataList)
      res.send('Added a new artist in database')
    } catch (error) {
      console.error('Error:', error)
      dataList = [...copiedArtistsData]
      res.send('Error, the artist data did not send and save')
    }
  }
})

module.exports = router
