var Storage = require('dom-storage')
var customerStorage = new Storage('./data/customer.json', { strict: false, ws: '  ' })

module.exports = {
  authenticate,
  restrict
}

function authenticate (email, pass, fn) {
  if (!module.parent) console.log('authenticating %s:%s', email, pass)
  var user = customerStorage.getItem(email)
  console.log(customerStorage)
  console.log(email)
  console.log(pass)
  if (!user) fn(new Error('cannot find user'))

  if (pass === user.password) return fn(null, user)
  fn(new Error('invalid password'))
}

function restrict (req, res, next) {
  if (req.session.user) {
    next()
  } else {
    console.log(req.session)
    req.session.error = 'Access denied!'
    res.redirect('/users/login')
  }
}
