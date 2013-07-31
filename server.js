var http = require('http')

var server = http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.end('Hello World\n')
}).listen(process.env.PORT)

server.on('error', function(err) {
  console.log('server error', err)
})