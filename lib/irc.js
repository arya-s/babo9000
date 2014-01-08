module.exports = function(db) {
  var config = require('../config.js')
    , irc = require('irc')
    , client = new irc.Client(
        'irc.quakenet.org'
        , config.username
        , { channels: [config.channel + ' ' + config.secret]
          , debug: true
          , floodProtection: true
          , floodProtectionDelay: 1000
          }
      )
    , loader = require('./loader.js')
    , messages = require('./messages.js')
    , steam = require('./steam.js')
    , services = require('./services.js')

  client.on('message', function (nick, to, input) {
    //handle any extra whitespace between command and whatever follows
    input = input.replace(/\s+/g, " ")

    var split = input.split(' ')
      , command = split[0].substring(1)
      , text = split.splice(1).join(' ')

    // console.log(nick + ' => ' + to + ': ' + text)
    
    //load corresponding command from file
    if (input.indexOf(config.trigger) === 0) {
      loader(command, nick, to, text, client, db)
    }

    //steam relay
    steam.irc(nick, to, input, client)
  })

  client.on('join', function (channel, nick, message) {
    if (messages.hasOwnProperty(nick)) {
      client.say(channel, messages[nick])
      messages[nick] = null
    }
  })

  
  client.on('names', function(channel, nicks) {
    //start all services required
    services(channel, nicks, client, db)
  })
}

