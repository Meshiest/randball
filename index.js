var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = {}

var command = {}

app.set('port', (process.env.PORT || 5000));

var idCount = 0;

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket) {

  var user = {};
  var id = idCount++;

  user.id = id;
  user.joinTime = new Date().getTime();
  user.socket = socket;
  user.color = getRandomColor();
  user.radius = Math.floor(Math.random()*70)+10;
  users[id] = user;
  socket.emit('settings', user.radius, user.color);
  console.log('user '+user.id+' connected');

  socket.on('launch',function( x, y, vx, vy) {
    socket.broadcast.emit('launch', x, y, vx, vy, user.radius, user.color)
  });

  socket.on('disconnect', function() {
    delete users[user.id];
    console.log('user '+user.id+' disconnected');
  });
});

http.listen(app.get('port'));

