var fs = require('fs'),
    port = process.env.VCAP_APP_PORT || 3000,
    redis = require('socket.io/node_modules/redis'),
    uuid = require("node-uuid"),
    host = process.env.VCAP_APP_HOST || 'localhost';

if (process.env.VCAP_SERVICES) {
  var dbData = JSON.parse(process.env.VCAP_SERVICES)["redis-2.2"][0].credentials;
}
else {
  var dbData = { "port" : 6379, "hostname" : "localhost" };
}

var pub = redis.createClient(dbData["port"], dbData["hostname"]);
var sub = redis.createClient(dbData["port"], dbData["hostname"]);
var store = redis.createClient(dbData["port"], dbData["hostname"]);

if (dbData["password"]) {
  pub.auth(dbData["password"], function(){console.log("connected! pub")});
  sub.auth(dbData["password"], function(){console.log("connected! sub")});
  store.auth(dbData["password"], function(){console.log("connected! store")});
}

var app = require('http').createServer(handler),
io = require('socket.io').listen(app);

io.configure(function() {
  io.set('log level', 3);
  io.set("transports", ["xhr-polling"]);
  io.set('max reconnection attempts', 100);
  var RedisStore = require('socket.io/lib/stores/redis');
  io.set('store', new RedisStore({redisPub:pub, redisSub:sub, redisClient:store}));
});

io.sockets.on('connection', function (socket) {
  socket.on('sendchat', function(data) {
    io.sockets.emit('updatechat', process.pid, data);
  });
});

app.listen(port, host);

console.log("Listening on " + port);

function handler (req, res) {
  params = require('url').parse(req.url);
  if(params.pathname == '/js/client.js')
    filename = '/js/client.js';
  else
    filename = '/index.html';
  fs.readFile(__dirname + filename,
              function (err, data) {
                if (err) {
                  res.writeHead(500);
                  return res.end('Error loading index.html');
                }
                res.writeHead(200, {
                  'Set-Cookie': 'JSESSIONID=' + uuid.v4(), // provides sticky session
                  'Content-Type': 'text/html'
                });
                res.end(data);
              });
}