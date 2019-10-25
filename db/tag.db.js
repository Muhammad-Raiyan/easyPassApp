var Storage = require('dom-storage')
var easyPassStorage = new Storage('./data/easyPass.json', { strict: false, ws: '  ' })
var tags = null

module.exports = {
  assignTag,
  returnTag,
  reportTagLost,
  initTags,
  storeTags
}

function initTags () {
  if (easyPassStorage.length === 0) {
    easyPassStorage.setItem(createTag(), true)
    easyPassStorage.setItem(createTag(), true)
  }
  tags = easyPassStorage
  console.log(tags)
}

function storeTags () {
  console.log('storing all tag data')
  for (var key in tags) {
    easyPassStorage.setItem(key, tags[key])
  }
}

async function assignTag (user, next) {
  if (user.tag) {
    console.log('tag exists')
    return next(false)
  }
  if (easyPassStorage.length === 0) {
    var newTag = createTag()
    user.tag = newTag
    tags[newTag] = false
    console.log('Created new key for ' + user)
    return next(true)
  }
  for (var key in tags) {
    if (tags[key]) {
      console.log(key)
      user.tag = key
      tags[key] = false
      console.log('Found existing key for ' + user)
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
  tags[createTag()] = true
  next(true)
}

function createTag () {
  return Math.floor((Math.random() * 100000) + 1)
}
