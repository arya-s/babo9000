//highlight user with a message in the future based on user input
//using settimeout
//on command execution, store in the db the time set
//incase the bot eofs, we can retrieve any uncompleted reminders 
//on bot init by calculating the time difference
//if time ended during bot disc, simply alert the user once the bot inits
//probably do not need to keep this data, purge any completed reminders
module.exports = function(irc) {
  function parseTime(input) {
    //this is crap. i hate regex
    var time = [
      input.match(/\d+d/i)
    , input.match(/\d+h/i)
    , input.match(/\d+m/i)
    , input.match(/\d+s/i)
    ]
    if (!validDate(time)) {
      irc.client.say(irc.to, 'enter a valid date. the format is XdXhXmXs')
    }
    var msTotal = totalTime(convertTime(convertInt(time)))
    return msTotal
  }

  function validDate(t) {
    return t.some(function(e) {
      return e !== null
    })
  }

  function convertInt(t) {
    return t.map(function(e) {
      if (e === null) return null
      else return parseInt(e, 10)
    })
  }

  //this is crap
  function convertTime(t) {
    var i = 0
    return t.map(function(e, indx) {
      if (!e) { 
        e = 0
      }
      if (indx == 0) {
        e *= 24*60*60*1000
        i = 60*60*1000
      }
      else if (indx == 3) {
        return e*1000
      } else {
        e *= i
        i /= 60
      }
      return e
    })
  }

  function totalTime(t) {
    return t.reduce(function(a,b) {
      return a+b
    }, 0)
  }

  function splitTimeFromMsg(text) {
    var splitText = text.split(' ')
      , time
      , msg

    if (splitText.length < 2) {
      irc.client.say(irc.to, 'you need a message')
    } else {
      time = splitText.slice(0)
      msg = splitText.slice(1)
    }
    console.log('msg', msg)
    return {
      born: new Date().getTime()
    , due: parseTime(time.join(''))
    , setter: irc.nick
    , msg: msg.join(' ')
    }
  }

  var doc = splitTimeFromMsg(irc.text)

  irc.db.setReminder(doc, function(err) {

    if (err) {
      irc.client.say(irc.to, 'error setting your reminder')
    } else {
      irc.client.say(irc.to, 'reminder saved')
      //immediately start timer
      global.setTimeout(function() {
        irc.client.say(irc.to, 'Reminder: ' + doc.setter + ', ' + doc.msg)
        irc.db.delReminder(doc, function(err) {
          if (err) client.say(channel, 'error deleting completed reminder')
        })
      }, doc.born + doc.due - new Date().getTime())
    }
  })
}