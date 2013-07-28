// requires a file from the commands dir
// compares filename with command minus the .js
// each command must module.exports a function. the loader passes a irc object with
// all necessary objects to interact with irc

var fs = require('fs')
  , path = require('path')

module.exports = function(command, nick, to, text, client) {
  var irc = {
    nick: nick
  , to: to
  , text: text
  , client: client
  }

  fs.readdir(path.join(__dirname, '..', 'commands'), function(err, files) {
    if (err) {
      console.log('error loading command', err)
    } else {
      for (var i=0;i<files.length;i++) {
        if (files[i] === command + '.js') {
          require(path.join(__dirname, '..', 'commands', files[i]))(irc)
          break
        }
      }
    }
  })
}
