const { response } = require("express");
const Profile = require("../models/profile");
const Usuario = require("../models/usuario");
const path = require('path');

const addProfile = async (req, res = response) => {
    const profile = await Profile({
        username: req.decoded.username,
        about: req.body.about,
    })

    res.json({
        ok: true,
        profile
    })

}

const updateProfileImg = async (req, res = response) => {
//     //const {imgUrl} = req.body;

//     const updateImg = await Profile.findByIdAndUpdate(req.params.userId, req.body);

//     if (req.file) {
//         updateImg.imgUrl = req.file.path
//     }

//     res.json({
//         ok: true,
//         updateImg,
//     })
// }



const updateImg = await Profile.findByIdAndUpdate(req.decoded.miId, req.body)
    if(req.file){
        updateImg.imgUrl = req.file.path
    }
    res.json({
        ok: true,
        updateImg,

    })
}

const getProfileById = async (req, res = response) => {
    const usuario = Usuario();

    const profile = await Profile.findOne(req.params.userId)
    //res.status(200).json(usuario) falta validacion

    res.json({
        ok: true,
        profile,
        usuario
    })
}

module.exports = {
    addProfile,
    updateProfileImg,
    getProfileById
}