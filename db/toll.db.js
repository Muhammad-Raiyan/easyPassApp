var Storage = require('dom-storage')
var tollStorage = new Storage('./data/toll.json', { strict: false, ws: '  ' })
var tollData = []

module.exports = {
  getAllData,
  addTollCrossing,
  updateTollFare,
  initTollCrossing,
  storeTollData
}

function getAllData () {
  return tollData
}

function addTollCrossing (data, next) {
  tollData.push(data)
  return next(true)
}

function updateTollFare (id, fare, next) {
  tollData[id].fare = fare
  return next(true)
}

function initTollCrossing () {
  var i
  for (i = 0; i < tollStorage.length; i++) {
    var temp = tollStorage.getItem(i)
    tollData[i] = temp
  }
  console.log(tollData)
}

function storeTollData () {
  console.log('storing all tag data')
  for (var key in tollData) {
    tollStorage.setItem(key, tollData[key])
  }
}
