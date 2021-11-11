const express = require('express');
const path = require('path');
require('dotenv').config();

const https = require('https');
const fs = require('fs');



require ('./libs/initialSetup').createRole();


// DB Config
require('./database/config').dbConnection();


// App de Express
const app = express();

// Lectura y parseo del Body
app.use( express.json() );


// Node Server
const server = https.createServer(app);
module.exports.io = require('socket.io')(server);
require('./sockets/socket');



// Path público
const publicPath = path.resolve( __dirname, 'public' );
app.use( express.static( publicPath ) );
app.use('/api/storage/posts',express.static('storage/posts'));
app.use('/api/storage',express.static('storage'));
//app.use('/api/storage/imgs', express.static(path.join(__dirname, '/storage/imgs'))); 




// Mis Rutas
app.use( '/api/login', require('./routes/auth') );
app.use( '/api/usuarios', require('./routes/usuarios') );
app.use( '/api/mensajes', require('./routes/mensajes') );
app.use('/api/profile', require('./routes/profile'));
app.use('/api/post', require('./routes/post')); 
app.use('/api/role', require('./routes/role'));

//app.use('/storage', express.static(`${__dirname}/storage/imgs`))

// app.use('/storage', express.static('storage'))
//const dns = require('dns');
const hostname = '192.168.80.149'
const port= 443;

https.createServer({
    cert: fs.readFileSync('reconet.recoroatan.com-crt.pem'),
    key: fs.readFileSync('reconet.recoroatan.com-key.pem')
}, app).listen(port, hostname, function(){
    console.log(`Server running at https://${hostname}:${port}/`);
});

// server.listen( port, ( err ) => {

//     if ( err ) throw new Error(err);

//     console.log('Servidor corriendo en puerto', port);

// });

// server.listen(port, hostname, () => {
//     console.log(`Server running at http://${hostname}:${port}/`);
// });


//TODO: Agregar las direcciones, nombre del dominio

// var Service = require('node-windows').Service;

// // Create a new service object
// var svc = new Service({
//     name:'Node Server Service',
//     description: 'The nodejs service from RECONNET.',
//     script: 'C:\Users\Daryn\Desktop\Flutter\chat_backend-1\index.js'
// });

// // Listen for the "install" event, which indicates the
// // process is available as a service.
// svc.on('install',function(){
//     svc.start();
// });

// svc.install();

// svc.on('uninstall',function(){
//     console.log('Uninstall complete.');
//     console.log('The service exists: ',svc.exists);
// });

// // Uninstall the service.
// svc.uninstall();