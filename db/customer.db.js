var Storage = require('dom-storage')
var customerStorage = new Storage('./data/customer.json', { strict: false, ws: '  ' })
var tagDB = require('./tag.db')
var customers = null

module.exports = {
  createCustomer,
  requestTag,
  updateUser,
  updateVehicle,
  returnTag,
  lostTag,
  addFund,
  removeFund,
  initCustomers,
  storeCustomers,
  getUser
}

function initCustomers () {
  customers = customerStorage
}

function storeCustomers (email, next) {
  console.log('storing all customer data')
  var user = customers[email]
  customerStorage.setItem(email, user)
  return next(true)
}

function createCustomer (user, next) {
  var username = user.email
  if (customerStorage.getItem(username)) {
    return next(false, user.email + ' already exists')
  } else {
    user.balance = 0
    user.isAdmin = false
    customers[username] = user
    customerStorage.setItem(username, user)
    // tagDB.createTag()
    return next(true, 'Success')
  }
}

async function requestTag (email, next) {
  var user = customers[email]
  console.log(user)
  tagDB.assignTag(user, (assigned) => {
    if (assigned) {
      return next(true, user)
    }
    return next(false, user)
  })
}

function updateUser (email, updatedUser, next) {
  var user = customers[email]
  console.log(user)
  updatedUser.lplate = user.lplate
  updatedUser.cmake = user.cmake
  updatedUser.cyear = user.cyear
  updatedUser.balance = user.balance
  user[email] = updatedUser
  return next(true)
}

function updateVehicle (email) {
  var user = customers[email]
  console.log(user)
}

async function returnTag (email, next) {
  var user = customers[email]
  console.log(user)
  if (!user.tag) return next(null, user)
  var prevTag = user.tag
  delete user.tag
  tagDB.returnTag(prevTag, (success) => {
    if (success) return next(prevTag, user)
    else return next(null, user)
  })
}

function lostTag (email, next) {
  var user = customers[email]
  console.log(user)
  if (!user.tag) return next(null, 'No tag assigned to ' + email)
  var prevTag = user.tag
  delete user.tag
  tagDB.reportTagLost(prevTag, (success) => {
    if (success) return next(prevTag, ' is reported as lost')
    else return next(null)
  })
}

function addFund (email, amount, next) {
  var user = customers[email]

  user.balance += amount
  return next(true, user)
}

function removeFund (email, amount, next) {
  var user = customers[email]
  console.log(user)
  user.balance -= amount
  return next(true, user)
}

function getUser (email) {
  return customers[email]
}
