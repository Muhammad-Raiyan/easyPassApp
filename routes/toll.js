var express = require('express')
var router = express.Router()

var restrict = require('../auth').restrict

/* GET home page. */
router.get('/', restrict, function (req, res, next) {
  // res.render('index', { title: 'Index Page' })
  console.log('in toll page')
})

router.post('/add', restrict, function (req, res, next) {
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
