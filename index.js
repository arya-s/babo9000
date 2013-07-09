var config = require('./config.js')
  , util = require('util')
  , irc = require('irc')
  , client = new irc.Client(
      'irc.quakenet.org'
      , config.username
      , { channels: [config.channel + ' ' + config.secret]
        , debug: false
        , floodProtection: true
        , floodProtectionDelay: 1000
        }
    )
  , commands = require('./commands.js')
  , messages = require('./messages.js')

client.on('message', function (nick, to, text) {
  var command = text.split(' ')[0].substring(1)

  console.log(nick + ' => ' + to + ': ' + text)
  
  if (text.indexOf(config.trigger) === 0) {
    commands(command, nick, to, text, client)
  }
})

client.on('join', function (channel, nick, message) {
  if (messages.hasOwnProperty(nick)) {
    client.say(channel, messages[nick])
    messages[nick] = null
  }
})

client.on('names', function(channel, nicks) {
  client.say(channel, config.joinMsg)
})


