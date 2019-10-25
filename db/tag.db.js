var Storage = require('dom-storage')
var easyPassStorage = new Storage('./easyPass.json', { strict: false, ws: '  ' })

module.exports = {
  assignTag,
  returnTag,
  reportTagLost
}

async function assignTag (user) {
  if (user.tag) {
    console.log('tag exists')
    return false
  }
  createTag()
  for (var key in easyPassStorage) {
    if (easyPassStorage[key]) {
      user.tag = key
      easyPassStorage.setItem(key, false)
      return true
    }
  }
}

function returnTag (user) {

}

function reportTagLost (user) {

}

async function createTag () {
  var easyPassNo = Math.floor((Math.random() * 100000) + 1)
  easyPassStorage.setItem(easyPassNo, true)
  return easyPassStorage
}

function findAvailableTag () {

}
