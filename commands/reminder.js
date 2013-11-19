//highlight user with a message in the future based on user input using settimeout
//on command execution, store in the db the time set
//incase the bot eofs, we can retrieve any uncompleted reminders on bot 
//init by calculating the time difference
//if time ended during bot disc, simply alert the user once the bot inits
//probably do not need to keep this data, purge any completed reminders
module.exports = function(irc) {
  function parseTime(time) {
    //given an array with string elements inside
    //e.g. ['3d', '2h', '2m', '1s']
    //convert all elements into int and calculate total into milliseconds
    return totalTime(convertTime(convertInt(time)))
  }

  function validDate(t) {
    return t.some(function(e) {
      return e !== null
    })
  }

  function convertInt(t) {
    //strips chars from string as well as making into int
    //makes null into 0
    return t.map(function(e) {
      if (e === null) return 0
      else return parseInt(e, 10)
    })
  }

  //this is crap
  function convertTime(t) {
    var i = 60*60*1000
    return t.map(function(e, indx) {
      if (indx == 0) {
        e *= 24*60*60*1000
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

  function createDoc(msg, time) {
    return {
      born: new Date().getTime()
    , due: parseTime(time)
    , setter: irc.nick
    , msg: msg
    }
  }

  function isValidTime(time) {
    //if there is an ommited portion of time, 
    //that particular element is null
    var parsed = [ 
      time.match(/\d+d/i)
    , time.match(/\d+h/i)
    , time.match(/\d+m/i)
    , time.match(/\d+s/i)
    ]
    var isValidTime = parsed.some(function(e) {
      return e !== null
    })
    if (!isValidTime) {
      return false
    } else {
      return parsed
    }
  }

  function isValidMsg(text) {
    return text.length >= 2
  }

  //first split user input into time and msg
  var split = irc.text.split(' ')
    , parsedTime = isValidTime(split[0])

  //if time does not pass regex, output this error
  if (!parsedTime) {
    irc.client.say(irc.to, 'enter a valid date. the format is XdXhXmXs')
    return false
  }
  //if there is no msg, output this error
  if (!isValidMsg(split)) {
    irc.client.say(irc.to, 'you need a message')
    return false
  } else {
  //if pass, then create document 
    var doc = createDoc(split[1], parsedTime)
  }
  //insert this doc into db
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