module.exports = function(db, cmds) {
  var irc = require('irc')
    , client = new irc.Client(
        'irc.quakenet.org'
        , global.b9config.username
        , { channels: [global.b9config.channel + ' ' + global.b9config.secret]
          , debug: true
          , floodProtection: true
          , floodProtectionDelay: 1000
          }
      )
    , messages = require('./messages.js')
    , steam = require('./steam.js')
    , services = require('./services.js')
    , webchat = require('./webchat.js')

  client.on('message', function (nick, to, input) {
    //handle any extra whitespace between command and whatever follows
    input = input.replace(/\s+/g, " ")

    var split = input.split(' ')
      , command = split[0].substring(1)
      , text = split.splice(1).join(' ')

    // console.log(nick + ' => ' + to + ': ' + text)
    
    //load corresponding command from file
    if (input.indexOf(global.b9config.trigger) === 0) {
        if(cmds.hasOwnProperty(command)) {
            cmds[command]({nick: nick, to: to, text: text, client: client, db: db})
        } else {
            if(/\w/.test(command)) {
                client.say(to, 'no such command exists')
            }
        }
    }

    //steam relay
    steam.irc(nick, to, input, client)

    //webchat
    webchat(nick, to, input, client)
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

  client.on('selfMessage', function(target, text) {
    //need to show bot's msgs for webchat to show webchatter's msgs
    webchat(global.b9config.username, target, text, client)
  })
}
