module.exports = function(app, db) {
  app.get('/analytics', function(req, res, next) {
    res.render('analytics')
  })
}