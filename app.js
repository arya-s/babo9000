//connect to db and get instance before anything else
//this is ugly but i'm not sure of a better way to do it

require('./lib/db.js')(app)

function app(db) {
  require('./server.js')
  require('./lib/irc.js')(db)
}