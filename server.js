
/**
 * Module dependencies.
 */
module.exports = function(db) {
  var express = require('express')
    , routes = require('./routes')
    , http = require('http')
    , path = require('path')
    , authmw = require('./routes/middleware/auth.js')

  var app = express()
    , server = http.createServer(app)
    , io = require('socket.io').listen(server)
    , ircEmitter = require('./lib/helpers.js').ircEmitter

  io.sockets.on('connection', function(socket) {
    //emit irc events to site
    ircEmitter.on('message', function(irc) {
      socket.emit('message', irc)
    })
    socket.on('send', function(msg) {
      ircEmitter.emit('send', msg)
    })
  })

  app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.urlencoded());
    app.use(express.json());
    app.use(express.cookieParser(global.b9config.cookie_secret))
    app.use(express.methodOverride());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(app.router);
  });

  app.configure('development', function(){
    app.use(express.errorHandler());
  });

  app.get('/', routes.layout)
  app.get('/partials/auth', routes.auth)
  app.get('/partials/:name', authmw, routes.partials)
  //ajax routes
  require('./routes/api')(app, db)
  
  //make sure we don't 500 on refresh
  app.get('*', routes.layout)

  server.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  })  

}
