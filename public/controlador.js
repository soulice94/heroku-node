var myapp = angular.module("chat", []);

      myapp.factory('socket', ['$rootScope', function($rootScope) {
         var socket = io();

         return {
            on: function(eventName, callback){
               socket.on(eventName, callback);
            },
            emit: function(eventName, data) {
               socket.emit(eventName, data);
            }
         };
      }]);

      myapp.controller("principal", function($scope, $timeout, socket){
         
         var usuario;
         $scope.mensajes = [];
         $scope.mensaje = {
            usuario:"",
            contenido:""
         };
         
         $scope.mensaje_error = "";

         $scope.asigna_nombre = function asigna_nombre(){
            socket.emit('set_nombre_usuario', $scope.mensaje.usuario);
         }

         socket.on('usuario_existente', function(data){
            $scope.$apply(function(){
               $scope.mensaje_error = data.mensaje;
               var contenido = document.getElementById("error-container");
               contenido.style.display = "block";
               contenido.style.opacity = "1";
                $timeout(function(){
                  contenido.style.opacity = "0";
               },2500);
               $timeout(function(){
                  contenido.style.display = "none";
               },3000);
            });
         });
         
         socket.on('usuario_asignado', function(data){
            usuario = data.nombre_usuario;
            var elementos = document.getElementsByName("celda");
            for (var i = 0; i < elementos.length; i++) {
               elementos[i].style.display = "inline";
            };
         });

         $scope.envia_mensaje = function(){
            console.log("vale verga");
            socket.emit("msg", $scope.mensaje);
            console.log("la vida");
         }

         socket.on('newmsg', function(data){
            $scope.$apply(function(){
               if(usuario){
                  $scope.mensajes.push(data);
               }
            });
         });
      });