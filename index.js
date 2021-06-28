const express = require('express');
const path = require('path');
require('dotenv').config();



require ('./libs/initialSetup').createRole();


// DB Config
require('./database/config').dbConnection();


// App de Express
const app = express();

// Lectura y parseo del Body
app.use( express.json() );


// Node Server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require('./sockets/socket');



// Path público
const publicPath = path.resolve( __dirname, 'public' );
app.use( express.static( publicPath ) );



// Mis Rutas
app.use( '/api/login', require('./routes/auth') );
app.use( '/api/usuarios', require('./routes/usuarios') );
app.use( '/api/mensajes', require('./routes/mensajes') );
app.use('/api/profile', require('./routes/profile'));
//app.use('/public', express.static(`${__dirname}/storage/imgs`))
app.use('/storage', express.static('storage'))


server.listen( process.env.PORT, ( err ) => {

    if ( err ) throw new Error(err);

    console.log('Servidor corriendo en puerto', process.env.PORT );

});


