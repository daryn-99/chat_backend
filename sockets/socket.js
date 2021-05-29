const { usuarioConectado, usuarioDesconectado } = require('../controllers/socket');
const { comprobarJWT } = require('../helpers/jwt');
const { io } = require('../index');


// Mensajes de Sockets
io.on('connection', (client) => {
    console.log('Cliente conectado');

    const [valido, uid ] = comprobarJWT(client.handshake.headers['x-token']);

    //Verificar autentificacion
    if (!valido) { return client.disconnect(); }

    //Cliente autenticado
    usuarioConectado(uid);
    


    client.join(uid);

    client.on('mensaje-personal', (payload) => {
        console.log(payload);

        io.to(payload.para).emit('mensaje-personal', payload);
    })

    client.on('disconnect', () => {
        usuarioDesconectado(uid);
        console.log('Cliente desconectado');
    });


    
    // client.on('mensaje', ( payload ) => {
    //     console.log('Mensaje', payload);
    //     io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );
    // });


});
