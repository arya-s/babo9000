var config = require('./config.js')
  , irc = require('irc')
  , client = new irc.Client(
      'irc.quakenet.org'
      , 'BABO9000'
      , { channels: [config.channel + config.secret]
          , debug:true
        }
    )
  , request = require('request')
  , cheerio = require('cheerio')

client.on('message', function (nick, to, text) {
  console.log(nick + ' => ' + to + ': ' + text)
  // look for .say at start of message and echo it to channel
  if (text.indexOf('.say') === 0) {
    message(to, text.substring(5))
  }
  //look for .scrim at start of message, make call to url and scrape event times
  else if (text.indexOf('.scrims') === 0 || text.indexOf('.scrim') === 0) {
    scrapeSteam()
  }
})

function message (target, message) {
  client.say(target, message)
}

function scrapeSteam () {
  request(config.group, getHTML)
}

function getHTML (error, response, body) {
  if (error)
    console.log('error', error)
  var eventDateBlock
    , msg = []
    , done

  $ = cheerio.load(body)
  eventDateBlock = $('#eventListing .eventDateBlock')
  done = eventDateBlock.length

  eventDateBlock.each(getEventDatesAndTimes)

  function getEventDatesAndTimes () {
    var dayAndDate
      , time
      , $this = $(this)
      , i = 0
      , len

    dayAndDate = $this.children().eq(0).text()
    time = $this.children().eq(2).text()
    msg.push('Scrim on ' + dayAndDate + ' at ' + time + ' PST')
    if (msg.length === done) {
      len = msg.length
      msgInterval()

      function msgInterval () {
        message(config.channel, msg[i++])
        if (i<len) {
          global.setTimeout(function() {
            msgInterval()
          }, 1000)
        }
      }
    }
  }
}

