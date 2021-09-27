const { response, Router } = require('express');
const Usuario = require('../models/usuario');
const Role = require('../models/role')
// const imgUrl = require('../libs/storage');
const path = require('path');


const getUsuarios = async (req, res = response) => {

    const desde = Number(req.query.desde) || 0;

    const usuarios = await Usuario.find({ _id: { $ne: req.uid } }).sort('-online').skip(desde).limit(Usuario)

    res.json({
        ok: true,
        usuarios,
        desde
    })
}

const getLastUsers = async (req, res = response) => {

    const desde = Number(req.query.desde) || 0;

    const lastusers = await Usuario.find({}).sort('createdAt').skip(desde).limit(Usuario)

    res.json({
        ok: true,
        lastusers,
        desde
    })
}

const getUserRole = async (req, res = response) => {
    const rolesuser = await Role.find({})

    res.json({
        ok: true,
        rolesuser
    })
}

const getUsersByGroups = async (req, res = response) => {

    const desde = Number(req.query.desde) || 0;

    const lastusers = await Usuario.find({ online: true }).sort('updatedAt')

    res.json({
        ok: true,
        lastusers,
        desde
    })
}



const getAllUsuarios = async (req, res = response) => {

    const desde = Number(req.query.desde) || 0;

    const allUsuarios = await Usuario.find({}).sort('area').skip(desde).limit(Usuario)

    // if (allUsuarios.length > 0) {
    //     res.send(allUsuarios);
    // } else {
    //     res.status(404).json({message: 'No hay registros de Usuarios'})
    // }


    res.json({
        ok: true,
        allUsuarios,
        desde
    })
}


const getUsuarioById = async (req, res = response) => {

    const usuario = await Usuario.findOne(req.params.area, req.body)
    //res.status(200).json(usuario) falta validacion

    res.json({
        ok: true,
        usuario
    })
}

const updateUserByid = async (req, res = response) => {

    const updatedUser = await Usuario.findByIdAndUpdate(req.params.userId, req.body)

    // if(req.file){
    //     const {filename} = req.file
    //     updatedUser.setImgUrl(filename)
    // }

    res.json({
        ok: true,
        updatedUser
    })
}

const deleteUserByid = async (req, res = response) => {
    const deleteUser = await Usuario.findByIdAndDelete(req.params.userId)

    res.json({
        ok: true,
        deleteUser
    })
}

const passwordUpdate = async (req, res = response) => {


    const { email, password } = req.params;

    try {
        const existeEmail = await Usuario.findOne({ email });
        if (!existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo no está registrado'
            });
        }
        const updatedPass = await Usuario.findOneAndUpdate({ email: req.params.email },
            {
                $set:
                    { password: req.body.password }
            },
            {new: true},
            (err, result) => {
                if(err) return res.json(err);
                return res.json(result);
            }
            );

        // if(req.file){
        //     const {filename} = req.file
        //     updatedUser.setImgUrl(filename)
        // }

        // res.json({
        //     ok: true,
        //     updatedPass
        // })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}






// console.log(req.params.userId);
// Usuario.findOneAndUpdate(
//     { userId: req.params.userId },
//     {
//         $set: { password: req.body.password, }
//     },
//     (err, result) => {
//         if (err) return res.status(500).json({msg: err});
//         const msg = {
//             msg: 'Contraseña actualizada',
//             userId: req.params.userId,
//         };
//         return res.json(msg);
//     }
// );


module.exports = {
    getUsuarios,
    getAllUsuarios,
    getUsuarioById,
    updateUserByid,
    deleteUserByid,
    getLastUsers,
    getUsersByGroups,
    getUserRole,
    passwordUpdate
}
