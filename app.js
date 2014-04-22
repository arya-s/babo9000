//connect to db and get instance before anything else
//this is ugly but i'm not sure of a better way to do it

if (process.env.NODE_ENV == 'development') global.b9config = require('./config').development
else global.b9config = require('./config').production

require('./lib/cmds.js')(init);

function init(cmds) {
   require('./lib/db.js')(app, cmds);
}

function app(db, cmds) {
  require('./server.js')(db)
  require('./lib/irc.js')(db, cmds)
}
