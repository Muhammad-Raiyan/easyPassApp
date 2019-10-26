var Storage = require('dom-storage')
var tollStorage = new Storage('./data/toll.json', { strict: false, ws: '  ' })
var tollData = null

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

function addTollCrossing () {

}

function updateTollFare () {

}

function initTollCrossing () {
  tollData = tollStorage
  console.log(tollData)
}

function saveTollCrossing () {

}
