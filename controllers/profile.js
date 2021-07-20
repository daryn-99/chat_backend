const { response } = require("express");
const Profile = require("../models/profile");
const Usuario = require("../models/usuario");

const path = require('path');
const usuario = require("../models/usuario");

const getProfiles = async (req, res = response) => {
    // const usuario = await Usuario.findOne({name: req.params.name});
    // const profiles = await Profile.findOne(req.params.uid,)
    // if (!profiles) {
    //     res.status(404).json({message: 'No hay descripcion de Usuario'});
    // } 

    // res.json({
    //     ok: true,
    //     profiles,
    //     usuario
    // })
    Profile.find({}, (err, docs) => {
        res.send({docs})
    }).sort({createdAt: 'desc'});
    
}

const getProfile = async (req, res = response) => {
    Profile.findOne({ user: req.uid }, (err, result) => {
    if (err) return res.json({ err: err });
    if (result == null) return res.json({ data: [] });
    else return res.json({ data: result });
    }).sort({createdAt: 'desc'});
}

const getownProfile = async (req, res = response) => {
    
    const usuario = req.params.user;
    const profile = await Profile.find(req.params.uid).sort({createdAt: 'desc'})

    res.json({
        ok: true,
        profile,
        usuario

    })
}


const addProfile = async (req, res = response) => {
    
    const profile = await Profile({
        user: req.uid,
        about: req.body.about

    });

    await profile.save();

    res.json({
        ok: true,
        profile
    });

}

const getProfileById = async (req, res = response) => {
    
    const usuario = Usuario();

    const profile = await Profile.findOne(req.params.userId)

    if (!profile) {
        res.status(404).json({message: 'No hay descripcion de Usuario'});
    } 
    res.json({
        ok: true,
        profile,
        usuario
    })
}

const updateProfileImg = async (req, res = response) => {
        //const {imgUrl} = req.body;

        const updateImg = await Profile.findByIdAndUpdate({
            user: req.uid,
        });

        if (req.file) {
            imgUrl = req.file.path
        }

        res.json({
            ok: true,
            updateImg,
            //'TODO: Agregar la validacion de limite de peso de multimedia'
        })
    }



//     Profile.findByIdAndUpdate({ username: req.decoded.username },
//         {
//             $set: {
//                 imgUrl: req.file.path,
//             },
//         },
//         { new: true },
//         (err, profile) => {
//             if (err) return res.status(500).send(err);
//             const response = {
//                 message: "image added successfully updated",
//                 data: profile,
//             };
//             return res.status(200).send(response);
//         }
//     )
// }


module.exports = {
    addProfile,
    updateProfileImg,
    getProfiles,
    getProfileById,
    getownProfile,
    getProfile
}