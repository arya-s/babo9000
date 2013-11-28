var config = require('../config.js')

module.exports = function(irc) {
  irc.client.say(irc.to, config.website)
}