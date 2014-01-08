//init parser on channel join, pass client instance
//cron every 15 minutes
var cronJob = require('cron').CronJob
  , parser = require('../parser.js')

module.exports = function(irc) {
  var fetchRSS = new cronJob('0 */15 * * * *', function() {
    parser(irc.to, irc.client, irc.db)
  }, null, false).start()
}