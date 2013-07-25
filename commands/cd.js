var i = 5

module.exports = function countdown(irc) {
  irc.client.say(irc.to, i.toString())
  i--
  if (i>=0) {
    global.setTimeout(function() {
      countdown(irc)
    }, 1000)
  }
  else {
    i = 5
  }
}