module.exports = function(irc) {
  irc.db.getReminder(function(err, docs) {
    if (err) {
      irc.client.say(irc.to, 'error setting reminder timers')
    } else {
      docs.forEach(function(reminder) {
        global.setTimeout(function() {
          irc.client.say(irc.to, 'Reminder: ' + reminder.setter + ', ' + reminder.msg)
          irc.db.delReminder(reminder, function(err) {
            if (err) irc.client.say(irc.to, 'error deleting completed reminder')
          })
        }, reminder.born + reminder.due - new Date().getTime())
      })
    }
  })
}