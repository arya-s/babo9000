var fs = require('fs')
  , path = require('path')

module.exports = function(app, db) {
  app.get('/analytics.json', function(req, res, next) {
    db.getAnalytics(function(err, stream) {
      if (err) {
        console.log('error getting analytics')
        next()
      } else {
        var first = true
          , total = 0
        //stream dat shiet
        res.setHeader("Content-Type", "application/json");
        res.write('{"hosts": [');

        stream.on('data', function(item) {
          var prefix = first ? '' : ','
        
          res.write(prefix + JSON.stringify(item))
          first = false
          total += item.activity
        })
        stream.on('end', function() {
          res.write('], "total":')
          res.write(JSON.stringify(total))
          res.write('}')
          res.end()
        })
      }
    })
  })

  app.get('/commands.json', function(req, res) {
    fs.readdir(path.join(__dirname, '..', 'commands'), function(err, files) {
      if (err) {
        console.log('error loading command', err)
      } else {
        //strip .js
        var commands = files.map(function(file) {
          return file.slice(0, file.length-3)
        })
        res.json(commands)
      }
    })
  })
}