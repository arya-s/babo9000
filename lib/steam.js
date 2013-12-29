var steam = require('steam')
  , util = require('util')

var bot = new steam.SteamClient()

bot.logOn({
  accountName: config.steam_username
, password: config.steam_password
})

module.exports = function(irc) {
  bot.on('loggedOn', function() {
    irc.client.say(irc.to, 'Logged onto steam.')
  })

  bot.on('error', function(e) {
    irc.client.say(irc.to, 'Error: ' + e.cause)
  })

  bot.on('friendMsg', function(userSid, msg, type) {
    var steamName = bot.users[userSid]
    irc.client.say(irc.to, util.format('%s: %s', steamName, msg))
  })
}