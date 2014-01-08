//steam connection
var steam = require('../steam')

module.exports = function(irc) {
  steam.init(irc.to, irc.client)
}