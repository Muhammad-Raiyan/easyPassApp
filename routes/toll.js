var express = require('express')
var router = express.Router()

var restrict = require('../auth').restrict
var tollDB = require('../db/toll.db')
/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', { title: 'Index Page' })
  console.log('in toll page')
  res.render('toll', {
    data: tollDB.getAllData()
  })
})

router.get('/', function (req, res, next) {
  // res.render('index', { title: 'Index Page' })
  console.log('in toll page')
  res.send(200)
})

router.post('/add', function (req, res, next) {
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
  var newFare = req.body.fare
  var id = req.body.tollid

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
  res.redirect('/toll')
})

module.exports = router
