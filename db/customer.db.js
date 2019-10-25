var Storage = require('dom-storage')
var customerStorage = new Storage('./customer.json', { strict: false, ws: '  ' })
var easyPassStorage = new Storage('./easyPass.json', { strict: false, ws: '  ' })

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
  var easyPassNo = Math.floor((Math.random() * 100000) + 1)
  easyPassStorage.setItem(easyPassNo, true)
  customerStorage.setItem(username, user)
  return true
}

function requestTag (user) {

}

function updateCustomer (user) {

}

function updateVehicle (user) {

}

function returnTag (user) {

}

function lostTag (user) {

}

function addFund (user) {

}
