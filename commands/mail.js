var util = require('util')
  , messages = require('../messages.js')

module.exports = function(irc) {
  var recepient = irc.text.split(' ')
    , message
    , sender = irc.nick

  if (!recepient) return

  message = util.format('%s, you have mail from %s: %s', recepient[0], sender, recepient.splice(1).join(' '))
  messages[recepient[0]] = message
  irc.client.say(irc.to, 'Mail stored. Relaying to recepient on next join')
}