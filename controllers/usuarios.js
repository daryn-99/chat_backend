const {response} = require('express');
const Usuario = require('../models/usuario');


const getUsuarios = async (req, res = response) => {

    const desde = Number(req.query.desde) || 0;

    const usuarios = await Usuario.find({_id: {$ne: req.uid}}).sort('-online').skip(desde).limit(80)



    res.json({
        ok: true,
        usuarios,
        desde
    })
}

const getById = async (req, res = response) => {
    const usuario = await Usuario.findById();
}



module.exports = {
    getUsuarios
}
