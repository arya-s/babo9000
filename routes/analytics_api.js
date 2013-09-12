module.exports = function(app, db) {
  app.get('/analytics_api', function(req, res, next) {
    db.getAnalytics(function(err, docs) {
      if (err) {
        console.log('error getting analytics')
        next()
      } else {
        var total = 0
          , end = docs.length-1
          , hosts = []

        docs.forEach(function(doc, i) {
          total += doc.activity
          hosts.push({ 
            host: doc.host
          , activity: doc.activity
          , nick: doc.nick
          })
          if (i == end) {
            res.json({hosts: hosts, total: total})
          }
        })
      }
    })
  })
}