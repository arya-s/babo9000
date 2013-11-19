module.exports = function(db) {
  var config = require('../config.js')
    , irc = require('irc')
    , client = new irc.Client(
        'irc.uk.quakenet.org'
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
    , analytics = require('./analytics.js')
    , messageMap = {}

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
  })

  client.on('join', function (channel, nick, message) {
    if (messages.hasOwnProperty(nick)) {
      client.say(channel, messages[nick])
      messages[nick] = null
    }
  })

  //init stuff here
  client.on('names', function(channel, nicks) {
    var random = Math.floor(Math.random() * config.joinMsg.length)
    client.say(channel, config.joinMsg[random])
    //init parser on channel join, pass client instance
    //cron every 15 minutes
    var fetchRSS = new cronJob('0 */15 * * * *', function() {
      parser(channel, client, db)
    }, null, false).start()
    //init analytics cron on join. update db every 15 minutes
    //and clear memory
    var updateAnalytics = new cronJob('0 */15 * * * *', function() {
      analytics(messageMap, db)
      messageMap = {}
    }, null, false).start()
    //reminders
    db.getReminder(function(err, docs) {
      if (err) {
        client.say(channel, 'error setting reminder timers')
      } else {
        docs.forEach(function(reminder) {
          global.setTimeout(function() {
            client.say(channel, 'Reminder: ' + reminder.setter + ', ' + reminder.msg)
            db.delReminder(reminder, function(err) {
              if (err) client.say(channel, 'error deleting completed reminder')
            })
          }, reminder.born + reminder.due - new Date().getTime())
        })
      }
    })
  })

  //analytics
  client.on('raw', function(message) {
    //because a person can have several aliases, it is a good idea to parse for host
    //compare PRIVMSG to filter out server messages
    //lets ignore bots
    if (message.command == 'PRIVMSG' && message.host.indexOf('compute-1.amazonaws.com') == -1) {
      //no key, start from 1, otherwise append by 1
      if (!messageMap.hasOwnProperty(message.host)) {
        messageMap[message.host] = {activity: 1, nick: message.nick}
      } else {
        messageMap[message.host]['activity'] += 1
        messageMap[message.host]['nick'] = message.nick
      }
    }
  })
}

