//goes through services dir and requires every file inside

var fs = require('fs')
  , path = require('path')

module.exports = function(channel, nicks, client, db) {
  var irc = {
    to: channel
  , nicks: nicks
  , client: client
  , db: db
  }

  fs.readdir(path.join(__dirname, 'services'), function(err, files) {
    if (err) {
      irc.client.say(irc.to, 'error loading service: ' + err)
    } else {
      for (var i=0;i<files.length;i++) {
        require(path.join(__dirname, 'services', files[i]))(irc)
      }
    }
  })
}
