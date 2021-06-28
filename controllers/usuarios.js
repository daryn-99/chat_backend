const {response} = require('express');
const Usuario = require('../models/usuario');
// const imgUrl = require('../libs/storage');
const path = require('path');


const getUsuarios = async (req, res = response) => {

    const desde = Number(req.query.desde) || 0;

    const usuarios = await Usuario.find({_id: {$ne: req.uid}}).sort('-online').skip(desde).limit(Usuario)

    res.json({
        ok: true,
        usuarios,
        desde
    })
}


const getAllUsuarios = async (req, res = response) => {

    const desde = Number(req.query.desde) || 0;

    const allUsuarios = await Usuario.find({ }).sort('nombre').skip(desde).limit(Usuario)

    if (allUsuarios.length > 0) {
        res.send(allUsuarios);
    } else {
        res.status(404).json({message: 'No hay registros de Usuarios'})
    }


    res.json({
        ok: true,
        allUsuarios,
    })
}


const getUsuarioById = async (req, res = response) => {

    const usuario = await Usuario.findOne(req.params.userId)
    //res.status(200).json(usuario) falta validacion

    res.json({
        ok: true,
        usuario
    })
}

const updateUserByid = async (req, res = response) => {

    const updatedUser = await Usuario.findByIdAndUpdate(req.params.userId, req.body )

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



module.exports = {
    getUsuarios,
    getAllUsuarios,
    getUsuarioById,
    updateUserByid,
    deleteUserByid
}
