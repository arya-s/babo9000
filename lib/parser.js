var FeedParser = require('feedparser')
  , request = require('request')

module.exports = function(channel, client, db) {
  var filter
    , len

  db.filters(function(err, items) {
    if (err) {
      console.log('error reading filters from db')
    } else {
      var filter = []
        , len = items.length - 1

      items.forEach(function(doc, i) {
        filter.push(doc.filter)
        if (i == len) {
          len = filter.length

          var feed = request('https://www.tokyotosho.info/rss.php?filter=1', function(err) {
            if (err) {
              console.log('could not reach request')
              return
            }
          })
          feed.pipe(new FeedParser())
          .on('error', function(err) {
            console.log(err)
          })
          .on('readable', function() {
            var stream = this
              , item = stream.read()

            for (var i=0;i<len;i++) {
              //read filters from somewhere, escape any regex specials
              var escapeBrackets = filter[i].replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
                , currentFilter = escapeBrackets.split(' ')
                , re = '(?=.*'

              re += currentFilter.join(')(?=.*')
              re += ').+'
              var reobj = new RegExp(re, "i")
              if (item.title.match(reobj) != null) {
                //make sure this show was not parsed before so that we don't get repeats
                db.parsedShows({show: item.title}, function(err, found) {
                  if (err) {
                    client.say(channel, 'db error')
                  } else {
                    if (!found) {
                      //add this show to db so that it doesn't get said to channel in future
                      db.addParsedShow({show: item.title, link: item.link}, function(err) {
                        if (err) {
                          client.say(channel, 'error storing parsed show in db')
                        }
                      })
                      //say in irc
                      client.say(channel, item.title + ' ' + item.link)
                    }
                  }
                })
              }
            }
          })
        }
      })
    }
  })
}
