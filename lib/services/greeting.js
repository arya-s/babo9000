var config = require('../../config.js')

module.exports = function(irc) {
	var random = Math.floor(Math.random() * config.joinMsg.length)
  irc.client.say(irc.to, config.joinMsg[random])
}
