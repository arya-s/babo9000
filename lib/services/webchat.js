var ircEmitter = require('../helpers.js').ircEmitter

module.exports = function(nick, to, input, client) {
  ircEmitter.emit('message', {
    nick: nick,
    to: to,
    input: input
  })
}