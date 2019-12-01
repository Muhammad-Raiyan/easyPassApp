var express = require('express')
var router = express.Router()

var restrict = require('../auth').restrict
var customerDB = require('../db/customer.db')
var tollDB = require('../db/toll.db')
/* GET home page. */
router.get('/', restrict, function (req, res, next) {
  // res.render('index', { title: 'Index Page' })
  var userID = req.session.user
  console.log('Redirect success for ' + userID)
  var user = customerDB.getUser(userID)
  if (user.isAdmin) {
    res.redirect('/toll/clerk')
  } else {
    res.redirect('/toll/customer')
  }
})

router.get('/clerk', restrict, function (req, res, next) {
  res.render('toll.clerk.ejs', {
    data: tollDB.getAllData()
  })
})

router.get('/customer', restrict, function (req, res, next) {
  res.render('toll.customer.ejs', {
    data: tollDB.getAllData()
  })
})

router.post('/add', restrict, function (req, res, next) {
  // res.render('index', { title: 'Index Page' })
  console.log(req.body)
  var tollData = req.body
  tollDB.addTollCrossing(tollData, (success, err) => {
    if (success) {
      req.session.success = 'Successfully added toll route'
      res.redirect('/toll')
    } else {
      req.session.error = 'Error adding route data'
      res.redirect('/toll')
    }
  })
})

router.post('/update', restrict, function (req, res, next) {
  // res.render('index', { title: 'Index Page' })
  console.log(req.body)
  var newFare = req.body.newFare
  var id = req.body.id

  tollDB.updateTollFare(id, newFare, (success, err) => {
    if (success) {
      req.session.success = 'Successfully updated toll fare'
      res.redirect('/toll')
    } else {
      req.session.error = 'Error updating toll fare'
      res.redirect('/toll')
    }
  })
})

router.post('/pay', restrict, function (req, res, next) {
  // res.render('index', { title: 'Index Page' })
  console.log(req.body)
  var userID = req.session.user
  var tCode = req.body.tollCode
  var fare = tollDB.getFare(tCode)
  console.log(tCode + fare)
  var user = customerDB.getUser(userID)
  var tripData = {
    tollCode: tCode,
    tagID: user.tag,
    lplate: user.lplate,
    fare: fare,
    timestamp: new Date(Date.now()).toLocaleString()
  }
  console.log(tripData)
  customerDB.removeFund(userID, fare, (success, user) => {
    console.log(user)
    customerDB.addTrip(userID, tripData, (success) => {
      res.redirect('/users')
    })
  })
})

router.get('/tollRevenue', restrict, function (req, res, next) {
  var [tollRevData, totalRev] = customerDB.getTollrevenueReport()
  console.log(tollRevData)
  tollRevData.sort((a, b) => (a.tollName.toLowerCase() > b.tollName.toLowerCase()) ? 1 : (a.tollName.toLowerCase() === b.tollName.toLowerCase()) ? ((a.tollCode > b.tollCode) ? 1 : -1) : -1)
  res.render('tollrevenue.ejs', {
    date: new Date(Date.now()).toLocaleString(),
    title: 'Toll Revenue Report',
    fields: tollRevData,
    total: totalRev
  })
})

module.exports = router
