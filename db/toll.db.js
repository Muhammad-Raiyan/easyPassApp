var Storage = require('dom-storage')
var tollStorage = new Storage('./data/toll.json', { strict: false, ws: '  ' })
var tollData = []

module.exports = {
  getAllData,
  addTollCrossing,
  updateTollFare,
  initTollCrossing,
  saveTollCrossing
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

function saveTollCrossing () {

}
