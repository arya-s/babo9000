module.exports = function(irc) {
  var time = new Date(Date.now())
  irc.client.say(irc.to, time)
}