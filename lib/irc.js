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
    , parser = require('./parser.js')
    , cronJob = require('cron').CronJob

  client.on('message', function (nick, to, input) {
    var split = input.split(' ')
      , command = split[0].substring(1)
      //handle any extra whitespace b/w command and input
      , text = split.splice(1).join(' ').trim()

    // console.log(nick + ' => ' + to + ': ' + text)
    
    //load corresponding command from file
    if (input.indexOf(config.trigger) === 0) {
      loader(command, nick, to, text, client, db)
    }
  })

  client.on('join', function (channel, nick, message) {
    if (messages.hasOwnProperty(nick)) {
      client.say(channel, messages[nick])
      messages[nick] = null
    }
  })

  client.on('names', function(channel, nicks) {
    var random = Math.floor(Math.random() * config.joinMsg.length)
    client.say(channel, config.joinMsg[random])
    
    //start parser on channel join, pass client instance
    //cron every 15 minutes
    var fetchRSS = new cronJob('0 */15 * * * *', function() {
      parser(channel, client, db)
    }, null, true).start()
  })
}
