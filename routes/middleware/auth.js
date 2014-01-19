module.exports = function(req, res, next) {
  if (req.signedCookies.access !== 'ok') {
    res.send(403)
  } else {
    next()
  }
}