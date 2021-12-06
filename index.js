const express = require('express');
const path = require('path');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validarJWTPass } = require('./middlewares/validar-jwt');
const { generarJWTPass, comprobarJWT } = require('./helpers/jwt');

var https = require('https');
const fs = require('fs');
const Usuario = require('./models/usuario');
const usuario = require('./models/usuario');



require('./libs/initialSetup').createRole();


// DB Config
require('./database/config').dbConnection();


// App de Express
const app = express();

// Lectura y parseo del Body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

app.get('/forgot-password', (req, res, next) => {
    res.render('forgot-password');
});

app.post('/forgot-password', async (req, res, next) => {
    const { email } = req.body;


    const user = await Usuario.findOne({ email });
    console.log(user);

    if (!user) {
        res.send('Usuario no registrado');
        return;
    }

    const token = await generarJWTPass(user.id);
    res.send({
        usuario: user,
        token
    });
    //res.send('El link de recuperacion de password fue enviado a tu email....');
    const link = `https://reconet.recoroatan.com/reset-password/${user.id}/${token}`;
    console.log(link);

});


app.get('/reset-password/:id/:token', (req, res, next) => {
    const { id, token } = req.params;

    // Check if this id exist in database

    // We have a valid id, and we have a valid user with this id

    try {
        user = Usuario.findById(id);
        //token = validarJWTPass()
        res.render('reset-password', { email: user.email });
    } catch (error) {
        console.log(error.message);
        res.send(error.message);
    }
});


app.post('/reset-password/:id/:token', async (req, res, next) => {
    const { id, token } = req.params;
    const { email } = req.body;
    var { password } = req.body;
    const salt = bcrypt.genSaltSync();

    try {
        const existeEmail = await Usuario.findOne({ email });
        console.log(email)
        if (!existeEmail) {
            return res.send('El correo no está registrado');
        }
        const usuario = await Usuario.findOneAndUpdate({ email },
            {
                $set:
                    { password: password = await bcrypt.hash(password, salt) },
            },
            { new: true },
            (err, result) => {
                if (err) return res.json(err);
                return res.send("Enviado");
            }

        );

        console.log("Enviado")

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
});


// Node Server
// var server = require('http').createServer(app);
// module.exports.io = require('socket.io')(server);
// require('./sockets/socket');



// Path público
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));
app.use('/api/storage/posts', express.static('storage/posts'));
app.use('/api/storage', express.static('storage'));
//app.use('/api/storage/imgs', express.static(path.join(__dirname, '/storage/imgs'))); 




// Mis Rutas
app.use('/api/login', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/mensajes', require('./routes/mensajes'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/post', require('./routes/post'));
app.use('/api/role', require('./routes/role'));


//app.use('/storage', express.static(`${__dirname}/storage/imgs`))

// app.use('/storage', express.static('storage'))
//const dns = require('dns');
const hostname = '192.168.80.149'
const port = 443;

var options = {
    cert: fs.readFileSync('reconet.recoroatan.com-crt.pem'),
    key: fs.readFileSync('reconet.recoroatan.com-key.pem'),
    requestCert: false,
    rejectUnauthorized: false
};

server = https.createServer(options, app);


server.listen(port, hostname, function () {
    console.log(`Server running at https://${hostname}:${port}/`);
});

module.exports.io = require('socket.io')(server);
require('./sockets/socket');


// server.listen( port, ( err ) => {

//     if ( err ) throw new Error(err);

//     console.log('Servidor corriendo en puerto', port);

// });

// server.listen(port, hostname, () => {
//     console.log(`Server running at http://${hostname}:${port}/`);
// });


    // //TODO: Agregar las direcciones, nombre del dominio

    // var Service = require('node-windows').Service;

    // // Create a new service object
    // var svc = new Service({
    //     name:'Node Server Service',
    //     description: 'The nodejs service from RECONNET.',
    //     script: 'C:\Users\Daryn\Desktop\Flutter\chat_backend-1\index.js'
    // });

    // // Listen for the "install" event, which indicates the
    // // process is available as a service.
    // // svc.on('install',function(){
    // //     svc.start();
    // // });

    // // svc.install();

    // svc.on('uninstall',function(){
    //     console.log('Uninstall complete.');
    //     console.log('The service exists: ',svc.exists);
    // });

    // // Uninstall the service.
    // svc.uninstall();