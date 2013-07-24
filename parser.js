var FeedParser = require('feedparser')
	, request = require('request')

var filter = ['[utw-mazui] railgun', '[commie] love lab']
	, len = filter.length

module.exports = function(channel, client) {
  request('https://www.tokyotosho.info/rss.php?filter=1')
	.pipe(new FeedParser())
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
	    console.log(reobj, item.title)
	    if (item.title.match(reobj) != null) {
	    	//say in irc
	    	client.say(channel, item.title + ' ' + item.link)
	    }
  	}
	})
}
