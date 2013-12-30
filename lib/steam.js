module.exports = function(to, client) {
  var steam = require('steam')
  , util = require('util')
  , config = require('../config.js')
  , irc = {
    to: to
  , client: client
  }

  var bot = new steam.SteamClient()

  bot.logOn({
    accountName: config.steam_username
  , password: config.steam_password
  })

  bot.on('loggedOn', function() {
    bot.setPersonaState(steam.EPersonaState.Online)
    bot.setPersonaName('BABO9000')
    irc.client.say(irc.to, 'Logged onto steam.')
  })

  bot.on('error', function(e) {
    irc.client.say(irc.to, 'Error: ' + e.cause)
  })

  bot.on('loggedOff', function() {
    irc.client.say(irc.to, 'Logged off steam.')
  })

  bot.on('friendMsg', function(userSid, msg, type) {
    if (bot.users.hasOwnProperty(userSid)) {
      var steamName = bot.users[userSid].playerName
      irc.client.say(irc.to, util.format('%s: %s', steamName, msg))
    }
  })
}