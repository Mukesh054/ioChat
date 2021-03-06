var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var users = [];
var connections = [];

server.listen( process.env.PORT || 4000 );
console.log('server running....');

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html')
});

io.sockets.on('connection', function(socket){
 
 	connections.push(socket);
 	console.log('connected : %s connections connected',connections.length);

 	socket.on('disconnect',function(){

	 	connections.splice(connections.indexOf(socket),1);
		console.log('Disconnected : %s connections connected',connections.length);
	});

	// Send message
	socket.on('send message',function(data){
	 	io.sockets.emit('new message',{msg:data,user:socket.username});
	});	

	// new User
	socket.on('new user',function(data,callback){
		callback(true);
		socket.username = data;
		users.push(socket.username);
	 	updateUsernames();
	});	

	function updateUsernames(){
		io.sockets.emit('get users',users);
	}

});