var express = require('express')
var router = express.Router()

var restrict = require('../auth').restrict
var tollDB = require('../db/toll.db')
/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', { title: 'Index Page' })
  console.log('in toll page')
  var data = tollDB.getAllData()
  res.render('index', {
    data: JSON.stringify(data)
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

  res.redirect('/toll')
})
router.post('/update', restrict, function (req, res, next) {
  // res.render('index', { title: 'Index Page' })
  console.log(req.body)

  res.redirect('/toll')
})
router.post('/pay', restrict, function (req, res, next) {
  // res.render('index', { title: 'Index Page' })
  console.log(req.body)
  res.redirect('/toll')
})

module.exports = router
