/* global bootstrap */

const artWorkUrl = 'http://localhost:5050/get-all-art-work'
const newArtwork = 'http://localhost:5050/new-artwork'
const artworkByArtistId = 'http://localhost:5050/get-all-art-work/'
const allArtist = 'http://localhost:5050/artist/get-all-artist'
// let globalData
let artData
let artistId

function fetchData () {
  fetch(artWorkUrl)
    .then(response => response.json())
    .then(data => {
      artData = data
      console.log(artData)
      displayData(artData)
    })
    .catch(error => {
      // Handle any errors
      console.error('Error:', error)
    })
}

function fetchArtist () {
  fetch(allArtist)
    .then((response) => response.json())
    .then(data => {
      console.log(data)
      const artistSelect = document.getElementById('artistSelect')
      data.forEach((artist) => {
        const option = document.createElement('option')
        option.value = artist.artistId
        option.textContent = artist.name
        artistSelect.appendChild(option)
      })
    })
    .catch(error => {
      console.error('Error fetching artists: ' + error)
    })
}

function fetchArtworkByArtist (artistId) {
  console.log('ARTIST ID----' + artistId + ' -----')
  if (!artistId) {
    fetchData()
    return
  }
  console.log('artist id: ' + artistId)
  fetch(artworkByArtistId + artistId)
    .then(response => response.json())
    .then(data => {
      console.log('arttist art works')
      console.log(data)
      artData = data
      displayData(data)
    })
    .catch(error => {
      console.error('Error fetching artwork by artist id: ' + error)
    })
}

function displayData (data) {
  const container = document.getElementById('art-data-container')
  container.innerHTML = ''
  data.forEach(item => {
    const div = document.createElement('div')
    div.className = 'card m-2'
    div.style.width = '18rem'
    div.innerHTML = ` 
      <img src="${item.url}" alt="" class="card-img-top">
      <div class="card-body">
        <h2>${item.name}</h2>
        <p>${item.artistName}</p>
      </div>
    `

    // Adding an event listener to the image
    div.querySelector('.card-img-top').addEventListener('click', function () {
      const modalBody = document.querySelector('#imageModal .modal-body')
      modalBody.innerHTML = `
        <div class="row">
          <div class="col-md-6">
            <img src="${item.url}" class="img-fluid mb-3" alt="Responsive image">
          </div>
          <div class="col-md-6">
            <h5>${item.name}</h5>
            <p>Date: ${item.date}</p>
            <p>Style: ${item.style}</p>
            <p>Artist: ${item.artistName}</p>
          </div>
        </div>
      ` // Adjust modal content to display image on the left and text on the right

      const modal = new bootstrap.Modal(document.getElementById('imageModal'))
      modal.show()
    })

    container.appendChild(div)
  })
}

fetchArtist()

fetchArtworkByArtist(artistId)
document.getElementById('artistSelect').addEventListener('change', function (e) {
  const id = e.target.value
  console.log('artist id -->' + id)
  if (id) {
    // fetchArtworkByArtist(artistId);
    // fetchArtworkByArtist(id)
    artistId = id
    fetchArtworkByArtist(artistId)
  } else {
    fetchData()
    document.getElementById('art-data-container').innerHTML = ''
  }
})

// POSTs the entity to the Server
function postEntity (entity) {
  fetch(newArtwork, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(entity)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to post entity')
      }
      return response.json()
    })
    .then(data => {
      console.log('Entity posted successfully:', data)
    })
    .catch(error => {
      console.error('Error posting entity:', error)
    })
}

const form = document.getElementById('createForm')
form.addEventListener('submit', function (event) {
  event.preventDefault()

  // Create New entity object that will be put into the database
  const entity = {
    name: form.name.value,
    date: form.date.value,
    style: form.style.value,
    artist: form.artist.value,
    url: form.url.value
  }
  console.log(entity)

  // Calls the Post Entity function to send it to the server
  postEntity(entity)
})


