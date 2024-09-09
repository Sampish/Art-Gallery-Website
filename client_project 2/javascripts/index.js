// let globalData

function fetchData () {
  fetch('http://localhost:5050/get-all-art-work')
    .then(response => response.json())
    .then(data => {
    // globalData = data;
      console.log(data)
      return data;
    })
    .catch(error => {
    // Handle any errors
      console.error('Error:', error)
      throw error;
    })
}

fetchData()
