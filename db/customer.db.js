var Storage = require('dom-storage')
var customerStorage = new Storage('./data/customer.json', { strict: false, ws: '  ' })
var tripStorage = new Storage('./data/trip.json', { strict: false, ws: '  ' })
var tagDB = require('./tag.db')
var customers = null
var globalTrips = []

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
  getUser,
  getUserCallback,
  addTrip,
  getTrips
}

function initCustomers () {
  customers = customerStorage
  var i
  for (i = 0; i < tripStorage.length; i++) {
    var temp = tripStorage.getItem(i)
    globalTrips[i] = temp
  }
  console.log(globalTrips)
}

function storeCustomers (email, next) {
  console.log('storing all customer data')
  var user = customers[email]
  customerStorage.setItem(email, user)
  globalTrips.forEach((item, index) => {
    tripStorage.setItem(index, globalTrips[index])
  })
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

async function requestTag (email, next) {
  var user = customers[email]
  console.log('Tag request for' + JSON.stringify(user))
  tagDB.assignTag(user, (assigned) => {
    if (assigned) {
      return next(true, user)
    }
    return next(false, user)
  })
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
  var user = customers[email]
  console.log('Found user ' + JSON.stringify(user))
  return user
}

function getUserCallback (email, next) {
  var user = customers[email]
  console.log('Found user ' + JSON.stringify(user))
  return next(user)
}

function addTrip (email, tripData, next) {
  var user = customers[email]
  console.log('Found user ' + JSON.stringify(user))
  if (user.trips == null) {
    user.trips = []
  }
  user.trips.push(tripData)
  globalTrips.push(tripData)
  return next(true)
}

function getTrips () {
  return globalTrips
}
