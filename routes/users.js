var express = require('express')
var router = express.Router()

var Storage = require('dom-storage')
var customerStorage = new Storage('./customer.json', { strict: false, ws: '  ' })
var easyPassStorage = new Storage('./easyPass.json', { strict: false, ws: '  ' })
var { authenticate, restrict } = require('../auth')

/* GET users listing. */
router.get('/', restrict, function (req, res, next) {
  console.log(req.session)
  var user = req.session.user
  res.render('index', { title: user.email })
})

router.get('/signup', function (req, res, next) {
  res.render('signup', {
    title: 'Signup page',
    message: 'Enter Signup data'
  })
})

router.post('/signup', function (req, res, next) {
  console.log('Signup post request')
  var user = req.body
  var username = req.body.email
  user.balance = 0
  var easyPassNo = Math.floor((Math.random() * 100000) + 1)
  easyPassStorage.setItem(easyPassNo, true)
  customerStorage.setItem(username, user)
  res.redirect('/users/login')
})

router.get('/login', function (req, res, next) {
  res.render('login', {
    title: 'login page'
  })
})

router.post('/login', function (req, res, next) {
  console.log('Login post request')
  authenticate(req.body.email, req.body.password, (err, user) => {
    if (err) console.log(err)
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
  req.session.destroy(function () {
    res.redirect('/users/login')
  })
})

router.post('/requesttag', function (req, res) {
  var x = req.session.user
  console.log(x)
  var user = customerStorage.getItem(req.session.user.email)
  for (var key in easyPassStorage) {
    if (easyPassStorage[key]) {
      user.tag = key
      // console.log(user)
      customerStorage.setItem(x.email, user)
      easyPassStorage.setItem(key, false)
      req.session.success = key + ' aassigned to user ' + x.email
      break
    }
  }

  // console.log(easyPassStorage)
  res.redirect('/users')
})

module.exports = router
