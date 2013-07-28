var filter = require('../lib/parser_filter.js')

module.exports = function(irc) {
  if (irc.text.length > 0) {
    var subcommand = irc.text.split(' ')
    if (subcommand[0] == 'add') {
      filter.push(subcommand.splice(1).join(' '))
      irc.client.say(irc.to, 'filter added')
    } else if (subcommand[0] == 'del') {
      var del = filter.indexOf(subcommand.splice(1).join(' '))
      if (del !== -1) {
        filter.splice(del, 1)
        irc.client.say(irc.to, 'filter deleted')
      } else {
        irc.client.say(irc.to, 'filter not found')
      }
    } else {
      irc.client.say(irc.to, 'not a valid command')
    }
  } else {
    //no subcommand, give list of filters in string form
    irc.client.say(irc.to, filter.join(', '))
  }
}