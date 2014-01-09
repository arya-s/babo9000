var config = require('../config.js')

exports.whois = function(irc, cb) {
  irc.client.say(irc.to, 'whois on ', irc.nick)
  irc.client.whois(irc.nick, cb)
}

exports.isMaster = function(irc, cb) {
    this.whois(irc, function(info) {
      cb(info.host.indexOf(config.master) > -1)
    })
  }