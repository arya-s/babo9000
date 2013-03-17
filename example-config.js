var config = {
  channel: '#yourchannel'
  , secret: ' secret'
  , group: 'http://steamcommunity.com/groups/girlbloggers/'
  , trigger: '.'
  //utc offset for event times
  , timezoneoffset: '-14400'
}

//event content is ajaxed so must use ?content_only for the times and dates
config.group += 'events?content_only=true'
module.exports = config