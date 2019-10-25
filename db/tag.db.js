var Storage = require('dom-storage')
var easyPassStorage = new Storage('./easyPass.json', { strict: false, ws: '  ' })
var tags = null

module.exports = {
  assignTag,
  returnTag,
  reportTagLost,
  initTags
}

function initTags () {
  tags = easyPassStorage
}

async function assignTag (user, next) {
  if (user.tag) {
    console.log('tag exists')
    return next(false)
  }
  // createTag()
  for (var key in easyPassStorage) {
    if (easyPassStorage[key]) {
      user.tag = key
      // easyPassStorage.setItem(key, false)
      tags[key] = false
      return next(true)
    }
  }
}

function returnTag (tag, next) {
  tags[tag] = true
  next(true)
}

function reportTagLost (tag, next) {
  tags[tag] = false
  next(true)
}

async function createTag () {
  var easyPassNo = Math.floor((Math.random() * 100000) + 1)
  easyPassStorage.setItem(easyPassNo, true)
  return easyPassStorage
}
