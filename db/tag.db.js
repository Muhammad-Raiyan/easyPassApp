var Storage = require('dom-storage')
var tagStorage = new Storage('./data/tag.json', { strict: false, ws: '  ' })
var tags = {}
var tagStatus = {
  AVAILABLE: 'available',
  ASSIGNED: 'assigned',
  LOST: 'lost'
}

module.exports = {
  assignTag,
  returnTag,
  reportTagLost,
  initTags,
  storeTags,
  getTags
}

function initTags () {
  if (tagStorage.length === 0) {
    var i
    for (i = 0; i < 3; i++) {
      var newTagId = createTag()
      tagStorage.setItem(newTagId, tags[newTagId])
    }
  }
  tags = tagStorage
  console.log('tags ' + tags)
}

function storeTags () {
  console.log('storing all tag data')
  for (var key in tags) {
    tagStorage.setItem(key, tags[key])
  }
}

async function assignTag (user, next) {
  console.log(tags)
  if (user.tag) {
    console.log('tag exists')
    return next(false)
  }
  if (tagStorage.length === 0) {
    var newTagId = createTag()
    user.tag = newTagId
    console.log('Created new key for ' + user)
    return next(true)
  }
  for (var key in tags) {
    if (tags[key].status === tagStatus.AVAILABLE) {
      console.log(key)
      user.tag = key
      tags[key].status = tagStatus.ASSIGNED
      console.log('Found existing key for ' + user)
      return next(true)
    }
  }
}

function returnTag (tag, next) {
  tags[tag].status = tagStatus.AVAILABLE
  next(true)
}

function reportTagLost (tag, next) {
  tags[tag].status = tagStatus.LOST
  createTag()
  next(true)
}

function createTag () {
  var tagID = Math.floor((Math.random() * 100000) + 1)
  var tagData = {
    status: tagStatus.AVAILABLE,
    addDate: new Date().toLocaleDateString()
  }
  tags[tagID] = tagData
  return tagID
}

function getTags () {
  return tags
}
