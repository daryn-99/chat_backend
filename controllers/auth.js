const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const usuario = require('../models/usuario');
const Role = require('../models/role');
const path = require('path');


const crearUsuario = async (req, res = response ) => {

    const { email, password, role, username } = req.body;
    

    try {

        const existeEmail = await Usuario.findOne({ email });
        if( existeEmail ) {
            return res.status(404).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const existeUsername = await Usuario.findOne({ username });
        if( existeUsername) {
            return res.status(400).json({
                ok: false,
                msg: 'El username ya está registrado'
            });
        }

        const usuario = new Usuario( req.body );

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );
        
        //Si no se asigna un rol, asigna "empleado" automaticamente
        if(role){
            const foundRole = await Role.find({name: {$in: role}})
            usuario.role = foundRole.map(role => role.id)
        } else {
            const role = await Role.findOne({name: 'empleado'})
            usuario.role = [role.id]
        }

        await usuario.save().then((result) => {
            res.json({data: result["_id"]});
        });
        console.log(usuario)

        // Generar mi JWT
        /*const token = await generarJWT( usuario.id );
        */
        res.json({
            ok: true,
            usuario
        });


    } catch (error) {
        res.status(500).status({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const login = async ( req, res = response ) => {

    const { email, password } = req.body;

    try {
        
        const usuarioDB = await Usuario.findOne({ email }).populate('role');
        console.log(usuarioDB);
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
            
        }

        // Validar el password
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        if ( !validPassword ) {
            return res.status(403).json({
                ok: false,
                msg: 'La contraseña no es valida'
            });
        }


        // Generar el JWT
        const token = await generarJWT( usuarioDB.id );
        
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}


const renewToken = async( req, res = response) => {

    const uid = req.uid;

    // generar un nuevo JWT, generarJWT... uid...
    const token = await generarJWT( uid );

    // Obtener el usuario por el UID, Usuario.findById... 
    const usuario = await Usuario.findById( uid );

    res.json({
        ok: true,
        usuario,
        token
    });

}

const updateImg = async (req, res = response) => {
    const remove = path.join(__dirname,'..','storage')
    const relPath = req.file.path.replace(remove,'').replace(/\\/g, '/')
    const imgUrl = relPath;

    let usuario = {};
        await Usuario.findOne({ _id: req.uid }, (err, result) => {
            if (err) {
                usuario = {};
            }
            if (result != null) {
                usuario = result;
            }
        });
    Usuario.findOneAndUpdate({_id: req.uid} , 
        {
        $set: {
            imgUrl: relPath,
        },
    }, { new: true },
        (err, result) => {
            if (err) return res.json(err);
            return res.json(result);
        } 
    );
}


const updateProfileUser = async (req, res = response) => {
    const remove = path.join(__dirname,'..','storage')
    const relPath = req.file.path.replace(remove,'').replace(/\\/g, '/')
    const imgUrl = relPath;
    let usuario = {};

    Usuario.findOneAndUpdate({ _id: req.params.id }, 
        {
        $set: {
            imgUrl: relPath,
        },
    }, { new: true },
        (err, result) => {
            if (err) return res.json(err);
            return res.json(result);
        } 
    );

}



module.exports = {
    crearUsuario,
    login,
    renewToken,
    updateImg,
    updateProfileUser
}
