var express = require('express')
var router = express.Router()

var { authenticate, restrict } = require('../auth')
var customerDB = require('../db/customer.db')
var tagsDB = require('../db/tag.db')
var tollDB = require('../db/toll.db')

/* GET users listing. */
router.get('/', restrict, function (req, res, next) {
  var userID = req.session.user
  console.log('Redirect success for ' + userID)
  var user = customerDB.getUser(userID)
  if (user.isAdmin) {
    res.redirect('/users/clerk')
  } else {
    res.redirect('/users/customer')
  }
})

router.get('/customer', restrict, function (req, res, next) {
  console.log(req.session)
  var email = req.session.user
  var user = customerDB.getUser(email)
  res.render('customer', { title: email, data: user, trip: user.trips })
})

router.get('/clerk', restrict, function (req, res, next) {
  console.log(req.session)
  var user = req.session.user
  res.render('clerk', { title: user, data: customerDB.getUser(user), trip: customerDB.getTrips() })
})

router.get('/signup', function (req, res, next) {
  res.render('signup', {
    title: 'Signup page',
    message: req.session.message ? req.session.message : 'Enter Signup data'
  })
})

router.post('/signup', function (req, res, next) {
  console.log('Signup post request')
  var user = req.body
  customerDB.createCustomer(user, (success, msg) => {
    if (success) {
      req.session.success = msg
      res.redirect('/users/login')
    } else {
      req.session.error = msg
      res.redirect('/users/login')
    }
  })
})

router.get('/login', function (req, res, next) {
  res.render('login', {
    title: 'login page'
  })
})

router.post('/login', function (req, res, next) {
  console.log('Login post request')
  authenticate(req.body.email, req.body.password, (err, user) => {
    if (err) {
      console.log(err)
      req.session.error = 'Authentication failed, please check your username and password.'
      res.redirect('/users/login')
    }
    if (user) {
      // Regenerate session when signing in
      // to prevent fixation
      console.log(user)
      if (user.isAdmin) {
        req.session.user = user.email
        res.redirect('/users/clerk')
      } else {
        req.session.user = user.email
        res.redirect('/users/customer')
      }
    } else {
      req.session.error = 'Authentication failed, please check your username and password.'
      res.redirect('/users/login')
    }
  })
})

router.post('/logout', function (req, res) {
  console.log(req.session)
  customerDB.storeCustomers(req.session.user, (success) => {
    tagsDB.storeTags()
    tollDB.storeTollData()
    req.session.destroy(function () {
      res.redirect('/users/login')
    })
  })
})

router.post('/requesttag', restrict, function (req, res) {
  var userID = req.session.user
  customerDB.requestTag(userID, function (success, user) {
    if (success) {
      req.session.success = user.tag + ' assigned to ' + user.email
      res.redirect('/users')
    } else {
      req.session.success = user.tag + ' tag already assigned to user ' + user.email
      res.redirect('/users')
    }
  })
})

router.post('/relinquishTag', restrict, function (req, res) {
  var userID = req.session.user
  customerDB.returnTag(userID, (prevTag, user) => {
    if (prevTag == null) {
      req.session.success = user.email + ' doesn\'t have a tag assigned'
      req.session.user = user.email
      res.redirect('/users')
    } else {
      req.session.success = prevTag + ' tag no longer assigned to ' + req.session.email
      console.log('after modification')
      req.session.user = user.email
      res.redirect('/users')
    }
  })
})

router.post('/reportLostTag', restrict, function (req, res) {
  var userID = req.session.user
  customerDB.lostTag(userID, (prevTag, message) => {
    if (prevTag) {
      req.session.success = prevTag + message
      res.redirect('/users')
    } else {
      req.session.error = message
      res.redirect('/users')
    }
  })
})

router.post('/addFunds', restrict, function (req, res) {
  var userID = req.session.user
  var amount = req.body.amount ? parseInt(req.body.amount) : 20
  console.log(userID)
  customerDB.addFund(userID, amount, (success, user) => {
    if (success) {
      console.log('success adding fund')
      req.session.success = amount + ' added to funds of ' + user.email
      res.redirect('/users')
    } else {
      req.session.error = 'Error'
      res.redirect('/users')
    }
  })
})

router.get('/changeInformation', restrict, function (req, res, next) {
  res.render('personal', { title: 'Update Personal Info for ' })
})
router.post('/changeInformation', function (req, res, next) {
  var userID = req.session.user
  var updatedUser = req.body
  customerDB.updateUser(userID, updatedUser, (success) => {
    if (success) {
      req.session.success = 'User updated'
      res.redirect('/users')
    } else {
      req.session.error = 'Error'
      res.redirect('/users')
    }
  })
})

router.get('/clientRevenue', function (req, res, next) {
  var customers = customerDB.getUsers()
  var clients = []
  var totalRevenue = 0
  Object.keys(customers).forEach(key => {
    var customer = customers.getItem(key)
    var rev = customerDB.getRevenue(key)
    totalRevenue += rev
    var customerRevData = {
      fullname: customer.lname + ' ' + customer.fname,
      sdate: customer.sdate,
      revenue: rev
    }

    clients.push(customerRevData)
  })
  clients.sort((a, b) => (a.fullname.toLowerCase() > b.fullname.toLowerCase()) ? 1 : -1)
  res.send({
    date: new Date(Date.now()).toLocaleString(),
    title: 'Detailed Client Revenue Report',
    fields: clients,
    total: totalRevenue
  })
})

module.exports = router
