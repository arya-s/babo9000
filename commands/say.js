module.exports = function(irc) {
  irc.client.say(irc.to, irc.text.substring(5))
}