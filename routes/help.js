var fs = require('fs')
  , path = require('path')

module.exports = function(app) {
  app.get('/help', function(req, res) {
    fs.readdir(path.join(__dirname, '..', 'commands'), function(err, files) {
      if (err) {
        console.log('error loading command', err)
      } else {
        //strip .js
        var commands = files.map(function(file) {
          return file.slice(0, file.length-3)
        })
        res.render('help', {commands: commands})
      }
    })
  })
}