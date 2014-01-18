module.exports = function(app) {
  app.post('/auth', function(req, res) {
    if (global.b9config.secret == req.body.secret) {
      res.cookie('access', 'ok', {signed: true})
      res.send(200)
    } else {
      res.send(403)
    }
  })
}