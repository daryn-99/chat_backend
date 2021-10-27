const { response } = require("express");
const Profile = require("../models/profile");
const Usuario = require("../models/usuario");

const path = require('path');
const usuario = require("../models/usuario");
const { isEmpty } = require("class-validator");


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

    Profile.find({}, (err, result) => {
        if (err) return res.json({err:err});
        if(result==null) return res.json({dato: []});
        else return res.json({dato: result});
    }).sort({ createdAt: 'desc' });

}

const getProfile = async (req, res = response) => {
    Profile.findOne({ user: req.uid }, (err, result) => {
        if (err) return res.json({ err: err });
        if (result == null) return res.json({ data: ['Añade una descripción'] });
        else return res.json({ data: result });
    }).sort({ createdAt: 'desc' })
}

const getownProfile = async (req, res = response) => {

    const usuario = req.params.user;
    const profile = await Profile.find(req.params.uid).sort({ createdAt: 'desc' }).populate({ path: 'nombre', model: 'Usuario' });
    

    res.json({
        ok: true,
        profile,
        usuario

    })
}


const addProfile = async (req, res = response) => {

    try {
        const profile = await Profile({
            user: req.uid,
            about: req.body.about,
            // imgUrl: req.file.path

        });

        await profile.save();

        res.json({
            ok: true,
            profile
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }


}

const getProfileById = async (req, res = response) => {

    const usuario = Usuario();

    const profile = await Profile.findOne(req.params.userId)

    if (!profile) {
        res.status(404).json({ message: 'No hay descripcion de Usuario' });
    }
    res.json({
        ok: true,
        profile,
        usuario
    })
}

const update = async (req, res = response) => {
    let profile = {};
    await Profile.findOne({ user: req.uid }, (err, result) => {
        if (err) {
            profile = {};
        }
        if (result != null) {
            profile = result;
        }
    });
    Profile.findOneAndUpdate(
        { user: req.uid },
        {
            $set: {
                about: req.body.about ? req.body.about : profile.about
            },
        },
        { new: true },
        (err, result) => {
            if (err) return res.json({ err: err });
            if (result == null) return res.json({ data: [] });
            else return res.json({ data: result });
        }
    );
}

const updateProfileImg = async (req, res = response) => {
    const remove = path.join(__dirname,'..','storage')
    const relPath = req.file.path.replace(remove,'').replace(/\\/g, '/')
    const imgUrl = relPath;
    Profile.findOneAndUpdate(
        
        { user: req.uid },
        {
            $set: {
                //about: req.body.about ? req.body.about : profile.about,
                imgUrl: relPath,
            },
        },
        { new: true },
        (err, result) => {
            if (err) return res.json(err);
            return res.json(result);
        }
    );
}

const addProfileImg = async (req, res = response) => {

    try {
        const profile = await Profile({
            user: req.uid,
            imgUrl: req.file.path

        });

        await profile.save();

        res.json({
            ok: true,
            profile
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }


}

module.exports = {
    addProfile,
    updateProfileImg,
    getProfiles,
    getProfileById,
    getownProfile,
    getProfile,
    update,
    addProfileImg
}