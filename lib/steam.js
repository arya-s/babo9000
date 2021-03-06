var steam = require('steam')
  , util = require('util')

var bot = new steam.SteamClient()

exports.init = function(irc) {
  bot.logOn({
    accountName: global.b9config.steam_username
  , password: global.b9config.steam_password
  })

  bot.on('loggedOn', function() {
    bot.setPersonaState(steam.EPersonaState.Online)
    bot.setPersonaName('BABO9000')
    bot.joinChat(global.b9config.steam_chatroom_id)
    irc.client.say(irc.to, 'Logged onto steam.')
    irc.client.say(irc.to, util.format('Joined chat %s', global.b9config.steam_chatroom_id))
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

exports.irc = function(nick, to, input, client) {
  //make sure bot is connected
  if (!bot.loggedOn) return

  var irc = {
    nick: nick
  , to: to
  , input: input
  , client: client
  }

  var message = util.format('%s (irc): %s', irc.nick, irc.input)
  bot.sendMessage(global.b9config.steam_chatroom_id, message, steam.EChatEntryType.ChatMsg)

}

exports.reconnect = function() {
  bot.logOn({
    accountName: global.b9config.steam_username
  , password: global.b9config.steam_password
  })
}