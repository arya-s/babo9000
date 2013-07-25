module.exports = function(irc) {
  var recepient = irc.text.split(' ')
    , message
    , sender = irc.nick

  if (!recepient) return

  message = util.format('%s, you have mail from %s: %s', recepient[1], sender, recepient.splice(2).join(' '))
  messages[recepient[1]] = message
  irc.client.say(irc.to, 'Mail stored. Relaying to recepient on next join')
}