var ircEmitter = require('../helpers.js').ircEmitter

module.exports = function(irc) {
  ircEmitter.on('send', function(msg) {
    irc.client.say(irc.to, '[webchat]: ' + msg)
  })
}