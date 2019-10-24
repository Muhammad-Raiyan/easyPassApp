var Storage = require('dom-storage')
var customerStorage = new Storage('./customer.json', { strict: false, ws: '  ' })

function authenticate (email, pass, fn) {
  if (!module.parent) console.log('authenticating %s:%s', email, pass)
  var user = customerStorage.getItem(email)
  console.log(email)
  console.log(user.email + user.password)
  if (!user) return fn(new Error('cannot find user'))

  if (pass === user.password) return fn(null, user)
  fn(new Error('invalid password'))
}

function restrict (req, res, next) {
  if (req.session.user) {
    next()
  } else {
    req.session.error = 'Access denied!'
    res.redirect('/users/login')
  }
}

module.exports = {
  authenticate,
  restrict
}
