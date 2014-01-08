//init analytics cron on join. update db every 15 minutes
//and clear memory
var cronJob = require('cron').CronJob
  , analytics = require('../analytics.js')
  , messageMap = {}

module.exports = function(irc) {
  var updateAnalytics = new cronJob('0 */15 * * * *', function() {
    analytics(messageMap, irc.db)
    messageMap = {}
  }, null, false).start()

  irc.client.on('raw', function(message) {
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