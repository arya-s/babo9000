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
  , commands = {
    say: function(nick, to, text, client) {
      client.say(to, text.substring(5))
    }
    , scrim: function(nick, to, text, client) {
      scrapeSteam(text.split(' ')[1], client)
    }
    , scrims: function(nick, to, text, client) {
      scrapeSteam(text.split(' ')[1], client)
    }
    , events: function(nick, to, text, client) {
      scrapeSteam(text.split(' ')[1], client)
    }
    , cd: function(nick, to, text, client) {
      countdown(5)
    }
    , time: function(nick, to, text, client) {
      getCurrentTime(client)
    }
  }

client.on('message', function (nick, to, text) {
  var command = text.split(' ')[0].substring(1)

  console.log(nick + ' => ' + to + ': ' + text)
  
  if (text.indexOf(config.trigger) === 0) {
    if (commands.hasOwnProperty(command)) {
      commands[command](nick, to, text, client)
    }
  }
})

function getCurrentTime (client) {
  var d = new Date(Date.now()-(3*1000*60*60))
    , hours = d.getHours()
    , minutes = d.getMinutes()
    , seconds = d.getSeconds()
    , output = [hours, minutes, seconds]

  for (var i=0,len=output.length;i<len;i++) {
    if (output[i] < 10) {
      output[i] = '0' + output[i].toString()
    }
    if (i === output.length-1) {
      output = output.join(':')
      output += ' PST'
      client.say(config.channel, output)
    }
  }
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

function scrapeSteam (limit, client) {
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



