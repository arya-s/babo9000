var request = require('request')
  , cheerio = require('cheerio')
  , messages = require('./messages.js')
  , util = require('util')
  , config = require('./config.js')

function commands (command, nick, to, text, client) {
  switch (command) {
    case 'say':
      client.say(to, text.substring(5))
      break
    case 'scrim':
    case 'scrims':
    case 'events':
      text = text.trim()
      scrapeSteam(text.split(' ')[1], to, client)
      break
    case 'cd':
      countdown(5, to, client)
      break
    case 'time':
      getCurrentTime(to, client)
      break
    case 'mail':
      storeMessage(nick, to, text, client)
      break
    default:
      break
  }
}

function storeMessage (sender, to, text, client) {
  var recepient = text.split(' ')
    , message

  if (!recepient) return

  message = util.format('%s, you have mail from %s: %s', recepient[1], sender, recepient.splice(2).join(' '))
  messages[recepient[1]] = message
  client.say(to, 'Mail stored. Relaying to recepient on next join')
}

function getCurrentTime (to, client) {
  var time = new Date(Date.now())
  client.say(to, time)
}

function countdown (i, to, client) {
  client.say(to, i.toString())
  i--
  if (i>=0) {
    global.setTimeout(function() {
      countdown(i, to, client)
    }, 1000)
  }
}

function scrapeSteam (limit, to, client) {
  //prevent non positive integers or alpha chars from triggering
  if (typeof limit === 'string') {
    limit = parseInt(limit, 10)
    if (isNaN(limit) || limit <= 0) return
  }
  //set cookie for US east time
  //jar required here *I think* because otherwise other timezoneOffset cookie
  //set by the site will override the manually added one
  var jar = request.jar()
    , timezoneoffset = util.format('timezoneOffset=%s,0', config.timezoneoffset)

  jar.add(request.cookie(timezoneoffset))
  request({url: config.group, jar: jar}, getHTML)

  function getHTML (error, response, body) {
    if (error)
      console.log('error', error)
    var eventDateBlock
      , eventTitle
      , msg = []
      , done

    $ = cheerio.load(body)
    //#eventListing div contains non expired events
    eventTitle = $('#eventListing .headlineLink')
    eventDateBlock = $('#eventListing .eventDateBlock')
    //know when to break out of each loop
    done = eventDateBlock.length

    eventDateBlock.each(getEventDatesAndTimes)
    
    function outputEvents () {
      var i=0
        , len = msg.length

      msgInterval()

      function msgInterval () {
        client.say(to, msg[i++])
        if (i<len) {
          global.setTimeout(function() {
            msgInterval()
          }, 1000)
        }
      }
    }

    function getEventDatesAndTimes (index, el) {
      var dayAndDate
        , time
        , $this = $(this)
        , title = eventTitle.eq(index).text()
        , offset = ((new Date()).getTimezoneOffset())/60

      dayAndDate = $this.children().eq(0).text()
      time = $this.children().eq(2).text()
      msg.push(util.format('%s %s at %s UTC -%s', title, dayAndDate, time, offset))

      if (index >= limit-1) {
        outputEvents()
        return false
      }

      if (msg.length === done) {
        outputEvents()
      }
    }
  }
}

module.exports = commands