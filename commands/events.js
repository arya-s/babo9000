var request = require('request')
  , cheerio = require('cheerio')
  , util = require('util')

//settings
var timezoneoffset = '-14400'
  , group = 'http://steamcommunity.com/groups/girlbloggers/'
  
//event content is ajaxed so must use ?content_only for the times and dates
group += 'events?content_only=true'

module.exports = function(irc) {
  var limit = irc.text.trim().split(' ')[1]
  //prevent non positive integers or alpha chars from triggering
  if (typeof limit === 'string') {
    limit = parseInt(limit, 10)
    if (isNaN(limit) || limit <= 0) return
  }
  //set cookie for US east time
  //jar required here *I think* because otherwise other timezoneOffset cookie
  //set by the site will override the manually added one
  var jar = request.jar()
    , timezoneoffset = util.format('timezoneOffset=%s,0', timezoneoffset)

  jar.add(request.cookie(timezoneoffset))
  request({url: group, jar: jar}, getHTML)

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
        irc.client.say(irc.to, msg[i++])
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