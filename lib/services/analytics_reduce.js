//condense activity of rogue hostmasks with major chatters
module.exports = function (irc) {
  irc.client.say(irc.to, 'Reducing analytics activity')
  irc.db.reduceAnalytics(function (err) {
    if (err) {
      irc.client.say(irc.to, 'Error reducing')
    }
  })
}