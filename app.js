require('./lib/db.js')(function(db) {
  require('./server.js')
  require('./lib/irc.js')(db)
})
