module.exports = function(irc) {
	var random = Math.floor(Math.random() * global.b9config.joinMsg.length)
  irc.client.say(irc.to, global.b9config.joinMsg[random])
}
