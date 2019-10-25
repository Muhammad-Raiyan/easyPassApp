var express = require('express')
var router = express.Router()

var Storage = require('dom-storage')
var customerStorage = new Storage('./customer.json', { strict: false, ws: '  ' })
var easyPassStorage = new Storage('./easyPass.json', { strict: false, ws: '  ' })
var lostTagInventory = new Storage('./lostTags.json', { strict: false, ws: '  ' })

var { authenticate, restrict } = require('../auth')
var customerDB = require('../db/customer.db')

/* GET users listing. */
router.get('/', restrict, function (req, res, next) {
  console.log(req.session)
  var user = req.session.user
  res.render('index', { title: user.email })
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
  if (customerDB.createCustomer(user)) {
    res.redirect('/users/login')
  } else {
    console.log('Customer already exists')
    req.session.message = 'Customer already exists'
    res.redirect('/users/signup')
  }
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
      console.log('Found ' + JSON.stringify(user))
      req.session.regenerate(function () {
        // Store the user's primary key
        // in the session store to be retrieved,
        // or in this case the entire user object
        req.session.user = user
        res.redirect('/users')
      })
    } else {
      req.session.error = 'Authentication failed, please check your username and password.'
      res.redirect('/users/login')
    }
  })
})

router.post('/logout', function (req, res) {
  if (!req.session.user) {
    res.redirect('/users/login')
  }
  console.log(req.session)
  req.session.destroy(function () {
    res.redirect('/users/login')
  })
})

router.post('/requesttag', async function (req, res) {
  var x = req.session
  if (!req.session.user) {
    res.redirect('/users/login')
  }
  console.log(x)
  var user = customerStorage.getItem(req.session.user.email)
  if (await customerDB.requestTag(user)) {
    req.session.success = user.tag + ' assigned to ' + user.email
    res.redirect('/users')
  } else {
    console.log('tag exists')
    req.session.success = 'tag already aassigned to user ' + user.email
    req.session.save()
    res.redirect('/users')
  }
})

router.post('/relinquishTag', function (req, res) {
  if (!req.session.user) {
    res.redirect('/users/login')
  }
  console.log(req.session)
  var user = req.session.user
  var prevTag = customerDB.returnTag(user)
  req.session.success = 'tag no longer assigned to' + prevTag + '   ' + req.session.email
  res.redirect('/users')
})

router.post('/reportLostTag', async function (req, res) {
  if (!req.session.user) {
    res.redirect('/users/login')
  }
  var user = req.session.user

  if (customerDB.lostTag(user)) {
    req.session.success = 'Thanks for reporting lost tag'
  }
})

module.exports = router
