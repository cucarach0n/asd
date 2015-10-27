var express = require("express"),
	app = express(),
	server = require("http").createServer(app),
	io = require('socket.io').listen(server);
var conectados =[];
var nuevoConectado =[];
server.listen(3000);

app.get("/",function(require,res){
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection',function(socket){

	socket.on('send message',function(data)
	{
		io.sockets.emit('new message',data);
	});
	socket.on('entrar',function(usuario){
		
		conectados.push({user:usuario,id:socket.id});
		
		io.sockets.emit('listarcontactos',conectados);
	});
	socket.on('privado',function(datos){
		io.sockets.connected[datos.id].emit('new message', datos);
	});
	socket.on('desconectar',function(){
		nuevoConectado = conectados.filter(function(datos){
			return datos.id !== socket.id;
		});
		conectados = []
		conectados = nuevoConectado;
		io.sockets.emit('listarcontactos',conectados);
	});
});
