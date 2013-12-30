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
    bot.joinChat(config.steam_chatroom_id)
    irc.client.say(irc.to, 'Logged onto steam.')
    irc.client.say(irc.to, util.format('Joined chat %s', config.steam_chatroom_id))
  })

  bot.on('error', function(e) {
    irc.client.say(irc.to, 'Error: ' + e.cause)
  })

  bot.on('loggedOff', function() {
    irc.client.say(irc.to, 'Logged off steam.')
  })

  bot.on('chatMsg', function(chatSid, msg, type, userSid) {
    if (bot.users.hasOwnProperty(userSid)) {
      //blank message filter
      if (type == steam.EChatEntryType.ChatMsg) {
        var user = bot.users[userSid]
        , steamName = user.playerName
        , gameName = user.gameName ? util.format('[%s]', user.gameName) : ''

        if (gameName) {
          irc.client.say(irc.to, util.format('%s %s: %s', steamName, gameName, msg))
        } else {
          irc.client.say(irc.to, util.format('%s: %s', steamName, msg))
        }
      }
    }
  })
}