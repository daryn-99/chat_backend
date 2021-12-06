const { response, Router } = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


const Usuario = require('../models/usuario');
const Role = require('../models/role');
const path = require('path');

require('dotenv').config();
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const { reset } = require('nodemon');
const { generarJWTPass } = require('../helpers/jwt');
const { renewToken } = require('../controllers/auth');

const getOneUsuario = async (req, res = response) => {
    Usuario.findOne({ data: req.uid }, (err, result) => {
        if (err) return res.json({ err: err });
        if (result == null) return res.json({ data: ['A'] });
        else return res.json({ data: result });
    }).sort({ createdAt: 'desc' })
}

const getUsuarios = async (req, res = response) => {

    const desde = Number(req.query.desde) || 0;

    const usuarios = await Usuario.find({ _id: { $ne: req.uid } }).sort('-online').skip(desde).limit(Usuario).populate("role", "name")

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
    const rolesuser = await Usuario.find({ user: req.uid }).populate('role', 'name');

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

    const usuarios = await Usuario.find().sort('-online').skip(desde).limit(Usuario).populate("role", "name")

    res.json({
        ok: true,
        usuarios,
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

const parseId = (id) => {
    return mongoose.Types.ObjectId(id)
}

const updateUserByid = async (req, res = response) => {

    const { id } = req.params
    const body = req.body
    Usuario.updateOne({ _id: id },
        body,
        (err, docs) => {
            res.send({
                items: docs
            })
        })
}

const deleteUserByid = async (req, res = response) => {
    const desde = Number(req.query.desde) || 0;
    const deleteUser = await Usuario.findByIdAndDelete({ _id: { $ne: req.params.userId } }).skip(desde);

    res.json({
        ok: true,
        deleteUser
    })
}

const passwordUpdate = async (req, res = response) => {

    const { email } = req.body;
    var { password } = req.body;
    const salt = bcrypt.genSaltSync();

    try {
        const existeEmail = await Usuario.findOne({ email });
        console.log(email)
        if (!existeEmail) {
            return res.status(404).json({
                ok: false,
                msg: 'El correo no está registrado'
            });
        }
        const usuario = await Usuario.findOneAndUpdate({ email },
            {
                $set:
                    { password: password = await bcrypt.hash(password, salt) },
            },
            { new: true },
            (err, result) => {
                if (err) return res.json(err);
                return res.json({
                    data: result
                })
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
}

const newPassword = async (req, res = response) => {
    var { user } = req.uid;
    var { password } = req.body;
    const salt = bcrypt.genSaltSync();

    try {
        const usuario = await Usuario.findOneAndUpdate({ _id: req.uid },
            {
                $set:
                    { password: password = await bcrypt.hash(password, salt) },
            },
            { new: true },
            (err, result) => {
                if (err) return res.json(err);
                return res.json({
                    data: result
                })
            }

        );
        //console.log(user);
        console.log("Enviado")
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}


const modificarUsuario = async (req, res) => {
    res.json({
        usuario: await usuarioService.modificarUsuario(req.body)
    })
}

const emailForgotPassword =
    async (req, res = response) => {
        const { email } = req.body;

        // try {
        const user = await Usuario.findOne({ email });
        if (!user) {
            res.status(404).send({
                msg: 'Email no encontrado'
            }
            )
        }

        if (email == '') {
            res.status(204).send({
                msg: 'El email es requerido'
            })
        }

        if (!user) {
            return res.status(206).json({
                ok: false,
                msg: 'El correo no está registrado'
            });
        }

        const token = await generarJWTPass(user.id);
        res.send({
            usuario: user,
            token
        });
        const link = `https://reconet.recoroatan.com/reset-password/${user.id}/${token}`;
        console.log(link);

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: `${process.env.EMAIL_ADDRESS}`,
                pass: `${process.env.EMAIL_PASSWORD}`,
            }
        });
        const mailOptions = {
            from: 'puertosammir@gmail.com',
            to: `${user.email}`,
            subject: 'Enlace para recuperar tu contraseña',
            text: 'Hola! Ingresa al siguiente enlace para poder restablecer tu contraseña' + " " + `https://reconet.recoroatan.com/reset-password/${user.id}/${token}`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Ha ocurrido un error:', err);
            } else {
                console.log('Respuesta: ' + info.response);
                res.status(200).json('El mail de recuperación ha sido enviado');
            }
        })

    }

let regExPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$1%*?&#]{8,16}$/;

const resetPassword =
    async (req, res = response) => {
        const { email } = req.body;
        const user = await Usuario.findOne({ email });

        if (!user) {
            res.status(404).send({
                msg: 'Email no encontrado'
            })
            // return res.status(404).json({
            //     ok: false,
            //     msg: 'Email no encontrado'
            // });                
        }

        if (email == '') {
            res.status(204).send({
                msg: 'El email es requerido'
            })
        }

        if (!user) {
            return res.status(206).json({
                ok: false,
                msg: 'El correo no está registrado'
            });
        }

        if (!regExPassword.test(req.body.password)) {
            res.send({
                msg: 'La contraseña debe de contener por lo menos: Entre 8 y 16 cáracteres, 1 numero, 1 letra minuscula, 1 letra mayuscula y un caracter especial'
            });
            return;
        }

        try {
            req.body.password = await bcrypt.hash(req.body.password, 10)
            const resetpassword = await Usuario.updateOne(req.body, {
                where: {
                    user: req.params.user, tokenresetPassword: req.params.tokenresetPassword
                }
            });
            res.status(201).send({
                resetpassword,
                msg: 'Contraseña actualizada con éxito'
            })
        } catch (err) {
            res.status(500).send({
                msg: 'Error',
                err
            })
        }
    }

const updateImg = async (req, res = response) => {
    const remove = path.join(__dirname, '..', 'storage')
    const relPath = req.file.path.replace(remove, '').replace(/\\/g, '/')

    Usuario.findOneAndUpdate(

        { user: req.uid },
        {
            $set: {
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

const updateusuarioUser = async (req, res = response) => {
    const remove = path.join(__dirname, '..', 'storage')
    const relPath = req.file.path.replace(remove, '').replace(/\\/g, '/')
    const imgUrl = relPath;
    Usuario.findOneAndUpdate(

        { user: req.params.uid },
        {
            $set: {
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


const updateDescr = async (req, res = response) => {
    let usuario = {};
    await Usuario.findOne({ _id: req.uid }, (err, result) => {
        if (err) {
            usuario = {};
        }
        if (result != null) {
            usuario = result;
        }
    });
    Usuario.findOneAndUpdate(
        { _id: req.uid },
        {
            $set: {
                descripcion: req.body.descripcion ? req.body.descripcion : usuario.descripcion,
                // nombre: req.body.nombre ? req.body.nombre : usuario.nombre,
                // cargo: req.body.cargo ? req.body.cargo : usuario.cargo,
                // area: req.body.area ? req.body.area : usuario.area,
                // birth: req.body.birth ? req.body.birth : usuario.birth,
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








module.exports = {
    getUsuarios,
    getAllUsuarios,
    getUsuarioById,
    updateUserByid,
    deleteUserByid,
    getLastUsers,
    getUsersByGroups,
    getUserRole,
    passwordUpdate,
    emailForgotPassword,
    resetPassword,
    updateImg,
    getOneUsuario,
    modificarUsuario,
    updateusuarioUser,
    updateDescr,
    newPassword
}
