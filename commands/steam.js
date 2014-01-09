var helpers = require('../lib/helpers.js')
  , steam = require('../lib/steam.js')

module.exports = function(irc) {
  var subcommand = irc.text.split(' ')[0]

  if (subcommand == 'reconnect') {
    helpers.isMaster(irc, function(master) {
      if (master) {
        steam.reconnect()
      } else {
        irc.client.say(irc.to, 'Not master. Aborting.')
      }
    })
  }
}

