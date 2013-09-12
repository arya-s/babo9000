module.exports = function(app) {
  app.get('/analytics', function(req, res, next) {
    res.render('analytics')
  })
}