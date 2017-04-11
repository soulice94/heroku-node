var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req, res){
    //res.sendFile(path.join(__dirname, '../chat', 'index.html'));
    res.sendFile(__dirname + '/index.html');
});

app.get('/mensajes', function(req, res){
    res.end(JSON.stringify(mensajes));
});

usuarios = [];
mensajes = [];

//para recibir todos los mensajes conviene usar express y no socket.io :v

io.on('connection', function(socket){
    console.log("un usuario se ha conectado");

    socket.on('set_nombre_usuario', function(data){
        if(usuarios.indexOf(data) == -1){
            usuarios.push(data);
            socket.emit('usuario_asignado', {nombre_usuario:data});
        }
        else{
            var lol = data + ': El usuario ya existe';
            socket.emit('usuario_existente', {mensaje:lol});
        }
    });

    socket.on('disconnect', function(){
        console.log("un usuario se ha desconectado");
    });

    socket.on('msg', function(data){
        console.log("un usuario ha mandado un mensaje:" + data.contenido);
        var color = "";
        var posicion = usuarios.indexOf(data.usuario);
        posicion = (posicion+1)%6;
        switch(posicion){
            case 1: color="#E91E63"; break;
            case 2: color="#4527A0"; break;
            case 3: color="#2196F3"; break;
            case 4: color="#689F38"; break;
            case 5: color="#FBC02D"; break;
            case 6: color="#D32F2F"; break;
        }
        data.color = color;
        io.sockets.emit('newmsg', data);
        mensajes.push(data);
    });
});

http.listen(3000, function(){
    console.log("escuchando en el puerto 3000 :v como andre 3000 ay si");
});