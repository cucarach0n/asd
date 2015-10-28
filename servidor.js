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
    //console.log(socket.id);
	socket.on('send message',function(data)
	{
		io.sockets.emit('new message',data);
		console.log("***"+data.nombre +" escribio: " + data.mensaje);
	});
	socket.on('entrar',function(usuario){
		
		conectados.push({user:usuario,id:socket.id});
		
		io.sockets.emit('listarcontactos',conectados);
		console.log("se conecto :" + usuario + " con el id :" + socket.id );
	});
	socket.on('privado',function(datos){
		io.sockets.connected[datos.id].emit('new message', datos);
		console.log("***"+datos.nombre +" escribio a " + datos.nombreDestino +" : "+datos.mensaje);
	});
	socket.once('disconnect',function(){
		nuevoConectado = conectados.filter(function(datos){
			return datos.id !== socket.id;
		});
		console.log("--Lista Total--");   
		console.log(conectados);
		conectados = [];
		conectados = nuevoConectado;
	/*	for (var i = 0; i < conectados.length; i++) {
		id = conectados[i].id ;
		io.sockets.connected[id].emit('listarcontactos',conectados);
		}*/
		io.sockets.emit('listarcontactos',conectados);
		console.log("Se desconecto: " + socket.id);
		console.log("--Lista Final--");  
		console.log(conectados);
	});
	/*socket.on('disconnect', function () {
        console.log("client has disconnected :" + socket.id);
    });*/

});