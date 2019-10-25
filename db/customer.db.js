var Storage = require('dom-storage')
var customerStorage = new Storage('./customer.json', { strict: false, ws: '  ' })
var easyPassStorage = new Storage('./easyPass.json', { strict: false, ws: '  ' })
var lostTagInventory = new Storage('./lostTags.json', { strict: false, ws: '  ' })
var tagDB = require('./tag.db')

module.exports = {
  createCustomer,
  requestTag,
  updateCustomer,
  updateVehicle,
  returnTag,
  lostTag,
  addFund
}

function createCustomer (user) {
  var username = user.email

  if (customerStorage.getItem(username)) {
    return false
  }
  user.balance = 0
  customerStorage.setItem(username, user)
  return true
}

function requestTag (user) {
  if (tagDB.assignTag(user)) {
    customerStorage.setItem(user.email, user)
    return true
  } else {
    return false
  }
}

function updateCustomer (user) {

}

function updateVehicle (user) {

}

function returnTag (user) {
  user = customerStorage.getItem(user.email)
  tagDB.returnTag(user)
  var prevTag = user.tag
  delete user.tag
  customerStorage.setItem(user.email, user)
  easyPassStorage.setItem(prevTag, false)
  return prevTag
}

function lostTag (user) {
  user = customerStorage.getItem(user.email)
  if (!user.tag) return false
  var prevTag = user.tag
  delete user.tag
  lostTagInventory.setItem(prevTag, 'Lost')
  easyPassStorage.removeItem(prevTag)
  customerStorage.setItem(user.email, user)
  return true
}

function addFund (user, amount) {
  if (!user) {
    return false
  }
  user.balance += amount
  console.log(user)
  customerStorage.setItem(user.email, user)
  return true
}

// router.post( '/changeInformation', function( req, res, next){
//   var user  = req.session.user
//   var email = user.email
//   res.render( 'personal', { title: 'Update Personal Info for '+email})
// })
