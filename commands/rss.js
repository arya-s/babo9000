module.exports = function(irc) {
  if (irc.text.length > 0) {
    var subcommand = irc.text.split(' ')
    if (subcommand[0] == 'add') {
      irc.db.addFilter({filter: subcommand.splice(1).join(' ')}, function(err) {
        if (err) {
          irc.client.say(irc.to, 'error saving filter to db')
        } else {
          irc.client.say(irc.to, 'filter added')
        }
      })
    } else if (subcommand[0] == 'del') {
      irc.db.deleteFilter({filter: subcommand.splice(1).join(' ')}, function(err) {
        if (err) {
          irc.client.say(irc.to, 'error deleting filter from db')
        } else {
          irc.client.say(irc.to, 'filter deleted')
        }
      })
    } else {
      irc.client.say(irc.to, 'not a valid command')
    }
  } else {
    //no subcommand, give list of filters in string form
    irc.db.filters(function(err, items) {
      if (err) {
        console.log('error reading filters from db')
      } else {
        var len = items.length - 1
          , filter = []

        items.forEach(function(doc, i) {
          filter.push(doc.filter)
          if (i == len) {
            irc.client.say(irc.to, filter.join(', '))
          }
        })
      }
    })
    
  }
}