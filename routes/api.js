var Transform = require('stream').Transform
  , JSONStream = require('JSONStream')

module.exports = function(app, db) {
  app.get('/analytics.json', function(req, res, next) {
    var parser = new Transform({objectMode: true})
    parser.total = 0
    parser._transform = function(data, encoding, cb) {
      this.total += data.activity
      this.push(data)
      cb()
    }

    parser._flush = function(done) {
      this.push(this.total)
      done()
    }

    db.getAnalytics(function(err, stream) {
      if (err) {
        console.log('error getting analytics')
        next()
      } else {
        stream
          .pipe(parser)
          .pipe(JSONStream.stringify())
          .pipe(res)
      }
    })
  })

  app.get('/commands.json', function(req, res) {
    res.json({trigger: global.b9config.trigger})
  })
  
  app.post('/auth', function(req, res) {
    if (global.b9config.secret == req.body.secret) {
      res.cookie('access', 'ok', {signed: true})
      res.send(200)
    } else {
      res.send(403)
    }
  })

}