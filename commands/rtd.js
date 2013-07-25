module.exports = function(irc) {
  var random = Math.ceil(Math.random() * 6)

  irc.client.say(irc.to, irc.nick + ' has rolled a ' + random)
}