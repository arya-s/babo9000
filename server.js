
/**
 * Module dependencies.
 */
module.exports = function(db) {
  var express = require('express')
    , routes = require('./routes')
    , http = require('http')
    , path = require('path')

  var app = express()
    , server = http.createServer(app)
    , io = require('socket.io').listen(server)
    , ircEmitter = require('./lib/helpers.js').ircEmitter

  io.sockets.on('connection', function(socket) {
    //emit irc events to site
    ircEmitter.on('message', function(irc) {
      socket.emit('message', irc)
    })
  })

  app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(app.router);
  });

  app.configure('development', function(){
    app.use(express.errorHandler());
  });

  app.get('/', routes.index)
  app.get('/partials/:name', routes.partials)
  require('./routes/api')(app, db)
  //make sure we don't 500 on refresh
  app.get('*', routes.index)

  server.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  })  

}
