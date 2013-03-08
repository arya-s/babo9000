var config = require('./config.js')
  , irc = require('irc')
  , client = new irc.Client(
      'irc.quakenet.org'
      , 'BABO9000'
      , { channels: [config.channel + config.secret]
          , debug: true
          , floodProtection: true
          , floodProtectionDelay: 1000
        }
    )
  , request = require('request')
  , cheerio = require('cheerio')
  , events = require('events')

client.on('message', function (nick, to, text) {
  console.log(nick + ' => ' + to + ': ' + text)
  // look for .say at start of message and echo it to channel
  if (text.indexOf('.say') === 0) {
    client.say(to, text.substring(5))
  }
  //look for .scrim at start of message, make call to url and scrape event times
  else if (text.indexOf('.scrims') === 0 || text.indexOf('.scrim') === 0 || text.indexOf('.events') === 0) {
    scrapeSteam(text.split(' ')[1])
  }
  else if (text.indexOf('.cd') === 0) {
    countdown(5)
  }
  else if (text.indexOf('.time') === 0) {
    getCurrentTime()
  }
})

function getCurrentTime () {
  var d = new Date(Date.now()-(3*1000*60*60))
    , output = [d.getHours(), d.getMinutes(), d.getSeconds()].join(':')
  
  output += ' PST'
  client.say(config.channel, output)
}

function countdown (i) {
  client.say(config.channel, i.toString())
  i--
  if (i>=0) {
    global.setTimeout(function() {
      countdown(i)
    }, 1000)
  }
}

function scrapeSteam (limit) {
  limit = parseInt(limit, 10)

  request(config.group, getHTML)

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
        client.say(config.channel, msg[i++])
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

      dayAndDate = $this.children().eq(0).text()
      time = $this.children().eq(2).text()
      msg.push(title + ' ' + dayAndDate + ' at ' + time + ' PST')

      if (!isNaN(limit) && index >= limit-1) {
        outputEvents()
        return false
      }

      if (msg.length === done) {
        outputEvents()
      }
    }
  }
}



